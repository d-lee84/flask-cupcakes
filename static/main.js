"use strict";

const CUPCAKES_API_URL = "/api/cupcakes";
const SEARCHED_CUPCAKES_API_URL = "/api/cupcakes/search";

const $cupcakesList = $("#cupcakesList");
const $addCupcakeErrors = $("#addCupcakeErrors");



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
  
  let flavor = $("#flavor").val();
  let size = $("#size").val();
  let rating = $("#rating").val();
  let image = $("#image").val();
  
  $(evt.target).trigger("reset");
  $addCupcakeErrors.empty();
  
  // debugger;
  const resp = await axios.post(CUPCAKES_API_URL, {
    flavor,
    size,
    rating,
    image,

  });

  console.log(resp.data);

  if (resp.data.errors) {
    for (let error of resp.data.errors) {
      $addCupcakeErrors.append($(`<p>${error}<p>`))
    }
  } else {
    const cupcake = resp.data.cupcake;
    appendCupcakeToDOM(cupcake);
  }



}

/** Helper function to generate the HTML then 
 *  append the cupcake information to the DOM
 */

function appendCupcakeToDOM(cupcake) {
  
  const cupcakeContent = `<p>
  <img src="${cupcake.image}">
  Flavor: ${cupcake.flavor}, Rating: ${cupcake.rating}

  <form>
    <label for="cupcake-${cupcake.id}-flavor">Flavor: </label>
    <input id="cupcake-${cupcake.id}-flavor" required type="text" value="${cupcake.flavor}">

    <label for="cupcake-${cupcake.id}-rating">Rating: </label>
    <input id="cupcake-${cupcake.id}-rating" required type="number" value="${cupcake.rating}">

    <label for="cupcake-${cupcake.id}-size">Size: </label>
    <input id="cupcake-${cupcake.id}-size" required type="text" value="${cupcake.size}">

    <label for="cupcake-${cupcake.id}-image">Image URL: </label>
    <input id="cupcake-${cupcake.id}-image" type="url" value="${cupcake.image}">

    <button type="submit">Edit the cupcake!</button>
  </form>
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
 

$(showCupcakes);
$('#addCupcake').on("submit", addCupcake);
$('#searchCupcake').on("input", showSearchedCupcakes);

// TODO: Add event listener for updating cupcakes, making Axios PATCH request etc.
// If curious: investigate _debounce in lodash, and implementing it ourselves