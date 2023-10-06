import '../scss/style.scss'

import * as bootstrap from 'bootstrap'
import axios from 'axios';
const _ = require('lodash');

//favicon
import appendFavicon from './favicon';
document.head.appendChild(appendFavicon())

//useful functions
function createElement(element, externalElement, classList, idName ){
    element.classList = `${classList}`;
    element.setAttribute('id', `${idName}`);
    externalElement.appendChild(element);
}



//searchbar + download city from api
let input = document.getElementById('search-bar');
let suggestion = document.getElementById('search-suggestion');
let arrayOfCity = [];
let failedResearchAlert = document.getElementById('failed-research-alert');

let ul = document.createElement('ul');
createElement(ul, suggestion, 'list-group', 'suggestion-ul')
let suggestioUl = document.getElementById('suggestion-ul');

async function createArrayOfCity(){
    try{
        let download = await axios.get(`https://api.teleport.org/api/urban_areas/`);
    
        let cityList = _.get(download, 'data._links.ua:item');
        cityList.forEach(city => {
            arrayOfCity.push(city.name)
        });
        // arrayOfCity= cityList.map((city)=>{
        //     return city.name
        // })
    }catch(error){
        console.log('error: ', console.error);
    }
};
createArrayOfCity();

input.addEventListener('keyup', autocomplete);

function autocomplete(input){
    suggestion.classList.remove('d-none')
    const arrayOfCity = autocompleteMatch(input.target.value);

    arrayOfCity.forEach((city)=>{
        let li = document.createElement('li');
        createElement(li, ul, 'list-group-item', '')
        li.innerHTML = `${city}`;

        li.addEventListener('click', seleziona);
    });
};

function seleziona(event){
    let cityName =event.target.textContent;
    input.value = cityName;
    while(suggestion.firstChild){
        suggestion.removeChild(suggestion.firstChild);
    }
    suggestion.classList.add('d-none');
};

function autocompleteMatch(value){
    while(suggestioUl.firstChild){
        suggestioUl.removeChild(suggestioUl.firstChild);
    }

    if(value == ''){
        failedResearchAlert.classList.remove('d-none')
        suggestion.classList.add('d-none')
        failedResearchAlert.innerText = 'write the name of a city'
        return []
    }
    
    failedResearchAlert.classList.add('d-none')
    suggestion.classList.remove('d-none')
    const reg = new RegExp(`^${value}`, 'i');
    return arrayOfCity.filter(city =>{
        if(city.match(reg)){
            return city
        }
    })
};


















    // try{
    //     let download = await axios.get(`https://api.teleport.org/api/urban_areas/slug:adelaide/`);
    //     // let citylist = await _.get(download, 'data._links.ua:item', 'error')
    //     console.log(download);
    //     let cityid = await _.get(download, 'data.ua_id', 'error')
    //     let cityN =await _.get(download, 'data.slug', 'error')
    //     console.log(cityN)
    //     let details = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${cityN}/details`)
    //     console.log(details)
    //     let tz = await _.get(details, 'data._links.curies.5.href', 'error')
    //     console.log(tz)
    // }catch(error){
    //     console.log('error: ', console.error)
    // }



