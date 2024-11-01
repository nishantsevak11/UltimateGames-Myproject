const gameDetailUrl = 'https://ultimategames-server-code.onrender.com/api/game?id=';

// Retrieve the game ID from local storage
let id = localStorage.getItem('id');
localStorage.removeItem('id');

// Fetch and display game details
getGameDetails(id).then(data => {
  if (data) {
    displayElement(data);
  }
});

// Function to fetch game details by ID
async function getGameDetails(id) {
  try {
    const response = await fetch(`${gameDetailUrl}${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching game details: ${response.statusText}`);
    }
    const details = await response.json();
    return details;
  } catch (error) {
    console.error('Error loading game details:', error);
  }
}



// Function to display game details in the UI
function displayElement(gameData) {
  document.getElementById('title').textContent = gameData.title;
  document.getElementById('image').src = gameData.thumbnail;
  document.getElementById('short_desc').textContent = gameData.short_description;
  document.getElementById('desc').textContent = gameData.description;
  document.getElementById('genre').textContent = `Genre: ${gameData.genre}`;
  document.getElementById('platform').textContent = `Platform: ${gameData.platform}`;
  document.getElementById('publisher').textContent = `Publisher: ${gameData.publisher}`;
  document.getElementById('developer').textContent = `Developer: ${gameData.developer}`;
  document.getElementById('release_date').textContent = `Release Date: ${gameData.release_date}`;

  const requirementsList = document.getElementById('requirements-list');
  const requirements = gameData.minimum_system_requirements;

  // Clear any existing content
  requirementsList.innerHTML = '';

  // Iterate over the requirements object and add each item to the list
  for (const [key, value] of Object.entries(requirements)) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${capitalizeFirstLetter(key.replace(/_/g, ' '))}:</strong> ${value}`;
      requirementsList.appendChild(listItem);
  }

  

}



// Helper function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

