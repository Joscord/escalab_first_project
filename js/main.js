// API CONSTANTS
const API_KEY = 'GEJ0G4itd91z4CZDGfzcwTh1ybhX4dvk';
const BASE_URL = 'https://api.giphy.com/v1/gifs/';

// HTML ELEMENTS
searchInput = document.getElementById('search-input');
gifsDiv = document.getElementById('gifs');
searchForm = document.getElementById('search-form');

// FUNCTIONS
const fetchGifs = async (query = '') => {
	let endpoint = '';
	if (query) {
		endpoint = `${BASE_URL}search?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`;
	} else {
		endpoint = `${BASE_URL}trending?api_key=${API_KEY}&limit=25&rating=g`;
	}
	const response = await fetch(endpoint);
	const data = await response.json();
	localStorage.setItem('gifs', JSON.stringify(data));
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

window.addEventListener('load', () => fetchGifs());

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	fetchGifs(searchInput.value);
	searchInput.value = '';
});
