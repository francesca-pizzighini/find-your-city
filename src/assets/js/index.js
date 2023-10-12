import '../scss/style.scss';
import * as bootstrap from 'bootstrap';

import axios from 'axios';
const _ = require('lodash');


//favicon
import appendFavicon from './favicon';
document.head.appendChild(appendFavicon());


//useful functions
function createElement(element, externalElement, classList, idName ){
    element.classList = `${classList}`;
    element.setAttribute('id', `${idName}`);
    externalElement.appendChild(element);
}

async function eraseFirstChild(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    };
}


//searchbar + download city from api
let input = document.getElementById('search-bar');
let suggestion = document.getElementById('search-suggestion');
let arrayOfCity = [];
let failedResearchAlert = document.getElementById('failed-research-alert');

let ul = document.createElement('ul');
createElement(ul, suggestion, 'list-group', 'suggestion-ul');
let suggestioUl = document.getElementById('suggestion-ul');

let cityName;

//download list of city from the api
async function createArrayOfCity(){
    try{
        let download = await axios.get(`https://api.teleport.org/api/urban_areas/`);
    
        let cityList = _.get(download, 'data._links.ua:item');
        cityList.forEach(city => {
            arrayOfCity.push(city.name)
        });
        // console.log(arrayOfCity)
    }catch(error){
        console.log('Error: ', console.error);
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

        li.addEventListener('click', select);
    });
};

function select(event){
    cityName = event.target.textContent;
    input.value = cityName;
    suggestion.classList.add('d-none');
};

function autocompleteMatch(value){
    eraseFirstChild(suggestioUl);

    if(value == ''){
        failedResearchAlert.classList.remove('d-none');
        suggestion.classList.add('d-none');
        failedResearchAlert.innerText = 'Error: please type the name of the city you want to check';
        return [];
    }
    
    failedResearchAlert.classList.add('d-none');
    suggestion.classList.remove('d-none');
    const reg = new RegExp(`^${value}`, 'i');
    return arrayOfCity.filter(city =>{
        if(city.match(reg)){
            return city;
        }
    })   
};

//change dinamically city data
//setup
//for city image
let banner = document.getElementById('banner');
// for cityscores
let instructionsOrScores = document.getElementById('instruction-scores');
let scoresData = document.getElementById('scores-data');

//function on search button
let searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', search);

async function search(){
    try{
        let urlValue =  await adjustValue(cityName);
        //Name and country
        let cityInfo = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${urlValue}/`);
        
        appendInfo(cityInfo, 'data.name', 'An error occurred,please try realoding the page', 'banner-name');
        appendInfo(cityInfo, 'data.name', 'An error occurred,please try realoding the page', 'city-name');

        appendInfo(cityInfo, 'data.continent', 'An error occurred,please try realoding the page', 'continent');

        //image banner
        let cityImage = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${urlValue}/images/`);
        let imageUrl = await _.get(cityImage, 'data.photos.0.image.web', 'An error occurred,please try realoding the page');
        banner.style.backgroundImage = `url(${imageUrl})`;

        //description and scores
        let cityScores = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${urlValue}/scores/`);

        //summary
        eraseFirstChild(document.getElementById('summary-or-presentation'));
        appendHtml(cityScores, 'data.summary', 'An error occurred,please try realoding the page', 'summary-or-presentation');

        //scores
        instructionsOrScores.innerText = 'City scores';
        eraseFirstChild(scoresData);

        let categoryNumber = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
        categoryNumber.forEach((number)=>{
            appendScores(cityScores, `data.categories.${number}.score_out_of_10`, `data.categories.${number}.name`, 'An error occurred,please try realoding the page', scoresData);
        })

        input.value = '';
    }catch(e){
        failedResearchAlert.classList.remove('d-none')
        failedResearchAlert.innerText = 'An error occured, try realoading the page. If the error persist you can signal it at https://github.com/francesca-pizzighini/find-your-city';
        input.value = '';
        console.log('Error: ', e);
    }
}

//adjust city name for researchin data with the api
function adjustValue(value){
    value = value.toLowerCase();
    value = value.trim();
    value = value.replaceAll(' ', '-');
    return value;
}

//append data on the page
async function appendInfo(download, path, error, idElement){
    let element = document.getElementById(`${idElement}`);
    let text = await _.get(download, `${path}`, `${error}` );
    element.innerText = text;
}

async function appendHtml(download, path, error, idExternalElement){
    let externalElement = document.getElementById(`${idExternalElement}`);
    let element = await _.get(download, `${path}`, `${error}` );
    externalElement.innerHTML += element;
}

async function appendScores(download, pathNumber, pathName, error, externalElement){
    let divName = document.createElement('div');
    
    let number = await _.get(download, pathNumber, error);
    number = Math.round(number);

    let name = await _.get(download, pathName, error);

    createElement(divName, externalElement, 'score', ' ');
    divName.innerHTML += `<p>${name} : ${number}</p><div class="out-of-ten"><div class="bg-lightcolor lenght-${number}"></div></div>`;
}

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
