# FarmVibes.AI Micro-Climate Forecast Website Design

## Overview
This document outlines the design for a static website client that allows users to input US zip codes and view micro-climate forecasts based on the FarmVibes.AI DeepMC model.

## User Interface Design

### Layout Structure
The website will follow a clean, responsive design with the following main sections:

1. **Header Section**
   - Website title and logo
   - Brief description of the service
   - Navigation menu (if needed for future expansion)

2. **Input Section**
   - Zip code input field with validation
   - Search/Generate button
   - Optional: Recent searches list

3. **Results Dashboard**
   - Location information (city, state derived from zip code)
   - Date and time information
   - Summary of current conditions
   - Tabs or sections for different forecast timeframes (Today, Tomorrow, Week)

4. **Visualization Section**
   - Individual charts for each weather metric:
     - Temperature chart (daily high/low)
     - Precipitation chart (daily amount)
     - Humidity chart (daily average)
     - Wind speed chart (daily average)
   - Interactive elements (hover for details, zoom options)

5. **Information Section**
   - Explanation of data sources
   - Brief description of the DeepMC model
   - Disclaimer about forecast accuracy
   - Attribution to FarmVibes.AI and Microsoft

6. **Footer Section**
   - Credits and attributions
   - Links to FarmVibes.AI and related resources
   - Copyright information

### Color Scheme and Visual Design

The design will use a nature-inspired color palette:
- Primary: #2E7D32 (forest green) - representing agriculture/sustainability
- Secondary: #1565C0 (deep blue) - representing weather/climate
- Accent: #FF8F00 (amber) - for highlights and calls-to-action
- Background: #F5F7FA (light gray-blue) - clean, professional look
- Text: #212121 (near black) - for readability

Visual elements will include:
- Weather icons for different conditions
- Subtle agricultural/farm imagery in the background
- Clean, minimalist charts with consistent styling
- Responsive design elements that work on mobile and desktop

## Component Design

### Zip Code Input Component
- Text input field with validation for US zip code format
- Auto-suggestion for recently used zip codes
- Clear button to reset input
- Submit button with loading state indicator

### Weather Dashboard Component
- Location header with city/state name
- Current date and last updated timestamp
- Summary card with current conditions
- Navigation between different timeframes

### Chart Components
Each weather metric will have a dedicated visualization component:

1. **Temperature Chart**
   - Line chart showing daily high and low temperatures
   - Y-axis in degrees Fahrenheit/Celsius (toggleable)
   - X-axis showing dates
   - Color gradient indicating temperature ranges

2. **Precipitation Chart**
   - Bar chart showing daily precipitation amounts
   - Y-axis in inches/millimeters (toggleable)
   - X-axis showing dates
   - Color intensity indicating precipitation amount

3. **Humidity Chart**
   - Line chart showing daily average humidity
   - Y-axis in percentage
   - X-axis showing dates
   - Color gradient indicating humidity ranges

4. **Wind Speed Chart**
   - Bar or line chart showing daily average wind speed
   - Y-axis in mph/kph (toggleable)
   - X-axis showing dates
   - Optional wind direction indicators

### Data Loading and Error States
- Initial loading state with animated placeholder
- Error state with user-friendly messages
- Empty state for no data available
- Retry mechanism for failed data fetches

## Data Flow

1. User enters zip code and submits
2. Application validates zip code format
3. Application converts zip code to coordinates
4. Application fetches weather data based on coordinates
   - Option 1: From bundled pre-computed dataset
   - Option 2: From external weather API
5. Application processes and formats data for visualization
6. Charts and dashboard update with new data
7. Search is saved to recent searches (localStorage)

## Responsive Design Considerations

The website will be fully responsive with the following breakpoints:
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px and above

Responsive adjustments:
- Single column layout on mobile
- Stacked charts on smaller screens
- Collapsible information sections on mobile
- Touch-friendly input elements
- Simplified visualizations on smaller screens

## Technical Components

### React Components Structure
```
App
├── Header
├── ZipCodeSearch
│   ├── SearchInput
│   ├── SearchButton
│   └── RecentSearches
├── WeatherDashboard
│   ├── LocationInfo
│   ├── CurrentConditions
│   └── TimeframeSelector
├── ChartSection
│   ├── TemperatureChart
│   ├── PrecipitationChart
│   ├── HumidityChart
│   └── WindSpeedChart
├── InfoSection
│   ├── AboutData
│   ├── AboutModel
│   └── Disclaimer
└── Footer
```

### Data Models

**Location Data**
```typescript
interface Location {
  zipCode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}
```

**Weather Data**
```typescript
interface WeatherData {
  date: string;
  temperature: {
    high: number;
    low: number;
    average: number;
  };
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection?: string;
}
```

**Forecast Data**
```typescript
interface Forecast {
  location: Location;
  currentConditions: WeatherData;
  dailyForecast: WeatherData[];
  lastUpdated: string;
  source: string;
}
```

## Implementation Priorities

1. Core functionality:
   - Zip code input and validation
   - Data fetching and processing
   - Basic visualization of all required metrics

2. Enhanced visualization:
   - Interactive charts
   - Responsive design
   - Visual polish and animations

3. User experience improvements:
   - Recent searches
   - Unit toggles
   - Loading states and error handling

4. Additional features (if time permits):
   - Comparison between locations
   - Historical data view
   - Data export options

## Next Steps

1. Set up React project structure
2. Implement basic UI components
3. Create data fetching and processing logic
4. Implement visualization components
5. Add responsive design and polish
6. Test with various zip codes and data scenarios
