let currentPokemonId = null;

document.addEventListener('DOMContentLoaded', () => {
    const MAX_POKEMONS = 250;
    const PokemonID = new URLSearchParams(window.location.search).get('id');
    const id = parseInt(PokemonID, 10);

    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = './pokemon.html');
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
        ]);
        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonId === id) {
            DisplayPokemonsDetails(pokemon);
            const flavourText = getEnglishFlavourText(pokemonSpecies);
            document.querySelector(".pokemon-description").textContent = flavourText;

            const [leftArrow, rightArrow] = ['#leftArrow', '#rightArrow'].map((selector) => document.querySelector(selector));

            leftArrow.removeEventListener('click', navigatePoke);
            rightArrow.removeEventListener('click', navigatePoke);

            if (id != 1) {
                leftArrow.addEventListener('click', () => {
                    navigatePoke(id - 1);
                });
            }

            if (id != 250) {
                rightArrow.addEventListener('click', () => {
                    navigatePoke(id + 1);
                });
            }

            window.history.pushState({}, "", `./detail.html?id=${id}`); // it goes to the window history and changes the URL without reloading the page
        }

        return true;
    } catch (error) {
        console.error("An error occurred while fetching the pokemon data", error);
        return false;
    }
}

async function navigatePoke(id) {
    if (id < 1 || id > 250) {
        return;
    }
    currentPokemonId = id;
    loadPokemon(id);
}

const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

function rgbaColor(hexColor) {
    return [parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16),
    ].join(",");
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if (!color) {
        console.warn(`Type color not found for ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detil-main.main");
    setElementStyles([detailMainElement], "backgroundColor", color);
    setElementStyles([detailMainElement], "borderColor", color);

    setElementStyles(document.querySelectorAll(".pokemon-wrapper > p"), "backgroundColor", color);

    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color);

    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "background", color);

    const rgbaColorVal = rgbaColor(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background: rgba(${rgbaColorVal}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background: ${color};
        }
    `;
    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}

function DisplayPokemonsDetails(pokemon) {
    const { name, id, types, stats, abilities, weight, height } = pokemon;
    const capitalizePokemonName = capitalizeFirstLetter(name);

    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;
    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

    const imgElement = document.querySelector(".detail-img-wrapper img");
    imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-font type ${type.name}`,
            textContent: type.name,
        });
    });

    document.querySelector(".pokemon-detail-wrap .body2-fonts-weight").textContent = `${weight / 10} kg`;
    document.querySelector(".pokemon-detail-wrap .body2-fonts-height").textContent = `${height / 10} m`;

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilitiesWrapper.innerHTML = "";
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-font ability",
            textContent: ability.name
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statsNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD"
    };

    stats.forEach(({ base_stat, stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-font stats",
            textContent: statsNameMapping[stat.name]
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-font",
            textContent: String(base_stat).padStart(3, "0")
        });
        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar", value: base_stat, max: 255
        });
    });

    setTypeBackgroundColor(pokemon);
}

function getEnglishFlavourText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavour = entry.flavor_text.replace(/\f/g, " ");
            return flavour;
        }
    }
    return " "; // if no english text is found
}
