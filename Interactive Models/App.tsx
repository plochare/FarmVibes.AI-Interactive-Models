import { useState, useEffect } from 'react';
import ZipCodeInput from './components/ZipCodeInput';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherCharts from './components/WeatherCharts';
import { Forecast } from './types';
import './App.css';

function App() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load recent searches from localStorage on initial render
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      try {
        JSON.parse(storedSearches);
      } catch (e) {
        localStorage.removeItem('recentSearches');
      }
    }
  }, []);

  const handleForecastGenerated = (newForecast: Forecast) => {
    setForecast(newForecast);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">FarmVibes.AI Micro-Climate Forecast</h1>
          <p className="mt-2 text-green-100">
            Powered by Microsoft's DeepMC model for accurate local weather predictions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ZipCodeInput 
            onForecastGenerated={handleForecastGenerated} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
              <p className="mt-4 text-gray-600">Generating micro-climate forecast...</p>
            </div>
          )}

          {!isLoading && forecast && (
            <>
              <WeatherDashboard forecast={forecast} />
              <WeatherCharts forecast={forecast} />
              
              <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-800">About This Forecast</h2>
                <p className="mb-4">
                  This micro-climate forecast is generated using a simulation of Microsoft's FarmVibes.AI DeepMC model, 
                  which combines historical weather data, geographical information, and machine learning to provide 
                  localized weather predictions.
                </p>
                <p className="mb-4">
                  The DeepMC model is designed to provide more accurate local weather forecasts by considering 
                  micro-climate factors that traditional weather models might miss. This is especially valuable 
                  for agricultural applications where local conditions can significantly impact crop growth and management.
                </p>
                <p>
                  <strong>Note:</strong> This is a demonstration using simulated data based on the DeepMC model's approach. 
                  For production agricultural use cases, the full FarmVibes.AI toolkit provides additional capabilities 
                  and more precise forecasts.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} FarmVibes.AI Micro-Climate Forecast</p>
              <p className="text-sm text-gray-400 mt-1">
                Powered by Microsoft's DeepMC model technology
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/microsoft/farmvibes-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                FarmVibes.AI GitHub
              </a>
              <a 
                href="https://microsoft.github.io/farmvibes-ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
