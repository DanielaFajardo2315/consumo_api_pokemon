document.addEventListener('DOMContentLoaded', () => {
    const listaPokemon = document.getElementById('lista'); //Lista desplegable (Select)
    const infoPokemon = document.getElementById('tarjeta'); //Tarjeta con información del pokemón
    const formulario = document.getElementById('form'); //Formulario de selección de pokemón


    const peticionApi = async () => { //Función de petición de API
        try {
            const peticionLista = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0')
            const datosLista = await peticionLista.json();
            console.log(datosLista);

            const pokemon = datosLista.results.map(pokemonItem => pokemonItem.url);
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
            console.error('Se encontró el siguiente error', error);
            alert('Ops!, hay un error al encontrar los datos');
        }
    }


    const mostrarTarjeta = async (url) => { //Función para mostrar las tarjetas
        try {
            const peticion = await fetch(url); //Petición a las url de la API para encontrar datos del pokemón
            const datosPokemon = await peticion.json();
            const imagenPokemon = datosPokemon.sprites.other.dream_world.front_default; //Imagen del pokemón
            const namePokemon = datosPokemon.name; //Nombre del pokemón
            const typePokemon = datosPokemon.types.map(tipo => tipo.type.name); //Tipo de pokemón
            const locationsUrl = datosPokemon.location_area_encounters; //Traer las url de las locaciones
            const locationRes = await fetch(locationsUrl); //Petición a la url de las locaciones
            const location = await locationRes.json();
            const locationPokemon = await location.map(loc => loc.location_area);
            const locPokemon = locationPokemon.map(loc => loc.name);
            
            const colorTipo = { //Diccionario de los colores para los botones del tipo de pokemón
                'bug': '#A8B820',
                'dark': '#705848',
                'dragon': '#7039F5',
                'electric': '#E3C033',
                'fairy': '#F8A9E2',
                'fight': '#903028',
                'fire': '#F05030',
                'flying': '#A890F0',
                'ghost': '#705898',
                'grass': '#79BC55',
                'ground': '#E0C068',
                'ice': '#98D8D8',
                'normal': '#A8A878',
                'poison': '#9A4B96',
                'psychic': '#F85888',
                'rock': '#B8A038',
                'steel': '#B8B8D0',
                'water': '#6C8CDC'
            }
            const botonesTipo = typePokemon.map(tipo => { //Creación de los botones para tipo de pokemón con el color correspondiente
                const color = colorTipo[tipo];
                return `<button class="btn_type" style="background-color: ${color}; text-transform: capitalize">${tipo}</button>`;
            }).join('');
            const locationList = locPokemon.map(loc => { //Lista de locaciones donde se encuentran los pokemón
                const locationP = locPokemon[loc];
                return `<ul>
                <li class="list_loc">${loc}</li>
                </ul>`;
            }).join('');
            const displayEvol = locationList.length === 0 ? 'block' : 'none'; //Condición variable para mostrar noEvolution
            const noEvolution = `<li style="display: ${displayEvol};">Esta es una evolución</li>` //Item de la lista que se muestra si no encuentra locaciones
            
            infoPokemon.innerHTML += `
                <article class="card">
                <button class="btn_eliminar"><i class="fa-solid fa-trash fa-2xl b_eliminar" style="color: #365ba1;"></i></button>
                <h2 class="card_title" style="text-transform: capitalize";>${namePokemon}</h2>
                <div class="imgContainer">
                <img class="img_pokemon" src="${imagenPokemon}" alt="Imagen ${namePokemon}" id="img_pokemon">
                </div>
                <div class="botones_tipo">${botonesTipo}</div>
                <div class="location">
                <h3>Locations</h3>
                <div class="contenedor_lista">
                <ul>
                ${noEvolution}
                ${locationList}
                </ul></div>
                </div>
                </article>
                ` //Código HTML a ingresar al cumplir la función
            
        } catch (error) {
            console.error('Se encontró el siguiente error:', error);
            alert('Ops!, hay un error al mostrar la tarjeta');
        }
    }
    
    formulario.addEventListener('submit', (event) => { //Función para mostrar la tarjeta al seleccionar un pokemón
        event.preventDefault();
        const urlPokemon = listaPokemon.value;
        
        if (urlPokemon) {
            mostrarTarjeta(urlPokemon);
        }
    })
    
    
    infoPokemon.addEventListener('click', (event) => { //Función para eliminar una tarjeta
        if (event.target.classList.contains('b_eliminar')) {
            const card = event.target.closest('.card');
            
            if (card) {
                card.remove();
            }
        }
    })
    
    peticionApi();
});