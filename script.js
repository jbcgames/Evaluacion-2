const apiUrlNombrePokemon = "https://pokeapi.co/api/v2/pokemon/";
const apiUrlEspecie = "https://pokeapi.co/api/v2/pokemon-species/";
const apiUrlCadena = "https://pokeapi.co/api/v2/evolution-chain/";
let actual_name;
async function consultarApiPokemon(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`fallo la consulta a la api: ${error}`);
      const Container = document.querySelector(".containerInfo")
      Container.style.display="none";
      const eContainer = document.querySelector(".containerError")
      eContainer.style.display="block";
      const qContainer = document.querySelector(".containerEvolution")
        qContainer.style.display="None";
    }
  }
  async function datos_iniciales(name){
    const infoPokemon = consultarApiPokemon(apiUrlNombrePokemon + name)
    .then((response) => {
      const nombre =response.name;
      const imagen = response.sprites.other.home.front_default;
      const tipe =response.types[0].type.name;
      //const descricion
      const habilidades = response.abilities;
      let nombresHabilidades = '';

      for(let i = 0; i < habilidades.length; i++) {
          nombresHabilidades += habilidades[i].ability.name;
          if(i !== habilidades.length - 1) {
              nombresHabilidades += ', ';
          }
      }
      const eContainer = document.querySelector(".containerError")
      eContainer.style.display="none";
      const Container = document.querySelector(".containerInfo")
      Container.style.display="block";
      const Name = document.querySelector(".pokemonName")
      const Image = document.querySelector(".pokemonImg")
      const Tipo = document.querySelector(".pokemonType")
      const Habilities = document.querySelector(".pokemonAbilities")
      Name.innerHTML = nombre;
      Image.src= imagen;
      Tipo.innerHTML = tipe;
      Habilities.innerHTML = nombresHabilidades;
    });
  }
  async function descripciones(name){
    const infoPokemon = consultarApiPokemon(apiUrlEspecie + name)
    .then((response) => {
      const Description = document.querySelector(".pokemonDescrition")
      const descripcion = response.flavor_text_entries
      let flavorTextEs = null;

      for (let x = 0; x < descripcion.length; x++) {
          if (descripcion[x].language.name === "es") {
              flavorTextEs = descripcion[x].flavor_text;
              break;
          }
      }

      if (flavorTextEs) {
        console.log("ok")
      } else {
          console.log("No se encontró ningún texto en español.");
      }

      Description.innerHTML= flavorTextEs;
  
      evolucion(response.evolution_chain.url, name)
    })
  }
  

  async function evolucion(url, name){
    const infoPokemon = consultarApiPokemon(url)
    .then((response) => {
    const idEvolution= response.chain;
    const a= findName(idEvolution, name)
    .then((response) => {
      if(response!=null){
        const Container = document.querySelector(".containerEvolution")
        Container.style.display="block";
        actual_name=response;
      }else{
        const Container = document.querySelector(".containerEvolution")
        Container.style.display="None";
      }
      console.log(response)
    })
    })
  }
  async function findName(idEvolution, name) {
    try{if (idEvolution.species.name === name) {
        return idEvolution.evolves_to[0].species.name;
    } else if (idEvolution.evolves_to[0]) {
        return findName(idEvolution.evolves_to[0], name);
    } else {
        return null;
    }}
    catch{
      console.error("No tiene evolucion")
      actual_name=null;
    }
}
const searchButton = document.querySelector(".buttonSearch");
const searchButtonEvolution = document.querySelector(".buttonEvolution");
  searchButton.addEventListener("click", () => {
    
    const textName = document.querySelector(".containerFinder input");
    const textNam= textName.value
    
    console.log(apiUrlNombrePokemon + textNam.toLowerCase().replace(/\d/g, '') )
    datos_iniciales(textNam.toLowerCase().replace(/\d/g, ''))
    descripciones(textNam.toLowerCase().replace(/\d/g, '') )


  })
  
  searchButtonEvolution.addEventListener("click", () => {
    
    console.log(apiUrlNombrePokemon + actual_name)
    datos_iniciales(actual_name)
    descripciones(actual_name)


  })