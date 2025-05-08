"use strict";

async function fetchAPI() {
    try{
        let response = await fetch('http://localhost:3333/dishes')
        let data = await response.json()
        console.log(data)
    }catch(error){
        console.log('Fout bij het ophalen van de API', error)
    }
}

fetchAPI();

