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
  tempUnit.innerHTML = "°F"
}

function switchToCel (event) {
  let degree = document.querySelector("#degrees");
  let tempFah = degree.textContent;
  let FahToCel = Math.round((tempFah-32)*(5/9));
  degree.textContent = FahToCel;
  temperatureUnit = "C";
  let tempUnit = document.querySelector("#temperatureUnit");
  tempUnit.innerHTML = "°C"
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

let apiKey = "a90b829ff3b4e9e89e1ee2a16af1166b";
let units = "metric";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather"

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener ("submit", logCity);

function logCity (event) {
  event.preventDefault ();
  let city = document.querySelector ("#city-input");
  let cityInput = city.value;
  
  let apiUrl = `${apiEndpoint}?q=${cityInput}&units=${units}&appid=${apiKey}`;

axios.get(apiUrl).then(showCityTemp);
city.value = "";
}

function showCityTemp (response) {
  console.log(response.data);
  
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
  
  let forecast = document.querySelector ("#weatherDescription");
  forecast.innerHTML = (response.data.weather[0].description);

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


