'use strict';

const apiKey = ''; //input personal API key

const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {  
  console.log(responseJson);
  $('#results-list').empty(); 
  
  for (let i = 0; i < responseJson.data.length & i<maxResults ; i++){   
    console.log(responseJson.data);
   //For BONUS: used lat and long instead of address because address cannot be accessed in data
      
    $('#results-list').append(
      `<li>
      <h3>${responseJson.data[i].fullName}</h3>      
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].latLong}</p>  
      <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>      
      </li>`
    )}; 
   
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults=10) {
  const params = {
    stateCode: query,
    max: maxResults,
    apiKey
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString + '&api_key=' + apiKey;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);