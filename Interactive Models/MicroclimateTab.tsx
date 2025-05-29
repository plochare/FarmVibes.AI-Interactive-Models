import React from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

// Mock data for weather forecasts
const generateForecastData = (location: string, days: number = 7) => {
  const data = [];
  const startDate = new Date();
  const baseTemp = location === 'iowa' ? 75 : location === 'california' ? 85 : location === 'kansas' ? 78 : 72;
  const baseHumidity = location === 'iowa' ? 65 : location === 'california' ? 45 : location === 'kansas' ? 55 : 70;
  const baseWindSpeed = location === 'iowa' ? 8 : location === 'california' ? 6 : location === 'kansas' ? 12 : 5;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Add some variation based on day
    const dayVariation = Math.sin(i / 2) * 8;
    const randomVariation = (Math.random() - 0.5) * 5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: Math.round(baseTemp + dayVariation + randomVariation),
      humidity: Math.min(100, Math.max(20, Math.round(baseHumidity + (dayVariation / 2) + randomVariation))),
      windSpeed: Math.max(0, Math.round(baseWindSpeed + (Math.random() - 0.3) * 6)),
      tempMin: Math.round(baseTemp + dayVariation + randomVariation - 8),
      tempMax: Math.round(baseTemp + dayVariation + randomVariation + 8),
      tempHistorical: Math.round(baseTemp + (dayVariation / 2)),
      humidityHistorical: Math.round(baseHumidity + (dayVariation / 3)),
      windSpeedHistorical: Math.round(baseWindSpeed + (Math.random() - 0.5) * 3),
    });
  }
  
  return data;
};

// Predefined locations
const locations = [
  { id: 'iowa', name: 'Central Iowa Weather Station', lat: 41.878, lng: -93.097 },
  { id: 'california', name: 'Central Valley, California', lat: 36.778, lng: -119.417 },
  { id: 'kansas', name: 'Western Kansas Station', lat: 38.501, lng: -98.315 },
  { id: 'idaho', name: 'Eastern Idaho Research Farm', lat: 43.613, lng: -116.237 },
];

// Time range options
const timeRanges = [
  { id: '7', name: '7 Days' },
  { id: '14', name: '14 Days' },
  { id: '30', name: '30 Days' },
];

