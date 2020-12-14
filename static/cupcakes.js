"use strict";

const CUPCAKES_API_URL = "/api/cupcakes";

const $cupcakesList = $("#cupcakesList");



/** Called when the show cupcakes button is pressed
 *  Requests a list of cupcakes from the API
 *  Displays the cupcakes information and image on the page
 * */ 

async function showCupcakes(evt) {

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

  await axios.post(CUPCAKES_API_URL, {
    flavor,
    size,
    rating,
    image
  });

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




$('#showCupcakes').on("click", showCupcakes);
$('#addCupcake').on("submit", addCupcake);