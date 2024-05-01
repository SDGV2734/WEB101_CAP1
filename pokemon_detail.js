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
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
        ]);
        const abilitiesWrapper = document.querySelector(".pokwmon-detail-wrap .pokemon-deatail.move");
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonId === id) {
            DisplayPokemonsDetails(pokemon); 
                const flavourText = getEnglishFlavourText(pokemonSpecies);
                document.querySelector(".body3-fonts .pokemon-description").textContent = flavourText;
            
            const(leftArrow, rightArrow) = ['#leftArrow', '#rightArrow'].map((selector) => document.querySelector(selector));

            leftArrow.removeEventListener('click', navigatePoke);
            rightArrow.removeEventListener('click', navigatePoke);
            // 1 32 56
        }

        return true;
    }
    catch (error) {
        console.error("An error occurred while fetching the pokemon data", error);
        return false
    }
}