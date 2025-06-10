document.addEventListener('DOMContentLoaded', () => {

    const locationElement = document.getElementById('location');
    const weatherDataElement = document.getElementById('weather-data');
    const errorMessageElement = document.getElementById('error-message');

    // Example coordinates (New York City)
    const latitude = 40.71;
    const longitude = -74.01;
    
    // URL for Open-Meteo API
    const baseApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`;

    // Update location
    locationElement.textContent = `Location: Lat ${latitude}, Lon ${longitude}`;

    
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    
    if (view === 'temperature') {
        fetchTemperature();
    } else if (view === 'condition') {
        fetchCondition();
    }

    
    async function fetchTemperature() {
        // API URL temp
        const apiUrl = `${baseApiUrl}&current=temperature_2m`;
        weatherDataElement.innerHTML = '<p>Loading temperature...</p>'; // loading message

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.current && 'temperature_2m' in data.current) {
                const temp = data.current.temperature_2m;
                // Display temp
                weatherDataElement.innerHTML = `<p>Temperature: <span>${temp}</span> &deg;C</p>`;
                errorMessageElement.textContent = ''; // Clears errors
            } else {
                throw new Error('Temperature data not found in API response.');
            }
        } catch (error) {
            console.error("Error fetching temperature data:", error);
            weatherDataElement.innerHTML = '';
            errorMessageElement.textContent = `Failed to load temperature: ${error.message}`;
        }
    }

    
    async function fetchCondition() {
        // API URL  weather code condition
        const apiUrl = `${baseApiUrl}&current=weather_code`;
        weatherDataElement.innerHTML = '<p>Loading condition...</p>'; 

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.current && 'weather_code' in data.current) {
                const weatherCode = data.current.weather_code;
                // Display fetched
                weatherDataElement.innerHTML = `<p>Condition: <span>${getWeatherCondition(weatherCode)}</span></p>`;
                errorMessageElement.textContent = ''; // Clear errors
            } else {
                throw new Error('Weather condition data not found in API response.');
            }
        } catch (error) {
            console.error("Error fetching condition data:", error);
            weatherDataElement.innerHTML = '';
            errorMessageElement.textContent = `Failed to load condition: ${error.message}`;
        }
    }

    /**
     * Converts weather code
     * @param {number} code - The weather code from the API.
     * @returns {string} A description of the weather condition.
     */
    function getWeatherCondition(code) {
        
        const conditions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Drizzle: Light',
            53: 'Drizzle: Moderate',
            55: 'Drizzle: Dense',
            56: 'Freezing Drizzle: Light',
            57: 'Freezing Drizzle: Dense',
            61: 'Rain: Slight',
            63: 'Rain: Moderate',
            65: 'Rain: Heavy',
            66: 'Freezing Rain: Light',
            67: 'Freezing Rain: Heavy',
            71: 'Snow fall: Slight',
            73: 'Snow fall: Moderate',
            75: 'Snow fall: Heavy',
            77: 'Snow grains',
            80: 'Rain showers: Slight',
            81: 'Rain showers: Moderate',
            82: 'Rain showers: Violent',
            85: 'Snow showers: Slight',
            86: 'Snow showers: Heavy',
            95: 'Thunderstorm: Slight or moderate',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        return conditions[code] || 'Condition not available';
    }
});
