# FarmVibes.AI and DeepMC Integration Requirements

## Overview
This document outlines the requirements and constraints for integrating FarmVibes.AI and the DeepMC model into a static website client that allows users to input US zip codes and generate micro-climate forecasts.

## DeepMC Model Requirements

### Data Requirements
Based on the DeepMC notebook analysis, the model requires:

1. **Historical Weather Data**:
   - Required features: datetime, humidity, wind speed, temperature
   - For model training: Minimum of 2 years of historical data
   - For inference: 552 data points of historical data

2. **Forecast Data**:
   - Features: humidity_forecast, wind_speed_forecast, temperature_forecast
   - Source: Typically downloaded using the herbie package from numerical weather prediction models

3. **Weather Station Location**:
   - Requires specific latitude/longitude coordinates
   - Example from notebook: Palouse station at (-117.22, 46.93)

### Integration Constraints

1. **Static Website Limitations**:
   - Cannot run backend ML models directly
   - Cannot perform real-time model training
   - Limited to client-side processing

2. **Zip Code to Weather Station Mapping**:
   - Need to convert US zip codes to geographical coordinates
   - Need to map coordinates to nearest weather stations
   - May require pre-computed mapping or API integration

## Proposed Integration Approach

Given the constraints of a static website, we propose the following approach:

1. **Pre-computed Data Approach**:
   - Create a dataset of pre-computed forecasts for major US zip codes
   - Store this data in a JSON format that can be loaded by the client
   - Update periodically with new forecasts (outside the scope of the website)

2. **API Integration Approach**:
   - Use a third-party weather API to fetch current and forecast data
   - Map zip codes to coordinates using a geocoding service
   - Simulate the DeepMC model's output based on the API data

3. **Hybrid Approach**:
   - Use pre-computed baseline data for common scenarios
   - Enhance with real-time data from weather APIs
   - Apply simplified algorithms client-side to adjust forecasts

## Data Sources

1. **Weather Data APIs**:
   - OpenWeatherMap API: Provides current weather and forecasts by coordinates
   - Weather.gov API: US-specific weather data by coordinates
   - Visual Crossing Weather API: Historical and forecast weather data

2. **Geocoding Services**:
   - OpenStreetMap Nominatim: Convert zip codes to coordinates
   - Google Maps Geocoding API: More accurate but requires API key
   - Pre-computed zip code database: Static JSON mapping

## Visualization Requirements

The website will need to visualize:
1. Temperature (daily)
2. Precipitation (daily)
3. Humidity (daily)
4. Wind speed (daily)

Each visualization should include:
- Clear labeling
- Appropriate units
- Daily timeframe representation
- Visual distinction between actual and forecast data

## Technical Implementation Considerations

1. **Data Storage**:
   - Use client-side storage (localStorage) for recent searches
   - Bundle baseline data with the application
   - Cache API responses when possible

2. **Performance Optimization**:
   - Minimize data payload sizes
   - Use efficient data visualization libraries
   - Implement progressive loading for large datasets

3. **Error Handling**:
   - Graceful degradation when APIs are unavailable
   - Clear user feedback for invalid zip codes
   - Fallback to pre-computed data when real-time data is unavailable

## Next Steps

1. Design the website interface with the above constraints in mind
2. Select appropriate data sources and APIs
3. Implement a prototype with sample data
4. Refine the visualization and user experience
5. Test with various US zip codes
