'use strict';

const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const cityInput = document.querySelector('#cityInput');
const weatherCards = document.querySelector('.weather-cards');

const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
  location.reload();
})

let cityName = 'Riyadh';
async function getCity(city) {
  city = cityInput.value.trim();
  !city ? (city = cityName) : city;
  const apiKey = '74a436b08cfd4cb48e355742240301';
  const url = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
  );
  const data = await url.json();
  currentDay(data);
  weatherCards.innerHTML = '';
  getWeatherForcast(city);  
}




async function userLocationFetch(xcity) {
  const apiKey = '74a436b08cfd4cb48e355742240301';
  const url = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${xcity}&days=6&aqi=no&alerts=no`
  );
  const data = await url.json();

  if (weatherCards !== null) {
    weatherCards.innerHTML = '';
    for (let i = 1; i < data.forecast.forecastday.length; i++) {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const day = days[new Date(data.forecast.forecastday[i].date).getDay()];
      weatherCards.innerHTML += `
        <li class="card">
                <h3>${day}</h3>
                <img
                  src="${data.forecast.forecastday[i].day.condition.icon}"
                  alt="icon" />
                <h4>${data.forecast.forecastday[i].day.condition.text}</h4>
                <h4>Temp: ${data.forecast.forecastday[i].day.avgtemp_c}°C</h4>
                <h4>Wind: ${data.forecast.forecastday[i].day.maxwind_kph} km/h</h4>
                <h4>Humidity: ${data.forecast.forecastday[i].day.avghumidity}%</h4>
              </li>
      `;
    }
  }
}

function currentDay(data) {
  const currentDay = new Date();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const day = days[currentDay.getDay()];

  document.querySelector(
    '#cityName'
  ).textContent = `${data.location.name}, ${data.location.country} - ${day}`;
  document.querySelector(
    '#currentWeatherIcon'
  ).src = `${data.current.condition.icon}`;
  document.querySelector(
    '#temprature'
  ).textContent = `Temp: ${data.current.temp_c}°C`;
  document.querySelector(
    '#humidity'
  ).textContent = `Humidity: ${data.current.humidity}%`;
  document.querySelector(
    '#windSpeed'
  ).textContent = `Wind: ${data.current.wind_kph} km/h`;
  document.querySelector(
    '#condition'
  ).textContent = `${data.current.condition.text}`;
}

// get weather forcast for next 5 days

async function getWeatherForcast(xcity) {
  xcity = cityInput.value.trim();
  !xcity ? (xcity = cityName) : xcity;

  const apiKey = '74a436b08cfd4cb48e355742240301';
  const url = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${xcity}&days=6&aqi=no&alerts=no`
  );
  const data = await url.json();
  for (let i = 1; i < data.forecast.forecastday.length; i++) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const day = days[new Date(data.forecast.forecastday[i].date).getDay()];
    weatherCards.innerHTML += `
    <li class="card">
              <h3>${day}</h3>
              <img
                src="${data.forecast.forecastday[i].day.condition.icon}"
                alt="icon" />
              <h4>${data.forecast.forecastday[i].day.condition.text}</h4>
              <h4>Temp: ${data.forecast.forecastday[i].day.avgtemp_c}°C</h4>
              <h4>Wind: ${data.forecast.forecastday[i].day.maxwind_kph} km/h</h4>
              <h4>Humidity: ${data.forecast.forecastday[i].day.avghumidity}%</h4>
            </li>
    `;
  }
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lon = +position.coords.longitude.toFixed(2);
      const lat = +position.coords.latitude.toFixed(2);
      const apiKey = '74a436b08cfd4cb48e355742240301';
      const url = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
      );
      const data = await url.json();

      currentDay(data);
      userLocationFetch(data.location.name);
    });
  }
}

searchBtn.addEventListener('click', () => {
  if (cityInput.value) {
    weatherCards.innerHTML = '';
    getCity();
    getWeatherForcast();
  } else {
    alert('Please enter a city');
  }
});

cityInput.addEventListener('keyup', e => {
  if (e.key === 'Enter' && cityInput.value) {
    weatherCards.innerHTML = '';
    getCity();
    getWeatherForcast();
  } else if (e.key === 'Enter' && !cityInput.value) {
    alert('Please enter a city');
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    getUserLocation();
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});
// get city while typing
cityInput.addEventListener('keyup', () => {
  if (cityInput.value) {
    getCity();
  }
})

// when document load
getCity();


// dark mode

function darkMode() {
  const element = document.body;
  element.classList.toggle('dark-mode');

  let theme;

  if (element.classList.contains('dark-mode')) {
    document.getElementById(
      'darkmodeBtn'
    ).innerHTML = `<box-icon name="sun" type="regular" color="white" size="md"></box-icon>`;
    document.querySelector('.nav-bar').classList.toggle('dark-color-bg');
    theme = 'DARK';
  } else {
    document.getElementById(
      'darkmodeBtn'
    ).innerHTML = `<box-icon name="moon" type="regular" color="white" size="md"></box-icon>`;
    document.querySelector('.nav-bar').classList.toggle('dark-color-bg');
    theme = 'LIGHT';
  }

  element.style.transition = 'all 0.5s ease';
  localStorage.setItem('darkMode', JSON.stringify(theme));
}

let getTheme = JSON.parse(localStorage.getItem('darkMode'));

if (getTheme === 'DARK') {
  darkMode();
}

document.getElementById('darkmodeBtn').addEventListener('click', () => {
  darkMode();
});

