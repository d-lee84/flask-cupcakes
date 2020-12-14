"use strict";

const CUPCAKES_API_URL = "/api/cupcakes";
const SEARCHED_CUPCAKES_API_URL = "/api/cupcakes/search";

const $cupcakesList = $("#cupcakesList");



/** Called when the show cupcakes button is pressed
 *  Requests a list of cupcakes from the API
 *  Displays the cupcakes information and image on the page
 * */ 

async function showCupcakes(evt) {
  console.debug("showALLCupcakes");
  $cupcakesList.empty();

  const response = await axios.get(CUPCAKES_API_URL);

  const cupcakes = response.data.cupcakes;

  for (let cupcake of cupcakes) {
    appendCupcakeToDOM(cupcake);
  }
}

/** Called when the form is submitted
 *  POSTs the cupcake to the database
 *  Append the cupcake information to the DOM
 * */ 

async function addCupcake(evt){
  evt.preventDefault();

  let flavor = $("#cupcakeFlavor").val();
  let size = $("#cupcakeSize").val();
  let rating = $("#cupcakeRating").val();
  let image = $("#cupcakeImage").val();

  $(evt.target).trigger("reset");

  const resp = await axios.post(CUPCAKES_API_URL, {
    flavor,
    size,
    rating,
    image
  });

  const cupcake = resp.data.cupcake;

  appendCupcakeToDOM(cupcake);

}

/** Helper function to generate the HTML then 
 *  append the cupcake information to the DOM
 */

function appendCupcakeToDOM(cupcake) {
  
  const cupcakeContent = `<p>
  <img src="${cupcake.image}">
  Flavor: ${cupcake.flavor}, Rating: ${cupcake.rating}
  </p>`

  $cupcakesList.append(cupcakeContent);
}

/** 
 * Event listener for handling search for cupcake terms
 * Makes a request to server for cupcakes with filtered term provided
 * and shows new filtered list on index page
 **/ 

async function showSearchedCupcakes(evt) {
  evt.preventDefault();
  
  let search_term = $("#searchCupcake").val();
  const resp = await axios.get(SEARCHED_CUPCAKES_API_URL, {
    params:  {
      search_term
    }  
  });
  
  const cupcakes = resp.data.cupcakes;
  
  $cupcakesList.empty();
  for (let cupcake of cupcakes) {
    appendCupcakeToDOM(cupcake);
  }

  $(evt.target).trigger("reset");
}
 






// $('#showCupcakes').on("click", showCupcakes);
$(showCupcakes);
$('#addCupcake').on("submit", addCupcake);
$('#searchCupcakeForm').on("submit", showSearchedCupcakes);