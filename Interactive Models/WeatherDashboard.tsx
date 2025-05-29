
import { Forecast } from '../types';

interface WeatherDashboardProps {
  forecast: Forecast | null;
}

const WeatherDashboard = ({ forecast }: WeatherDashboardProps) => {
  if (!forecast) return null;

  const { location, currentConditions, lastUpdated } = forecast;
  const formattedDate = new Date(lastUpdated).toLocaleString();
  
  // Get weather condition based on temperature and precipitation
  const getWeatherCondition = () => {
    const temp = currentConditions.temperature.average;
    const precip = currentConditions.precipitation;
    
    if (precip > 0.5) return 'Rainy';
    if (precip > 0.1) return 'Light Rain';
    if (currentConditions.humidity > 90) return 'Foggy';
    if (temp > 85) return 'Hot';
    if (temp < 32) return 'Freezing';
    if (temp < 50) return 'Cold';
    if (temp >= 65 && temp <= 85) return 'Pleasant';
    return 'Mild';
  };

  // Get appropriate icon class based on weather condition
  const getWeatherIcon = () => {
    const condition = getWeatherCondition();
    switch (condition) {
      case 'Rainy': return '🌧️';
      case 'Light Rain': return '🌦️';
      case 'Foggy': return '🌫️';
      case 'Hot': return '☀️';
      case 'Freezing': return '❄️';
      case 'Cold': return '🥶';
      case 'Pleasant': return '😎';
      default: return '🌤️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {location.city}, {location.state}
          </h2>
          <p className="text-gray-600">Zip Code: {location.zipCode}</p>
          <p className="text-sm text-gray-500">Last Updated: {formattedDate}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="flex items-center">
            <span className="text-5xl mr-2">{getWeatherIcon()}</span>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {currentConditions.temperature.average}°F
              </p>
              <p className="text-gray-600">{getWeatherCondition()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Temperature</p>
          <p className="text-xl font-semibold">
            {currentConditions.temperature.low}° / {currentConditions.temperature.high}°F
          </p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Precipitation</p>
          <p className="text-xl font-semibold">
            {currentConditions.precipitation} in
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="text-xl font-semibold">
            {currentConditions.humidity}%
          </p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Wind</p>
          <p className="text-xl font-semibold">
            {currentConditions.windSpeed} mph {currentConditions.windDirection}
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Source: {forecast.source}</p>
        <p className="mt-1">
          <span className="font-medium">Note:</span> This forecast is generated using the FarmVibes.AI DeepMC model simulation based on historical weather patterns and geographical data.
        </p>
      </div>
    </div>
  );
};

export default WeatherDashboard;
