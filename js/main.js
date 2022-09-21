const API_KEY = 'GEJ0G4itd91z4CZDGfzcwTh1ybhX4dvk';
const BASE_URL = 'https://api.giphy.com/v1/gifs/';

searchInput = document.getElementById('search-input');
gifsDiv = document.getElementById('gifs');
searchForm = document.getElementById('search-form');
searchList = document.getElementById('search-list');
searchButton = document.getElementById('search-button');
errorDiv = document.getElementById('error');

let limit = 10;

let globalQuery = '';

const fetchGifs = async (query = '') => {
	let endpoint = '';
	console.log(globalQuery);
	if (JSON.parse(localStorage.getItem('queries'))) {
		populateSearchList();
	}

	if (query) {
		endpoint = `${BASE_URL}search?api_key=${API_KEY}&q=${query}&limit=${limit}&offset=0&rating=g&lang=en`;
	} else {
		endpoint = `${BASE_URL}trending?api_key=${API_KEY}&limit=${limit}&offset=0&rating=g`;
	}
	try {
		const response = await fetch(endpoint);
		if (response.status != 200) {
			throw new Error(
				`Something went wrong while trying to fetch your gifs (Status Code: ${response.status}).`
			);
		}
		const data = await response.json();
		if (!data.data.length) {
			throw new Error("Your search didn't return any gifs");
		}
		localStorage.setItem('gifs', JSON.stringify(data));
		if (query) {
			checkQueries(query);
			populateSearchList();
		}
		handleErrors();
		displayGifs();
		queryFlag = false;
	} catch (error) {
		handleErrors(error);
	}
};

const displayGifs = async () => {
	gifsDiv.innerHTML = '';
	gifs = JSON.parse(localStorage.getItem('gifs'));
	gifs.data.map(gif => {
		const gifElement = document.createElement('img');
		gifElement.setAttribute('src', gif.images.original.webp);
		gifElement.setAttribute('class', 'col');
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
		queryElement.setAttribute('class', 'list-group-item text-center');
		queryElement.addEventListener('click', e => {
			e.preventDefault();
			globalQuery = query;
			fetchGifs(query.trim());
		});
		searchList.appendChild(queryElement);
	});
};

const handleErrors = (error = '') => {
	if (error) {
		gifsDiv.innerHTML = '';
		errorDiv.innerHTML = error + ' <i class="fa-regular fa-face-sad-tear"></i>';
		errorDiv.setAttribute('style', 'display: block');
	} else {
		errorDiv.innerHTML = '';
		errorDiv.setAttribute('style', 'display: none');
	}
};

const loadMoreGifs = async () => {
	if (window.innerHeight + window.scrollY > document.body.offsetHeight) {
		limit += 2;
		if (globalQuery) {
			await fetchGifs(globalQuery);
		} else {
			await fetchGifs();
		}
	}
};

window.addEventListener('load', () => fetchGifs());

window.addEventListener('scroll', loadMoreGifs);

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	inputQuery = searchInput.value.trim();
	globalQuery = inputQuery;
	fetchGifs(inputQuery);
	searchInput.value = '';
});

searchButton.addEventListener('click', e => {
	e.preventDefault();
	inputQuery = searchInput.value.trim();
	globalQuery = inputQuery;
	fetchGifs(inputQuery);
	searchInput.value = '';
});
