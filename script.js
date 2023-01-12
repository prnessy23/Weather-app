var APIkey = "63935e10f39b5b792efafe04f5865fb0";

var cityInputEl = $("#city-input");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-button");
var pastSearchedCitiesEl = $("past-searches");

var currentCity;

// Using openweather API to get updated weather using lat and lon of each city

function getWeather(data) {
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${APIkey}&units=imperial`

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data)
      // This is the current weather
      var currentConditionsEl = $("#currentConditions");
      currentConditionsEl.addClass("border border-success");

      // This creates city name and appends current weather to it
      var cityNameEl = $("<h2>");
      cityNameEl.text(`${data.city.name}`);
      currentConditionsEl.append(cityNameEl);

      //  Gets date from result and appends to city name
      var currentCityDate = dayjs().format("MM/DD/YYYY");
      var currentDateEl = $("<span>");
      currentDateEl.text(`(${currentCityDate})`);
      cityNameEl.append(currentDateEl);
// Gather icon from Open Weather app and add to city weather
      var currentCityWeatherIcon = data.list[0].weather[0].icon
      var currentWeatherIconEl = $("<img>");
      var imgLink ='http://openweathermap.org/img/wn/10d@2x.png' + currentCityWeatherIcon + ".png"
       cityNameEl.append(currentWeatherIconEl);
// Gets curent searched city temp in rounded Fahrenheit format
      var currentCityTemp = Math.round(data.list[0].main.temp);
      var currentTempEl = $("<p>");
      currentTempEl.text(`Temp:${currentCityTemp}°F`);
      currentConditionsEl.append(currentTempEl);

      var currentCityWind = data.list[0].wind.speed;
      var currentWindEl = $("<p>");
      currentWindEl.text(`Wind:${currentCityWind} MPH`);
      currentConditionsEl.append(currentWindEl);

      var currentCityHumidity = data.list[0].main.humidity;
      var currentHumidityEl = $("<p>");
      currentHumidityEl.text(`Humidity:${currentCityHumidity}%`);
      currentHumidityEl.append(currentHumidityEl);

      var fiveDayForecastHeaderEl = $("#fiveDayForecastHeader");
      var fiveDayHeaderEl = $("<h2>");
      fiveDayHeaderEl.text("5-Day Forecast:");
      fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

      var fiveDayForecastEl = $("#fiveDayForecast");

      for (var i = 0; i < data.list.length; i+=8) {
        var date;
        var temp;
        var icon;
        var wind;
        var humidity;

        
 
        date = data.list[i].dt_txt;
        console.log (data)
        date = dayjs(date).format("MM/DD/YYYY");

        console.log (date)
 
        temp = Math.round(data.list[i].main.temp);
        icon = data.list[i].weather[0].icon;
        wind = data.list[i].wind.speed;
        humidity = data.list[i].main.humidity;

        var card = document.createElement("div");
        card.classList.add("card", "col-2", "m-1", "bg-success", "text-white");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.innerHTML = `<h6>${date}</h6>
                       <img src ="http://openweathermap.org/img/wn/${icon}.png"> </><br>
                       ${temp}°F <b>
                      ${wind}MPH <b>
                       ${humidity}%`;
// 
        // card.append.Child(cardBody);
        fiveDayForecastEl.append(card);
        card.append(cardBody);
      }
    });
}

function displaySearchHistory() {
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  var pastSearchesEl = document.getElementById("past-searches");

  pastSearchesEl.innerHTML = "";

  for (i = 0; i < storedCities.length; i++) {
    var pastCityBtn = document.createElement("button");
    pastCityBtn.classList.add("btn", "btn-success", "my-2", "past-city");
    pastCityBtn.setAttribute("style", "width: 100%");
    pastCityBtn.textContent = $(storedCities[i].city);
    pastSearchesEl.appendChild(pastCityBtn);
  }
  return;
}

function getCoordinates() {
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  fetch(requestURL)
  .then(function (response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  })
    .then(function (data) {
      var cityInfo = {
        // city: currentCity,
        lon: data.coord.lon,
        lat: data.coord.lat,
      };
      storedCities.push(cityInfo);
      localStorage.setItem('cities', JSON.stringify(storedCities));

      displaySearchHistory();

      return cityInfo;
    })
    .then(function (data) {
      getWeather(data);
    });

  return;
}

function clearCurrentCityWeather() {
  var currentConditionsEl = document.getElementById("currentConditions");
  currentConditionsEl.innerHTML = "";

  var fiveDayForecastHeaderEl = document.getElementById(
    "fiveDayForecastHeader"
  );
  fiveDayForecastHeaderEl.innerHTML = "";

  var fiveDayForecastEl = document.getElementById("fiveDayForecast");
  fiveDayForecastEl.innerHTML = "";

  return;
}

function getPastCity(event) {
  var element = event.target;
  if (element.matches(".past-city")) {
    currentCity = element.textContent;
    clearCurrentCityWeather();
  }
  var requestURL =
    "https://api.openweathermap.org/data/2.5/weather?q=$(currentCity)&appid=${APIkey}";
  fetch(requestURL)
    .then(function (response) {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (data) {
      var cityInfo = {
        // city: currentCity,
        lon: data.coord.lon,
        lat: data.coord.lat,
      };
      return cityInfo;
    })
    .then(function (data) {
      getWeather(data);
    });
}

function handleCityFormSubmit(event) {
  event.preventDefault();
  // console.log("search");
  currentCity = cityInputEl.val().trim();
  clearCurrentCityWeather();
  getCoordinates();
  return;
}
displaySearchHistory();

searchBtn.on("click", handleCityFormSubmit);
pastSearchedCitiesEl.on("click", getPastCity);
clearBtn.on("click", clearCurrentCityWeather);
