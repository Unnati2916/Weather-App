import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import image from './images/image.png';
import axios from 'axios';
import HourlyForecast from './components/HourlyForecast';
import { useState } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const api_key = 'YOUR_API_KEY_HERE';
  const api_url = 'https://api.weatherapi.com/v1/forecast.json';

  const fetchData = async (query) => {
    try {
      const response = await axios.get(`${api_url}?key=${api_key}&q=${query}&days=1`);
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      setError('There was an error or the city was not found');
      setWeatherData(null);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const query = `${latitude},${longitude}`;
          fetchData(query);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('geolocation is not supported by this browser !');
    }
  };

  function handleKeyPress(event) {
    if (event.key == 'Enter') {
      fetchData(city);
    }
  }

  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg mt-10 p-4 rounded w-full max-w-sm">
        <div className="flex">
          <div className="flex border-none rounded items-center px-2 py-2 w-full">
            <FaSearch className="h-5 w-5" />
            <input
              onKeyUp={handleKeyPress}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="pl-2 border-none focus:outline-none"
            />
          </div>

          <button
            className="bg-green-500 px-5 py-2 text-white ml-2 rounded hover:bg-green-600"
            onClick={getCurrentLocation}
          >
            <FaMapMarkerAlt className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {weatherData && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{weatherData.location.name}</h2>
            <img src={weatherData.current.condition.icon} className="mx-auto h-40" />
            <p className="text-lg font-semibold">{weatherData.current.temp_c}</p>
            <p className="text-sm font-semibold capitalize">
              {weatherData.current.condition.text}
            </p>
            <HourlyForecast hourlyData={weatherData.forecast.forecastday[0].hour} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
