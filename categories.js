// Default category to load when the page loads and no category is selected
const DEFAULT_CATEGORY = "MMORPG"; 

const baseUrl = "https://ultimategames-server-code.onrender.com/api/games/category?category=";

let currentPage = 1; // Track the current page of games
let isLoading = false; // Prevent multiple simultaneous loads
let selectedCategoryElement = null; // Track the currently selected category element

// Function to navigate to the game page
function navigatePage(id) {
    localStorage.setItem('id', id);
    window.location.href = "gamePage.html";
}

// Function to clear the games container
function clearGamesContainer() {
    document.querySelector(".games-container").innerHTML = "";
}

// Function to display a message when no games are found
function displayNoGamesMessage() {
    document.querySelector(".games-container").innerHTML = "<p>No games found.</p>";
}

// Load and display games for a selected category, and highlight selected category
async function loadGames(category, element = null, page = 1) {
    // Highlight selected category if an element is provided
    if (element) {
        highlightSelectedCategory(element);
    }

    localStorage.setItem('selectedCategory', category); // Store selected category
    const data = await fetchGames(category, page); // Fetch games based on category and page

    // Clear previous games only on the first page load
    if (page === 1) {
        clearGamesContainer();
    }

    // Check if there are games returned
    if (data && data.length > 0) {
        data.forEach(displayElement); // Display each game
    } else if (page === 1) {
        displayNoGamesMessage(); // Handle no games case
    }
}

// Function to highlight selected category
function highlightSelectedCategory(element) {
    // Remove the previous selection highlight if it exists
    if (selectedCategoryElement) {
        selectedCategoryElement.classList.remove("selected-category");
    }

    // Highlight the newly selected category
    element.classList.add("selected-category");
    selectedCategoryElement = element; // Update the selected element reference
}

// Fetch games based on category and page
async function fetchGames(category, page) {
    try {
        const response = await fetch(`${baseUrl}${encodeURIComponent(category)}&page=${page}`);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json(); // Return the data
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array if there’s an error
    }
}

// Function to display individual game elements
function displayElement(data) {
    const game = document.createElement("div");
    game.className = "game-item";
    game.id = data.id; // Assign game ID to the div's id

    const title = document.createElement("h3");
    title.innerText = data.title;

    const image = document.createElement("img");
    image.src = data.thumbnail;
    image.alt = data.title;

    const description = document.createElement("p");
    description.innerText = data.short_description;

    // Append all elements to the game div
    game.append(image, title, description);

    // Append the game div to the container in the HTML
    document.querySelector(".games-container").append(game);

    game.addEventListener("click", () => navigatePage(game.id)); // Fetch game details using its ID when clicked
}

// Load games based on selected category when page loads
async function libraryLoad() {
    let category = localStorage.getItem('selectedCategory'); // Retrieve selected category
    if (!category) {
        category = DEFAULT_CATEGORY; // Set to default if no category is selected
    }
    
    // Load games for saved or default category
    await loadGames(category, document.querySelector(`li[onclick="loadGames('${category}', this)"]`));
}

// Function to handle scrolling
function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100; // Adjust the threshold as needed

    if (scrollPosition >= threshold && !isLoading) {
        isLoading = true; // Set loading to true to prevent multiple calls
        currentPage++; // Increment page number
        const category = localStorage.getItem('selectedCategory'); // Retrieve selected category
        loadGames(category, selectedCategoryElement, currentPage).finally(() => {
            isLoading = false; // Reset loading status after loading games
        });
    }
}

// Call libraryLoad when the page loads
libraryLoad();

// Add scroll event listener
window.addEventListener('scroll', handleScroll);
