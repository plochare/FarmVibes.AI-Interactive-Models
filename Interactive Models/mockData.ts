// Mock data for US zip codes to location mapping
export const zipCodeToLocation: Record<string, {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}> = {
  "98101": {
    city: "Seattle",
    state: "WA",
    latitude: 47.6062,
    longitude: -122.3321
  },
  "10001": {
    city: "New York",
    state: "NY",
    latitude: 40.7128,
    longitude: -74.0060
  },
  "60601": {
    city: "Chicago",
    state: "IL",
    latitude: 41.8781,
    longitude: -87.6298
  },
  "94102": {
    city: "San Francisco",
    state: "CA",
    latitude: 37.7749,
    longitude: -122.4194
  },
  "33101": {
    city: "Miami",
    state: "FL",
    latitude: 25.7617,
    longitude: -80.1918
  },
  "75201": {
    city: "Dallas",
    state: "TX",
    latitude: 32.7767,
    longitude: -96.7970
  },
  "80202": {
    city: "Denver",
    state: "CO",
    latitude: 39.7392,
    longitude: -104.9903
  },
  "97201": {
    city: "Portland",
    state: "OR",
    latitude: 45.5051,
    longitude: -122.6750
  },
  "85001": {
    city: "Phoenix",
    state: "AZ",
    latitude: 33.4484,
    longitude: -112.0740
  },
  "02108": {
    city: "Boston",
    state: "MA",
    latitude: 42.3601,
    longitude: -71.0589
  }
};

// Generate mock weather data based on location and date
export const generateMockWeatherData = (latitude: number, longitude: number, days: number = 7): {
  currentConditions: any;
  dailyForecast: any[];
} => {
  const currentDate = new Date();
  const currentConditions = generateDayWeather(latitude, longitude, currentDate);
  
  const dailyForecast = [];
  for (let i = 1; i <= days; i++) {
    const forecastDate = new Date();
    forecastDate.setDate(currentDate.getDate() + i);
    dailyForecast.push(generateDayWeather(latitude, longitude, forecastDate));
  }
  
  return {
    currentConditions,
    dailyForecast
  };
};

// Helper function to generate weather for a specific day
const generateDayWeather = (latitude: number, longitude: number, date: Date) => {
  // Use latitude, longitude, and date to create deterministic but varied weather
  const dateStr = date.toISOString().split('T')[0];
  const dateSeed = dateStr.split('-').reduce((sum, part) => sum + parseInt(part, 10), 0);
  const latSeed = Math.round(latitude * 10);
  const lonSeed = Math.round(Math.abs(longitude) * 10);
  const seed = (dateSeed + latSeed + lonSeed) % 100;
  
  // Temperature varies by latitude (colder at higher latitudes)
  const baseTemp = 75 - (latitude / 60) * 50;
  const tempVariation = 15 * Math.sin((seed / 100) * Math.PI * 2);
  const avgTemp = baseTemp + tempVariation;
  
  // More precipitation near coasts and in certain seasons
  const monthFactor = (date.getMonth() + 1) / 12; // 0-1 based on month
  const coastalFactor = Math.min(Math.abs(longitude) / 180, 1); // 0-1 based on distance from prime meridian
  const precipBase = (1 - coastalFactor) * 0.8 + monthFactor * 0.5;
  const precipitation = Math.max(0, precipBase * (seed / 40));
  
  // Humidity is related to precipitation and temperature
  const humidity = Math.min(90, Math.max(30, 50 + (precipitation * 20) - (avgTemp - 70)));
  
  // Wind speed varies by location and season
  const windBase = 5 + (Math.abs(latitude - 45) / 45) * 10;
  const windSpeed = Math.max(0, windBase + (seed % 10) - 5);
  
  // Wind direction (simplified)
  const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const windDirection = windDirections[seed % windDirections.length];
  
  return {
    date: dateStr,
    temperature: {
      high: Math.round(avgTemp + 8),
      low: Math.round(avgTemp - 8),
      average: Math.round(avgTemp)
    },
    precipitation: parseFloat(precipitation.toFixed(2)),
    humidity: Math.round(humidity),
    windSpeed: Math.round(windSpeed),
    windDirection
  };
};