const MicroclimateTab: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = React.useState('iowa');
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('7');
  const [selectedParameter, setSelectedParameter] = React.useState('temperature');
  
  const handleLocationChange = (event: SelectChangeEvent) => {
    setSelectedLocation(event.target.value);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setSelectedTimeRange(event.target.value);
  };
  
  const handleParameterChange = (
    _: React.MouseEvent<HTMLElement>,
    newParameter: string,
  ) => {
    if (newParameter !== null) {
      setSelectedParameter(newParameter);
    }
  };
  
  const location = locations.find(l => l.id === selectedLocation) || locations[0];
  const days = parseInt(selectedTimeRange);
  const forecastData = generateForecastData(selectedLocation, days);
  
  // Get current conditions (first day in forecast)
  const currentConditions = forecastData[0];
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2"><strong>Date:</strong> {label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value} 
              {selectedParameter === 'temperature' ? '°F' : 
               selectedParameter === 'humidity' ? '%' : 
               selectedParameter === 'windSpeed' ? ' mph' : ''}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Determine chart content based on selected parameter
  const renderChart = () => {
    switch (selectedParameter) {
      case 'temperature':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="tempMin" 
                stackId="1"
                stroke="none"
                fill="#82ca9d" 
                fillOpacity={0.2}
                name="Min Temp"
              />
              <Area 
                type="monotone" 
                dataKey="tempMax" 
                stackId="1"
                stroke="none"
                fill="#8884d8" 
                fillOpacity={0.2}
                name="Max Temp"
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff7300" 
                strokeWidth={2}
                name="Forecast"
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="tempHistorical" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                name="Historical Average"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'humidity':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" label="High Humidity" />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#1565C0" 
                strokeWidth={2}
                name="Forecast"
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="humidityHistorical" 
                stroke="#82ca9d" 
                strokeDasharray="5 5"
                name="Historical Average"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'windSpeed':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 'dataMax + 5']} label={{ value: 'Wind Speed (mph)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={15} stroke="orange" strokeDasharray="3 3" label="Moderate Wind" />
              <ReferenceLine y={25} stroke="red" strokeDasharray="3 3" label="High Wind" />
              <Line 
                type="monotone" 
                dataKey="windSpeed" 
                stroke="#FF8F00" 
                strokeWidth={2}
                name="Forecast"
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="windSpeedHistorical" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                name="Historical Average"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
        Microclimate Forecast
      </Typography>
      
      <Typography variant="body1" paragraph>
        This interactive example demonstrates how FarmVibes.AI's DeepMC model generates microclimate forecasts 
        for specific locations. These localized predictions can help farmers anticipate weather conditions 
        that might affect their crops and operations.
      </Typography>
      
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Top section - Controls */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="location-select-label">Weather Station Location</InputLabel>
                  <Select
                    labelId="location-select-label"
                    id="location-select"
                    value={selectedLocation}
                    label="Weather Station Location"
                    onChange={handleLocationChange}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="timerange-select-label">Forecast Period</InputLabel>
                  <Select
                    labelId="timerange-select-label"
                    id="timerange-select"
                    value={selectedTimeRange}
                    label="Forecast Period"
                    onChange={handleTimeRangeChange}
                  >
                    {timeRanges.map((range) => (
                      <MenuItem key={range.id} value={range.id}>{range.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <Typography id="parameter-toggle-label" gutterBottom>
                  Weather Parameter
                </Typography>
                <ToggleButtonGroup
                  value={selectedParameter}
                  exclusive
                  onChange={handleParameterChange}
                  aria-label="weather parameter"
                  fullWidth
                >
                  <ToggleButton value="temperature" aria-label="temperature">
                    <ThermostatIcon sx={{ mr: 1 }} />
                    Temperature
                  </ToggleButton>
                  <ToggleButton value="humidity" aria-label="humidity">
                    <WaterDropIcon sx={{ mr: 1 }} />
                    Humidity
                  </ToggleButton>
                  <ToggleButton value="windSpeed" aria-label="wind speed">
                    <AirIcon sx={{ mr: 1 }} />
                    Wind Speed
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Paper>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 2fr'
            },
            gap: 4
          }}>
            {/* Current conditions */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Current Conditions
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {location.name}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Lat: {location.lat.toFixed(3)}, Lng: {location.lng.toFixed(3)}
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThermostatIcon sx={{ fontSize: 40, color: '#ff7300', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Temperature</Typography>
                      <Typography variant="h4">{currentConditions.temperature}°F</Typography>
                      <Typography variant="caption">
                        Range: {currentConditions.tempMin}°F - {currentConditions.tempMax}°F
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterDropIcon sx={{ fontSize: 40, color: '#1565C0', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Humidity</Typography>
                      <Typography variant="h4">{currentConditions.humidity}%</Typography>
                      <Typography variant="caption">
                        {currentConditions.humidity > 80 ? 'High' : 
                         currentConditions.humidity > 60 ? 'Moderate' : 'Low'} humidity
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon sx={{ fontSize: 40, color: '#FF8F00', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Wind Speed</Typography>
                      <Typography variant="h4">{currentConditions.windSpeed} mph</Typography>
                      <Typography variant="caption">
                        {currentConditions.windSpeed > 25 ? 'Strong winds' : 
                         currentConditions.windSpeed > 15 ? 'Moderate winds' : 'Light winds'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Forecast Confidence
                  </Typography>
                  <Box sx={{ 
                    width: '100%', 
                    height: 10, 
                    bgcolor: '#e0e0e0',
                    borderRadius: 5,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      width: `${days <= 7 ? 85 : days <= 14 ? 70 : 55}%`, 
                      height: '100%', 
                      bgcolor: days <= 7 ? '#4caf50' : days <= 14 ? '#ff9800' : '#f44336',
                    }} />
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {days <= 7 ? 'High confidence (1-7 days)' : 
                     days <= 14 ? 'Moderate confidence (8-14 days)' : 
                     'Lower confidence (15+ days)'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            {/* Forecast chart */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedParameter === 'temperature' ? 'Temperature Forecast' : 
                 selectedParameter === 'humidity' ? 'Humidity Forecast' : 
                 'Wind Speed Forecast'}
              </Typography>
              
              <Box sx={{ height: 400, mt: 3 }}>
                {renderChart()}
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Forecast Insights
                </Typography>
                
                {selectedParameter === 'temperature' && (
                  <Typography variant="body2">
                    {currentConditions.temperature > 85 ? 
                      'High temperatures forecasted. Consider increased irrigation and heat stress monitoring for crops.' :
                     currentConditions.temperature < 50 ?
                      'Cool temperatures forecasted. Monitor for potential frost conditions and protect sensitive crops.' :
                      'Moderate temperatures forecasted. Optimal conditions for most crop development stages.'}
                  </Typography>
                )}
                
                {selectedParameter === 'humidity' && (
                  <Typography variant="body2">
                    {currentConditions.humidity > 80 ? 
                      'High humidity levels may increase disease pressure. Monitor crops for fungal diseases and consider preventative treatments.' :
                     currentConditions.humidity < 40 ?
                      'Low humidity levels may increase water stress. Consider adjusting irrigation schedules.' :
                      'Moderate humidity levels forecasted. Generally favorable conditions for crop development.'}
                  </Typography>
                )}
                
                {selectedParameter === 'windSpeed' && (
                  <Typography variant="body2">
                    {currentConditions.windSpeed > 20 ? 
                      'Strong winds forecasted. Secure equipment and structures. Wind may cause mechanical damage to crops.' :
                     currentConditions.windSpeed > 10 ?
                      'Moderate winds forecasted. May affect spray applications and increase evapotranspiration rates.' :
                      'Light winds forecasted. Favorable conditions for field operations and spray applications.'}
                  </Typography>
                )}
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  The DeepMC model combines data from weather stations, satellite imagery, and topographical information 
                  to provide more accurate local forecasts than traditional weather models.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MicroclimateTab;
