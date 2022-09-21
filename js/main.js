const API_KEY = 'GEJ0G4itd91z4CZDGfzcwTh1ybhX4dvk';
const BASE_URL = 'https://api.giphy.com/v1/gifs/';

searchInput = document.getElementById('search-input');
gifsDiv = document.getElementById('gifs');
searchForm = document.getElementById('search-form');
searchList = document.getElementById('search-list');
searchButton = document.getElementById('search-button');

const fetchGifs = async (query = '') => {
	let endpoint = '';
	if (JSON.parse(localStorage.getItem('queries'))) {
		populateSearchList();
	}
	if (query) {
		endpoint = `${BASE_URL}search?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`;
	} else {
		endpoint = `${BASE_URL}trending?api_key=${API_KEY}&limit=25&rating=g`;
	}
	const response = await fetch(endpoint);
	const data = await response.json();
	localStorage.setItem('gifs', JSON.stringify(data));
	if (query) {
		checkQueries(query);
		populateSearchList();
	}
	displayGifs();
};

const displayGifs = async () => {
	gifsDiv.innerHTML = '';
	gifs = JSON.parse(localStorage.getItem('gifs'));
	gifs.data.map(gif => {
		const gifElement = document.createElement('img');
		gifElement.setAttribute('src', gif.images.original.webp);
		gifsDiv.appendChild(gifElement);
	});
};

const checkQueries = query => {
	if (!localStorage.getItem('queries')) {
		localStorage.setItem('queries', JSON.stringify([query]));
	} else {
		const queries = JSON.parse(localStorage.getItem('queries'));
		if (queries.includes(query)) {
			return;
		} else {
			if (queries.length === 3) {
				queries.shift();
			}
			queries.push(query);
		}
		localStorage.setItem('queries', JSON.stringify(queries));
	}
};

const populateSearchList = () => {
	searchList.innerHTML = '';
	const queries = JSON.parse(localStorage.getItem('queries'));
	queries.map(query => {
		const queryElement = document.createElement('li');
		queryElement.innerHTML = query;
		queryElement.addEventListener('click', e => {
			e.preventDefault();
			fetchGifs(query.trim());
		});
		searchList.appendChild(queryElement);
	});
};

window.addEventListener('load', () => fetchGifs());

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	fetchGifs(searchInput.value.trim());
	searchInput.value = '';
});

searchButton.addEventListener('click', () => {
	fetchGifs(searchInput.value.trim());
	searchInput.value = '';
});
