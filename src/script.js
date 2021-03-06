let now = new Date(); 

//Current Date
let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let weekday = weekdays[now.getDay()]; 

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let month = months[now.getMonth()];

let day = now.getDate();

let displayDate = (`${weekday} ${day}th ${month} ${now.getFullYear()}`);


if (day === 1) {
  displayDate = (`${weekday} ${day}st ${month} ${now.getFullYear()}`);
 } else if (day === 2) {
   displayDate = (`${weekday} ${day}nd ${month} ${now.getFullYear()}`);
 } else if (day === 3) {
   displayDate = (`${weekday} ${day}rd ${month} ${now.getFullYear()}`);
 }
 
let currentDate = document.querySelector("#date");
currentDate.innerHTML = displayDate; 

//Current Time
let currentTime = document.querySelector("#time");
let timeZone = now.getTimezoneOffset()/-60;
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`
}

let Time = (`${now.getHours()}:${minutes}h (GMT ${timeZone})`);
if (timeZone > 0) {
  Time = (`${now.getHours()}:${minutes}h (GMT +${timeZone})`);
}

currentTime.innerHTML = Time;

// Add a search engine, when searching for a city (i.e. Paris), 
// display the city name on the page after the user submits the form.
//function replaceByCity (event) {
  //event.preventDefault();
  //let cityInput = document.querySelector("#city-input");
  //let replaceCity = document.querySelector("h1");
  //replaceCity.innerHTML = cityInput.value;
//}

//let cityForm = document.querySelector("#city-form");
//cityForm.addEventListener ("submit", replaceByCity);

//Bonus Feature: Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit. 
// When clicking on it, it should convert the temperature to Fahrenheit. 
// When clicking on Celsius, it should convert it back to Celsius.
let temperatureUnit = "C"; 

function switchToFa (event) {
  let degree = document.querySelector("#degrees");
  let tempCelsius = degree.textContent;
  let CelsiusToFahrenheit = Math.round(tempCelsius*(9/5)+32);
  degree.textContent = CelsiusToFahrenheit;
  temperatureUnit = "F";
  let tempUnit = document.querySelector("#temperatureUnit");
  tempUnit.innerHTML = "??F"
}

function switchToCel (event) {
  let degree = document.querySelector("#degrees");
  let tempFah = degree.textContent;
  let FahToCel = Math.round((tempFah-32)*(5/9));
  degree.textContent = FahToCel;
  temperatureUnit = "C";
  let tempUnit = document.querySelector("#temperatureUnit");
  tempUnit.innerHTML = "??C"
}

function convertTemp (event) {
  if (temperatureUnit === "C") {
    switchToFa(event);
  } else {
    switchToCel(event);
  }
}

let switchDegree = document.querySelector("#degrees");
switchDegree.addEventListener("click", convertTemp);

// On your project, when a user searches for a city (example: New York),
// it should display the name of the city on the result page 
// and the current temperature of the city.

let apiKey = "98cce09f1dbb7a1622c5c8f8deebddd8";
let units = "metric";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener ("submit", logCity);
let searchButton = document.querySelector("#searchButton");
searchButton.addEventListener ("click", logCity);

function logCity (event) {
  event.preventDefault ();
  let city = document.querySelector ("#city-input");
  let cityInput = city.value;
  
  let apiUrl = `${apiEndpoint}?q=${cityInput}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showCityTemp);
  city.value = "";
}

function showCityTemp (response) {
  if (temperatureUnit === "F") {
    switchToCel ();
  }
  let cityCLName = response.data.name;
  let replaceCity = document.querySelector("h1");
  replaceCity.innerHTML = cityCLName;
  
  let cityTemp = Math.round(response.data.main.temp);
  let degrees = document.querySelector ("#degrees");
  degrees.innerHTML = cityTemp;
  let rain = document.querySelector("#mm");
  rain.innerHTML = (response.data.main.humidity);
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let tempIcon = document.querySelector ("#tempIcon");
  let tempIconVar = (response.data.weather[0].icon);
  tempIcon.setAttribute ("src", `http://openweathermap.org/img/wn/${tempIconVar}@2x.png`);
  
  let weatherDescription = document.querySelector ("#weatherDescription");
  weatherDescription.innerHTML = (response.data.weather[0].description);

  let windDirection = document.querySelector("#direction");
  
  if (response.data.wind.deg < 45) {
  windDirection.innerHTML = "N";
  }
  else if ((response.data.wind.deg >= 45) && (response.data.wind.deg <90)) {
    windDirection.innerHTML = "NE";
  }
    else if ((response.data.wind.deg >= 90) && (response.data.wind.deg <135)) {
      windDirection.innerHTML = "E";
    }
    else if ((response.data.wind.deg >= 135) && (response.data.wind.deg <180)) {
      windDirection.innerHTML = "SE";
    }
    else if ((response.data.wind.deg >= 180) && (response.data.wind.deg <225)) {
      windDirection.innerHTML = "S";
    }
    else if ((response.data.wind.deg >= 225) && (response.data.wind.deg <270)) {
      windDirection.innerHTML = "SW";
    }
    else if ((response.data.wind.deg >= 270) && (response.data.wind.deg <315)) {
      windDirection.innerHTML = "W";
    }
    else {
      windDirection.innerHTML = "NW";
    }
   
    getForecast(response.data.coord);
}



//Add a Current Location button. 
//When clicking on it, it uses the Geolocation API to get your GPS coordinates
// and display the city and current temperature using the OpenWeather API.
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener ("click", logCL);

function logCL (event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(logPosition);
}


function logPosition (position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let posApiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let positionApi = `${posApiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(positionApi).then(showCityTemp);
}

//forecast
function getForecast(coordinates) {
  
  let lon = (coordinates.lon);
  let lat = (coordinates.lat);
  let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(forecastAPI).then(showForecast);
}

function formatForecastDay (timestamp) {
let forecastDate = new Date(timestamp * 1000);
let forecastDay = forecastDate.getDay();
let ForecastDays = ["Sun", "Mon", "Tue","Wed", "Thu", "Fri", "Sat"]

return ForecastDays[forecastDay];
}

function showForecast(response) {
let forecastDays = (response.data.daily);

let forecast = document.querySelector("#forecast");
let forecastHTML = `<div class="row">`;

forecastDays.forEach(function(forecastDay, index) {
  if (index < 7) {
forecastHTML = forecastHTML + `

<div class="col weekday" >
${formatForecastDay (forecastDay.dt)} <br>

<img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
alt=""
width ="42"
/>  <br>
${Math.round(forecastDay.temp.day)}???C

</div>`;
  }
});

forecastHTML= forecastHTML + `</div>`;
forecast.innerHTML = forecastHTML;

}

