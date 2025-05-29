import { useState } from 'react';
import { Location, Forecast } from '../types';
import { zipCodeToLocation, generateMockWeatherData } from '../lib/mockData';

interface ZipCodeInputProps {
  onForecastGenerated: (forecast: Forecast) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ZipCodeInput = ({ onForecastGenerated, isLoading, setIsLoading }: ZipCodeInputProps) => {
  const [zipCode, setZipCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateZipCode(zipCode)) {
      setError('Please enter a valid 5-digit US zip code');
      return;
    }

    if (!zipCodeToLocation[zipCode]) {
      setError('Zip code not found in our database');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      try {
        const locationData = zipCodeToLocation[zipCode];
        const location: Location = {
          zipCode,
          city: locationData.city,
          state: locationData.state,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        };

        // Generate mock weather data
        const { currentConditions, dailyForecast } = generateMockWeatherData(
          location.latitude,
          location.longitude
        );

        // Create forecast object
        const forecast: Forecast = {
          location,
          currentConditions,
          dailyForecast,
          lastUpdated: new Date().toISOString(),
          source: 'FarmVibes.AI DeepMC Model (Simulated)'
        };

        // Update recent searches
        if (!recentSearches.includes(zipCode)) {
          const updatedSearches = [zipCode, ...recentSearches].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }

        onForecastGenerated(forecast);
      } catch (err) {
        setError('Error generating forecast. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRecentSearch = (zip: string) => {
    setZipCode(zip);
    // Auto-submit when selecting a recent search
    const event = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(event);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-green-800">Enter US Zip Code</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="e.g. 98101"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={5}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Generating Forecast...' : 'Generate Forecast'}
        </button>
      </form>
      
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((zip) => (
              <button
                key={zip}
                onClick={() => handleRecentSearch(zip)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
              >
                {zip} - {zipCodeToLocation[zip]?.city || 'Unknown'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipCodeInput;
