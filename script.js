var userInput = document.getElementById("input");
var searchBtn = document.getElementById("search");
var searchResult = document.getElementById("result");
var searchedCity = document.getElementById("searched")
var cityText = document.getElementById("city");



searchBtn.addEventListener("click", function () {
    var searchValue = userInput.value;
console.log(searchValue);

var apiurl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=2819d50096838c6a50fa89bab141bf6e";

fetch(apiurl)
.then(function (response) {
  if (response.ok) {
    console.log(response);
    var places = []
    places = JSON.parse(localStorage.getItem("places")) || [];
    places.push(searchValue)
    localStorage.setItem("places", JSON.stringify(places));

    response.json().then(function (data) {
      console.log(data);
      
   
     cityText.textContent = data.name 
 


     getPlaces()
    
})}else {
    alert('Error: ' + response.statusText);
  }
  
})
  .catch(function (error) {
    alert('Unable to connect to OpenWeather');
  });

}); 




function getPlaces() {
  searchedCity.textContent = "";
  var places = JSON.parse(localStorage.getItem("places")) || [];
  for (let index = 0; index < places.length; index++) {
    var searchedPlace = document.createElement("button")
searchedPlace.classList.add("btn" ,"btn-primary", "btn-lg",  "w-100" , "mb-2" ,"place-btn")
searchedPlace.textContent = places[index]
searchedPlace.setAttribute("data", places[index])
searchedCity.append(searchedPlace)   
  }

if (places.length > 0) {
  var clearBtn = document.createElement("button")
  clearBtn.classList.add("btn",  "btn-danger" ,"btn-md" ,"mb-2", "text-center" , "margin-auto")
clearBtn.textContent = "Clear"
searchedCity.append(clearBtn)
clearBtn.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

}
}
  
getPlaces()
