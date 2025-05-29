# FarmVibes.AI Model Sample Notebook Library Research Summary

## Overview
This document summarizes the research findings on the three FarmVibes.AI notebooks that will be featured in our interactive website:
1. Harvest Period Detection
2. Carbon Footprint Estimation (GHG Fluxes)
3. Microclimate Forecasts (DeepMC)

## 1. Harvest Period Detection

### Purpose
This notebook demonstrates how to infer germination and harvest periods based on NDVI (Normalized Difference Vegetation Index) time series data.

### Key Workflow
1. Define a geographical region (field) using WKT format
2. Define a time range covering a complete crop season
3. Fetch Sentinel-2 satellite data for the region and time period
4. Run cloud detection algorithms to obtain cloud-free imagery
5. Compute daily NDVI indexes at 10m resolution
6. Fit a curve to the NDVI time series
7. Estimate germination and harvest periods by analyzing NDVI patterns

### Interactive Elements for Website
- Input field for geographical region selection (simplified to predefined regions)
- Date range selector for crop season analysis
- Interactive NDVI curve visualization with highlighted germination/harvest periods
- Results display showing estimated dates and confidence levels

### Data Requirements
- Pre-computed NDVI data for sample regions
- Sample curve-fitting results
- Visual examples of germination and harvest period detection

## 2. Carbon Footprint Estimation (GHG Fluxes)

### Purpose
This notebook illustrates how to compute greenhouse gas emissions and sequestration for crops in specific locations and time ranges.

### Key Workflow
1. Specify crop type, location, and time period
2. Provide agricultural practice information (tillage, fertilizer use, etc.)
3. Calculate emissions using IPCC methodology for Scope 1, 2, and 3 emissions
4. Generate reports on carbon footprint
5. Create Excel spreadsheet compatible with Microsoft Sustainability Manager

### Interactive Elements for Website
- Crop type selection dropdown
- Location selector (simplified to regions/states)
- Agricultural practices selection (tillage type, fertilizer amount, etc.)
- Interactive charts showing emission sources (mechanical vs. non-mechanical)
- Comparison tool for different agricultural practices
- Results dashboard with total carbon footprint and breakdown by source

### Data Requirements
- Emission factors for different crops and practices
- Sample results for common scenarios
- Visual breakdown of emission sources

## 3. Microclimate Forecasts (DeepMC)

### Purpose
This notebook demonstrates how to train a model to forecast weather parameters such as temperature and wind speed using the DeepMC model.

### Key Workflow
1. Collect historical weather station data (temperature, humidity, wind speed)
2. Prepare data for model training (minimum 2 years for training, 552 data points for inference)
3. Train DeepMC model to predict microclimate parameters
4. Generate forecasts based on current conditions
5. Visualize and evaluate forecast accuracy

### Interactive Elements for Website
- Location selection for microclimate analysis
- Historical weather data visualization
- Interactive forecast charts for temperature and wind speed
- Comparison between predicted and actual weather conditions
- Scenario testing for different weather patterns

### Data Requirements
- Pre-computed weather forecasts for sample locations
- Historical weather data for demonstration
- Visualization of model accuracy metrics

## Technical Constraints for Web Implementation

1. **Backend Processing Limitations**
   - Complex model training cannot be performed in real-time on a static website
   - Need to use pre-computed results or simplified models for demonstrations

2. **Data Size Considerations**
   - Large geospatial datasets cannot be loaded directly in the browser
   - Need to use summarized or sampled data for interactive visualizations

3. **Interactive Visualization Requirements**
   - Need robust charting libraries (Recharts, D3.js) for time series data
   - Map visualization components for geographical data
   - Form components for user inputs and scenario testing

4. **User Experience for Farmers**
   - Simplified terminology and explanations
   - Focus on practical applications and disaster mitigation
   - Clear visualization of results without technical complexity

## Next Steps

1. Design a tabbed interface to navigate between the three notebook examples
2. Create mockups for each interactive component
3. Determine which pre-computed datasets will be needed
4. Implement simplified versions of the notebook workflows for web interaction
5. Ensure the design is sleek, modern, and farmer-friendly
