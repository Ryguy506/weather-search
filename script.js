var userInput = document.getElementById("input");
var searchBtn = document.getElementById("search");
var searchedCity = document.getElementById("searched")
var cityText = document.getElementById("city");

var today = dayjs().format('M/DD/YYYY')

// calls the getWeather func on click to get the weather for the city that was searched and saves in local storage
searchBtn.addEventListener("click", function () {
  searchValue = userInput.value;
  getWeather(searchValue);
  if (searchValue !== "") {
    places = []
    var places = JSON.parse(localStorage.getItem("places")) || [];
    places.push(searchValue);
    localStorage.setItem("places", JSON.stringify(places));

  }
})

// calls the getWeather func on click for cities added to the page from local storage
searchedCity.addEventListener("click", function (event) {
  searchValue = event.target.getAttribute("data")
  getWeather(searchValue)
})



// func to make apis calls and displays data on the page
function getWeather(searchValue) {
  $("#fiveday").empty()
  $("#today").empty()
//  api call for current weather
  var oneDay = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=metric" + "&appid=40aac2ee5b1002304c21fb110fc31e01";

  fetch(oneDay)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          // icon for current weather 
          var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
         // displays the current weather for the searched city
          $("#today").append(
            "<h1 class='text-center'>" + data.name + "</h1>"
            + "<div class='col text-center bg-info m-3'>"
            + "<h3>" + "Today" + "<br>" + today + "</h3>"
            + "<img src=" + iconUrl + ">"
            + "<ul>" + "Temperature: " + Math.round(data.main.temp) + "°C" + "</ul>"
            + "<ul>" + "Humidity: " + data.main.humidity + "%" + "</ul>"
            + "<ul>" + "Wind Speed: " + Math.round(data.wind.speed) + " " + "km/h" + "</ul>"
            + "</div>"
            + "<h1 class = 'text-center'>" + "Five Day Forecast" + "</h1>"
          )
            // api call for 5 day forecast
          var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&units=metric" + "&appid=40aac2ee5b1002304c21fb110fc31e01";

          fetch(fiveDay)
            .then(function (response) {
              if (response.ok) {
                console.log(response);
                response.json().then(function (fiveData) {
                  console.log(fiveData);

                  //  loops through the 5 day forecast data
                  for (let i = 0; i < fiveData.list.length; i++) {
                    // if statement to get the weather for 12pm each day
                    if (fiveData.list[i].dt_txt.includes("12:00:00")) {
                      // converts the unix time to a readable format
                      var date = dayjs.unix(fiveData.list[i].dt).format('M/DD/YYYY')
                      var day = dayjs.unix(fiveData.list[i].dt).format('dddd')
                      // gets the icon url for the weather
                      var iconUrl = "http://openweathermap.org/img/w/" + fiveData.list[i].weather[0].icon + ".png";
                      // displays the weather for each day
                      $("#fiveday").append(
                        "<div class='col text-center bg-info m-3'>"
                        + "<h3>" + day + "<br>" + date + "</h3>"
                        + "<img src=" + iconUrl + ">"
                        + "<ul>" + "Temperature: " + Math.round(fiveData.list[i].main.temp) + "°C" + "</ul>"
                        + "<ul>" + "Humidity: " + fiveData.list[i].main.humidity + "%" + "</ul>"
                        + "</div>"
                      )
                    }
                  }
                  // calls the getPlaces func to display the recently searched city to searched city history 
                  getPlaces()
                })
              }
            })
        })
      }
    })
}
// func to get the searched cities from local storage and display them on the page 
function getPlaces() {
  searchedCity.textContent = "";
  var places = JSON.parse(localStorage.getItem("places")) || [];
  for (let index = 0; index < places.length; index++) {
    var searchedPlace = document.createElement("button")
    searchedPlace.classList.add("btn", "btn-primary", "btn-md", "w-100", "mb-2", "place-btn")
    searchedPlace.textContent = places[index]
    searchedPlace.setAttribute("data", places[index])
    searchedCity.append(searchedPlace)
  }
// adds a clear button to page if there are cities in local storage
  if (places.length > 0) {
    var clearBtn = document.createElement("button")
    clearBtn.classList.add("btn", "btn-danger", "btn-md", "mb-2", "text-center", "margin-auto")
    clearBtn.textContent = "Clear"
    searchedCity.append(clearBtn)
    clearBtn.addEventListener("click", function () {
      localStorage.clear();
      location.reload();
    });

  }
}
//  calls the getPlaces func to display search history on page load
getPlaces()
