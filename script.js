const apiKey = '7ce09238d4cd9bbb856e487ed7ab71a8';

async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather data. Please enter a valid city name.");
        }
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
        alert(error.message); // Displaying error message to the user
    }
}

// Geolocation to detect user's location and fetch weather data
async function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
                );
                if (!response.ok) {
                    throw new Error("Unable to fetch weather data for your location.");
                }
                const data = await response.json();
                updateWeatherUI(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");
const descriptionText = document.querySelector(".description-text");
const date = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");

function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${data.visibility / 1000} km`;
    descriptionText.textContent = data.weather[0].description;

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = inputElement.value;
    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = "";
    }
});

document.querySelector(".location-button").addEventListener("click", fetchWeatherByLocation);

function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };
    return iconMap[weatherCondition] || "help";
}

function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    const countryCode = data.sys.country; // Get the country code from API data
    document.querySelector(".country-code").textContent = countryCode; // Update country code
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${data.visibility / 1000} km`;
    descriptionText.textContent = data.weather[0].description;

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();

    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}


// Function to convert temperature units
document.querySelector(".unit-toggle").addEventListener("click", function () {
    const currentUnit = temperature.textContent.slice(-1);
    const tempInCelsius = parseFloat(temperature.textContent);

    if (currentUnit === 'C') {
        temperature.textContent = `${Math.round(tempInCelsius * 9/5 + 32)}°F`;
    } else {
        temperature.textContent = `${Math.round((tempInCelsius - 32) * 5/9)}°C`;
    }
});
