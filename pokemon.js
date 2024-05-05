const MAX_POKEMON = 250;
const listWrapper = document.querySelector(".list-wrapper");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message"); // Fixed ID to match HTML
let allPokemons = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
        .then((response) => response.json())
        .then((data) => {
            allPokemons = data.results;
            DisplayPokemons(allPokemons);
        });

    const searchInput = document.querySelector("#searchInput"); // Changed ID to match HTML
    if (searchInput) {
        searchInput.addEventListener("keyup", handleSearch);
    } else {
        console.error("Element with ID 'searchInput' not found."); // Changed ID in error message
    }
});

async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);
        return true;
    } catch (error) {
        console.error("Failed to fetch Pokemon data before redirect");
        return false;
    }
}

function DisplayPokemons(pokemon) {
    listWrapper.innerHTML = "";
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const ListItem = document.createElement("div");
        ListItem.className = "list_item";
        ListItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption_fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        `;
        ListItem.addEventListener("click", async () => {
            console.log("Fetching Pokemon data...");
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            } else {
                console.error("Failed to fetch Pokemon data");
            }
        });
        listWrapper.appendChild(ListItem);
    });
}

function handleSearch() {
    const searchInput = document.querySelector("#searchInput"); // Changed ID to match HTML
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if (numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    } else if (nameFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        });
    } else {
        filteredPokemons = allPokemons;
    }

    DisplayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

const closeButton = document.querySelector(".search-close-icon");
if (closeButton) {
    closeButton.addEventListener("click", clearSearch);
} else {
    console.error("Element with class 'search-close-icon' not found.");
}

function clearSearch() {
    const searchInput = document.querySelector("#searchInput"); // Changed ID to match HTML
    searchInput.value = "";
    DisplayPokemons(allPokemons);
    notFoundMessage.style.display = "none";
}



window.addEventListener("mousemove", cursor);

function cursor(e) { 
    const cursor = document.querySelector(".cursor");
    cursor.style.top = e.pageY + "px";
    cursor.style.left = e.pageX + "px";
}