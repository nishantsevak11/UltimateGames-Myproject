const baseUrl = 'https://ultimategames-server-code.onrender.com/api/games';
const gameDetailUrl = 'https://ultimategames-server-code.onrender.com/api/game?id=';

let currentPage = 1; // Track current page for loading more games
let isLoading = false; // Prevent multiple simultaneous loads

// Retrieve the game type from localStorage (e.g., platform or category)
const whichGame = localStorage.getItem('game') || 'all'; // Default to 'all' if not set
localStorage.removeItem('game');

// List of known platforms to differentiate between platform and category
const knownPlatforms = ['pc', 'browser', 'all'];

// Function to navigate to the game detail page
function navigatePage(id) {
    localStorage.setItem('id', id);
    window.location.href = "gamePage.html";
}

// Function to fetch games with optional sorting, platform, category, and pagination
async function fetchGames(sortBy = '', type = 'all', page = 1) {
    // Determine if 'type' is a platform or category
    const isPlatform = knownPlatforms.includes(type);
    const url = `${baseUrl}?${isPlatform ? 'platform' : 'category'}=${type}&page=${page}${sortBy ? `&sort-by=${sortBy}` : ''}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : []; // Ensure it returns an array
    } catch (error) {
        console.error('Error loading games:', error);
        return []; // Return an empty array in case of error
    }
}

// Function to load and display games
async function loadAndDisplayGames(sortBy = '', type = 'all') {
    const games = await fetchGames(sortBy, type, currentPage);
    if (games.length) {
        games.forEach(displayGameElement); 
    } else {
        console.warn('No games available for the given criteria.');
    }
}

// Function to display individual game elements
function displayGameElement(gameData) {
    const gameElement = document.createElement("div");
    gameElement.className = "game-item";
    gameElement.id = gameData.id;

    const title = document.createElement("h3");
    title.innerText = gameData.title;

    const image = document.createElement("img");
    image.src = gameData.thumbnail;
    image.alt = gameData.title;

    const description = document.createElement("p");
    description.innerText = gameData.short_description;

    gameElement.append(image, title, description);
    document.querySelector(".pc-games-container").append(gameElement);

    gameElement.addEventListener("click", () => navigatePage(gameData.id));
}

// Add event listener to the sorting dropdown
document.getElementById('sort-options').addEventListener('change', async (event) => {
    const selectedSort = event.target.value;
    currentPage = 1; // Reset to the first page
    document.querySelector(".pc-games-container").innerHTML = ''; // Clear the current display of games
    await loadAndDisplayGames(selectedSort, whichGame); // Fetch and display sorted games
});

// Function to handle scrolling to load more games
async function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100;

    if (scrollPosition >= threshold && !isLoading) {
        isLoading = true;
        currentPage++;
        await loadAndDisplayGames('', whichGame); // Load more games
        isLoading = false;
    }
}

// Initial load of games using the value from localStorage
libraryLoad();
window.addEventListener('scroll', handleScroll);

async function libraryLoad() {
    await loadAndDisplayGames('', whichGame); // Load games on page load
}

// Set the heading dynamically based on the game type
document.getElementById('heading').innerText = `Top ${whichGame} Games`;
