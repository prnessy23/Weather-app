var APIkey = f73e3417824084596084ed85ff81b580

var cityInputEl = $('city-input');
var searchBtn = $('#search-button');
var clearBtn =$('#clear-button');
var pastSearchedCitiesEl =$('past-searches');

var currentCity;

// Using openweather API to get updated weather using lat and lon of each city

function getWeather(data) {

    var requestURL = https;//api.openweathermap.org/data/2.5/onecall?lat=${data.lat};&lon=${data.lon};&exclude=minutely,hourly,alerts&units=imperial&appid=${APIkey}
    fetch(requestURL)
    .then(function(response) {
        return response.json();
 })
 .then(function(data) {
// This is the current weather
   var currentConditionsEl =$('#currentConditions');
   currentConditionsEl.addClass('border border-primary');

// This creates city name and appends current weather to it
   var cityNameEl =$('<h2>');
   cityNameEl.text('currentCity');
   currentConditionsEl.append(cityNameEl);

  //  Gets date from result and appends to city name
   var currentCityDate = data.current.dt;
   currentCityDate =moment.js(currentCityDate).format('MM/DD/YYYY');
   var currentDateEl =$('<span>');
   currentDateEl.text(' (${currentCityDate}) ');
   cityNameEl.append(currentDateEl);

   var currentCityWeatherIcon = data.current.weather[0].icon;
   var currentWeatherIconEl = $('<img>')
   currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn" + currentCityWeatherIcon + ".png");
   cityNameEl.append(currentWeatherIconEl);

   var currentCityTemp = data.current.temp;
   var currentTempEl =$('<p>')
   currentTempEl.text('Temp: ${currentCityTemp}°F')
   currentConditionsEl.append(currentTempEl);

   var currentCityWind = data.current.wind.speed;
   var currentWindEl = $('<p>')
   currentWindEl.text('Wind: ${currentCityWind} MPH')
   currentConditionsEl.append(currentWindEl);

   var currentCityHumidity = data.current.humidity;
   var currentHumidityEl = $('<p>')
   currentHumidityEl.text('Humidity: ${currentCityHumidity}%')
   currentHumidityEl.append(currentHumidityEl);

   var fiveDayForecastHeaderEl =$('#fiveDayForecastHeader');
   var fiveDayHeaderEl =$('<h2>');
   fiveDayHeaderEl.text('5-Day Forecast:');
   fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

   var fiveDayForecastHeaderEl =$('#fiveDayForecast');

   for (var i = 1; <=5; ++ )  {
      
    var date;
      var temp;
      var icon;
      var wind;
      var humidity;

      date = data.daily[i].dt;
      date =moment.js.format('MM/DD/YYYY');

      temp =data.daily[i].temp.day;
      icon =data.daily[i].weather[0].icon;
      wind =data.daily[i].wind_speed;
      humidity=data.daily[i].humidity;

      var card = document.createElement('div');
      card.classList.add('card', 'col-2', "m-1",'bg-success', 'text-white');

      var cardBody =document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.innerHTML = '<h6>${date}</h6>
                       <img src ="http://openweathermap.org/img/wn/${icon}.png"> </><br>
                       ${temp}°F <b>
                      ${wind}MPH <b>
                       ${humidity}%'
    
    card.append.Child(cardBody);
    fiveDayForecastEl.append(card);

    }

return;

function displaySearchHistory ()   {
    var storedCities =JSON.parse(localstorage.getItem('cities')) || [];
    var pastSearchesEl =document.getElementbyId('past searches');

    pastSearchesEl.innerHTML ='';

    for (i = 0; i < storedCities.length; i++) {
    
        var pastCityBtn =document.createElement('button');
        pastCityBtn.classList.add("btn","btn-success", "my-2", "past-city");
        pastCityBtn.setAttribute ("style, "width: 100%");
        pastCityBtn.textContent = $(storedCities[i].city);
        pastSearchesEl.appendChild(pastCityBtn);
    
    }
    return;


}
function getCoordinates () {
var requestURL ='https://api.openweathermap.org/data/2.5/weather?q=$(currentCity)&appid=${APIkey}';
var storedCities =JSON.parse(localstorage.getItem('cities')) || [];

fetch(requestURL)
then(function (response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
})
.then(function(data)

var cityInfo = {
     city: currentCity,
     lon: data.coord.lon,
     lat: data.coord.lat
}
storedCities.push(cityInfo;
    localstorage.setItem(cities, JSON.stringify(storedCities))

    displaySearchHistory();

    return cityInfo;
    
} ) 
.then(function (data) {
    getWeather(data);
} )

return;

function clearCurrentCityWeather (){
var currentConditionsEl = document.getElementbyId('currentConditions');
currentConditionsEl.innerHTML ='';

var fiveDayForecastHeaderEl = document.getElementbyId('fiveDayForecastHeader');
fiveDayForecastHeaderEl.innerHTML ="";

var fiveDayForecastEl =document.getElementbyId('fiveDayForecast');
fiveDayForecastEl.innerHTML ="";

return;


}

function handleCityFormSubmit (event) {
 
    event.preventDefault();
    currentCity =cityInputEl.val().trim();

    clearCurrentCityWeather();
    getCoordinates();

    return;
}

function getPastCity (event){
var element =event.target;

if (element.matches('.past-city')){
    currentCity =element.textContent;

    clearCurrentCityWeather ();

    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=$(currentCity)&appid=${APIkey}';

    fetch(requestURL)
        .then(function( response)  {
if (response.status >= 200 && response.status <= 299){
    return response.json();
    else {
        throw Error(response.statusText);
    }
 })
 .then(function (data){
    var cityInfo = {
        city: currentCity,
        lon: data.coord.lon,
        lat: data.coord.lat,
    }
    return cityInfo;
 })
 .then(function (data){
    getWeather(data);
 })
}
return;

}
displaySearchHistory ();

searchBtn.on('click', handleCityFormSubmit);

clearBtn.on('click', handleClearHistory);

pastSearchedCitiesEl.on('click', getPastCity);
    
   






}









}








})