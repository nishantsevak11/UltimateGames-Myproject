// const baseUrl = 'http://localhost:3000/api/games';
const baseUrl = "https://ultimategames-server-code.onrender.com/api/games";

function navigatePage(id) {
    // Store the game ID in localStorage and navigate to the game page
    localStorage.setItem('id', id);
    window.location.href = "gamePage.html";
}

function showAll(className){
    localStorage.setItem('game',className);
    window.location.href = "gamesList.html"
}

function libraryLoad(platform, containerId, sortBy) {
    const url = `${baseUrl}?platform=${platform}${sortBy ? '&sort-by=' + sortBy : ''}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const limitedData = data.slice(0, 5); // Limit to top 5 games
            limitedData.forEach(game => {
                displayElement(game, containerId);
            });
        })
        .catch(error => console.error('Error loading the game data:', error));
}

function libraryLoad2(category, containerId) {
    const url = `${baseUrl}?category=${category}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const limitedData = data.slice(0, 5); // Limit to top 5 games
            limitedData.forEach(game => {
                displayElement(game, containerId);
            });
        })
        .catch(error => console.error('Error loading the game data:', error));
}


function displayElement(data, containerId) {
    let game = document.createElement("div");
    game.className = "game";
    game.id = data.id;

    let img = document.createElement("img");
    img.src = data.thumbnail;

    let name = document.createElement("h3");
    name.innerText = data.title;

    game.append(img, name);
    document.getElementById(containerId).append(game);
    game.addEventListener("click", () => navigatePage(data.id));
}

// Load games into different containers
libraryLoad('all', 'top-games-container', 'popularity');
libraryLoad('pc', 'top-pc-games-container', 'popularity');
libraryLoad('browser', 'top-browser-games-container', 'popularity');
libraryLoad2('action', 'top-action-games');
libraryLoad2('racing', 'top-racing-games');
libraryLoad2('shooter', 'top-shooter-games');
libraryLoad2('zombie', 'top-zombie-games');