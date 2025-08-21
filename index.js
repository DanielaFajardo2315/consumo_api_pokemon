const listaPokemon = document.getElementById('lista'); //Lista desplegable (Select)
const infoPokemon = document.getElementById('tarjeta'); //Tarjeta con información del pokemon
const formulario = document.getElementById ('form');


const peticionApi = async () => {
    try {
        const peticionLista = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0')
        const datosLista = await peticionLista.json();
        console.log(datosLista);

        const pokemon = datosLista.results.map(pokemon => pokemon.url);
        const pokemonDetalle = pokemon.map(url => fetch(url));
        const respuestaDetalle = await Promise.all(pokemonDetalle);
        const datosPokemon = await Promise.all(respuestaDetalle.map(res => res.json()));
        console.log(datosPokemon);

        // Incluir los nombres de los pokemones en la lista desplegable
        listaPokemon.innerHTML = '';

        datosLista.results.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.url;
            option.textContent = pokemon.name;
            listaPokemon.appendChild(option);
        })

    } catch (error) {
        console.error('Se encontró un error', error);
        alert('Hay un error', error);
    }
}


const mostrarTarjeta = async (url) => {
    try {
        const peticion = await fetch(url);
        const datosPokemon = await peticion.json();
        const imagenPokemon = datosPokemon.sprites.other.dream_world.front_default;
        const namePokemon = datosPokemon.name;


        console.log(namePokemon);
        console.log(imagenPokemon);

        infoPokemon.innerHTML =  `
            <article class="card">
                <h2 class="card_title">${namePokemon}</h2>
                <div class="imgContainer">
                    <img class="img_pokemon" src="${imagenPokemon}" alt="Imagen ${namePokemon}" id="img_pokemon">
                </div>
            </article>
        `
    } catch (error) {
        console.error('hay un error', error);
    }
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const urlPokemon = listaPokemon.value;

    if (urlPokemon) {
        mostrarTarjeta(urlPokemon);
    }
})

peticionApi();