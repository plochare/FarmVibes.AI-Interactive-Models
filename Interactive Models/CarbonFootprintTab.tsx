import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Switch, FormControlLabel } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Co2Icon from '@mui/icons-material/Co2';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

// Mock data for carbon footprint calculations
const generateCarbonData = (farmingPractice: string, cropType: string, acreage: number) => {
  // Base emission factors (tons CO2e per acre)
  const baseEmissions = {
    conventional: {
      corn: 2.5,
      wheat: 1.8,
      soybeans: 1.2,
      rice: 3.2
    },
    conservation: {
      corn: 1.8,
      wheat: 1.3,
      soybeans: 0.9,
      rice: 2.4
    },
    organic: {
      corn: 1.2,
      wheat: 0.9,
      soybeans: 0.6,
      rice: 1.8
    }
  };
  
  // Emission sources breakdown (percentages)
  const emissionSources = [
    { name: 'Fertilizer', value: 40 },
    { name: 'Fuel', value: 25 },
    { name: 'Machinery', value: 15 },
    { name: 'Irrigation', value: 12 },
    { name: 'Other', value: 8 }
  ];
  
  // Calculate total emissions
  const emissionFactor = baseEmissions[farmingPractice as keyof typeof baseEmissions][cropType as keyof typeof baseEmissions.conventional];
  const totalEmissions = emissionFactor * acreage;
  
  // Calculate emissions by source
  const emissionsBySource = emissionSources.map(source => ({
    ...source,
    emissions: (source.value / 100) * totalEmissions
  }));
  
  // Generate monthly data for seasonal variations
  const monthlyData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Different crops have different seasonal emission patterns
  let seasonalPattern;
  switch (cropType) {
    case 'corn':
      seasonalPattern = [0.2, 0.3, 0.6, 1.0, 1.5, 1.2, 0.8, 0.6, 0.4, 0.3, 0.2, 0.2];
      break;
    case 'wheat':
      seasonalPattern = [0.3, 0.4, 0.8, 1.2, 1.0, 0.7, 0.5, 0.4, 0.6, 0.8, 0.4, 0.3];
      break;
    case 'soybeans':
      seasonalPattern = [0.2, 0.2, 0.4, 0.8, 1.0, 1.2, 0.9, 0.7, 0.5, 0.3, 0.2, 0.2];
      break;
    case 'rice':
      seasonalPattern = [0.2, 0.3, 0.5, 0.9, 1.4, 1.6, 1.5, 1.2, 0.8, 0.5, 0.3, 0.2];
      break;
    default:
      seasonalPattern = [0.3, 0.3, 0.5, 0.8, 1.0, 1.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
  }
  
  // Scale the pattern to match total emissions
  const totalPattern = seasonalPattern.reduce((a, b) => a + b, 0);
  const scaleFactor = totalEmissions / totalPattern;
  
  for (let i = 0; i < 12; i++) {
    monthlyData.push({
      month: months[i],
      emissions: seasonalPattern[i] * scaleFactor
    });
  }
  
  // Calculate carbon sequestration potential
  let sequestrationRate;
  switch (farmingPractice) {
    case 'conventional':
      sequestrationRate = 0.1; // tons CO2e per acre
      break;
    case 'conservation':
      sequestrationRate = 0.4;
      break;
    case 'organic':
      sequestrationRate = 0.6;
      break;
    default:
      sequestrationRate = 0.2;
  }
  
  const totalSequestration = sequestrationRate * acreage;
  const netEmissions = totalEmissions - totalSequestration;
  
  return {
    totalEmissions,
    totalSequestration,
    netEmissions,
    emissionsBySource,
    monthlyData
  };
};

// Farming practice options
const farmingPractices = [
  { id: 'conventional', name: 'Conventional Farming' },
  { id: 'conservation', name: 'Conservation Agriculture' },
  { id: 'organic', name: 'Organic Farming' },
];

// Crop type options
const cropTypes = [
  { id: 'corn', name: 'Corn' },
  { id: 'wheat', name: 'Wheat' },
  { id: 'soybeans', name: 'Soybeans' },
  { id: 'rice', name: 'Rice' },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CarbonFootprintTab: React.FC = () => {
  const [farmingPractice, setFarmingPractice] = useState('conventional');
  const [cropType, setCropType] = useState('corn');
  const [acreage, setAcreage] = useState(100);
  const [showComparison, setShowComparison] = useState(false);
  
  const handleFarmingPracticeChange = (event: SelectChangeEvent) => {
    setFarmingPractice(event.target.value);
  };
  
  const handleCropTypeChange = (event: SelectChangeEvent) => {
    setCropType(event.target.value);
  };
  
  const handleAcreageChange = (_: Event, newValue: number | number[]) => {
    setAcreage(newValue as number);
  };
  
  const carbonData = generateCarbonData(farmingPractice, cropType, acreage);
  
  // Generate comparison data for all farming practices
  const comparisonData = farmingPractices.map(practice => ({
    name: practice.name,
    emissions: generateCarbonData(practice.id, cropType, acreage).netEmissions
  }));
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2"><strong>{label}</strong></Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value.toFixed(2)} tons CO₂e
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
        Carbon Footprint Estimation
      </Typography>
      
      <Typography variant="body1" paragraph>
        This interactive example demonstrates how FarmVibes.AI estimates greenhouse gas emissions and carbon 
        sequestration potential for different farming practices. By understanding their carbon footprint, 
        farmers can implement practices that reduce emissions and increase carbon sequestration.
      </Typography>
      
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Controls section */}
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
                  <InputLabel id="farming-practice-label">Farming Practice</InputLabel>
                  <Select
                    labelId="farming-practice-label"
                    id="farming-practice"
                    value={farmingPractice}
                    label="Farming Practice"
                    onChange={handleFarmingPracticeChange}
                  >
                    {farmingPractices.map((practice) => (
                      <MenuItem key={practice.id} value={practice.id}>{practice.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="crop-type-label">Crop Type</InputLabel>
                  <Select
                    labelId="crop-type-label"
                    id="crop-type"
                    value={cropType}
                    label="Crop Type"
                    onChange={handleCropTypeChange}
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop.id} value={crop.id}>{crop.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <Typography id="acreage-slider-label" gutterBottom>
                  Farm Size (acres): {acreage}
                </Typography>
                <Slider
                  value={acreage}
                  onChange={handleAcreageChange}
                  aria-labelledby="acreage-slider-label"
                  min={10}
                  max={1000}
                  step={10}
                  marks={[
                    { value: 10, label: '10' },
                    { value: 500, label: '500' },
                    { value: 1000, label: '1000' }
                  ]}
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showComparison}
                    onChange={(e) => setShowComparison(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Comparison"
              />
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
            {/* Results panel */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Carbon Analysis
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Co2Icon sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Emissions</Typography>
                    <Typography variant="h5">{carbonData.totalEmissions.toFixed(1)} tons CO₂e</Typography>
                    <Typography variant="caption">
                      {(carbonData.totalEmissions / acreage).toFixed(2)} tons CO₂e per acre
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AgricultureIcon sx={{ fontSize: 40, color: '#2E7D32', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Carbon Sequestration</Typography>
                    <Typography variant="h5">{carbonData.totalSequestration.toFixed(1)} tons CO₂e</Typography>
                    <Typography variant="caption">
                      {(carbonData.totalSequestration / acreage).toFixed(2)} tons CO₂e per acre
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <LocalGasStationIcon sx={{ fontSize: 40, color: '#1565C0', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Net Carbon Footprint</Typography>
                    <Typography variant="h5">{carbonData.netEmissions.toFixed(1)} tons CO₂e</Typography>
                    <Typography variant="caption">
                      {(carbonData.netEmissions / acreage).toFixed(2)} tons CO₂e per acre
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 200, mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Emissions by Source
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carbonData.emissionsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="emissions"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {carbonData.emissionsBySource.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => value.toFixed(2) + ' tons CO₂e'} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
            
            {/* Charts */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {showComparison ? 'Practice Comparison' : 'Seasonal Emissions'}
              </Typography>
              
              <Box sx={{ height: 400, mt: 3 }}>
                {showComparison ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Net Emissions (tons CO₂e)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="emissions" fill="#1565C0" name="Net Emissions" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={carbonData.monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Emissions (tons CO₂e)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="emissions" 
                        stroke="#d32f2f" 
                        strokeWidth={2}
                        name="Monthly Emissions"
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Carbon Reduction Potential
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)'
                  },
                  gap: 3
                }}>
                  <Box>
                    <Typography variant="body2" paragraph>
                      {farmingPractice === 'conventional' ? (
                        <>
                          <strong>Conventional farming</strong> typically has the highest carbon footprint. 
                          Switching to conservation or organic practices could reduce emissions by up to 
                          {' '}{((1 - (comparisonData[1].emissions / comparisonData[0].emissions)) * 100).toFixed(0)}% 
                          or {((1 - (comparisonData[2].emissions / comparisonData[0].emissions)) * 100).toFixed(0)}% respectively.
                        </>
                      ) : farmingPractice === 'conservation' ? (
                        <>
                          <strong>Conservation agriculture</strong> reduces emissions through reduced tillage, 
                          cover crops, and improved nutrient management. Your current practice saves approximately 
                          {' '}{(comparisonData[0].emissions - comparisonData[1].emissions).toFixed(1)} tons CO₂e 
                          compared to conventional farming.
                        </>
                      ) : (
                        <>
                          <strong>Organic farming</strong> typically has the lowest carbon footprint due to 
                          avoiding synthetic fertilizers and pesticides. Your current practice saves approximately 
                          {' '}{(comparisonData[0].emissions - comparisonData[2].emissions).toFixed(1)} tons CO₂e 
                          compared to conventional farming.
                        </>
                      )}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" paragraph>
                      The FarmVibes.AI carbon estimation model combines satellite imagery, weather data, and 
                      farming practice information to estimate greenhouse gas emissions and carbon sequestration. 
                      This helps farmers identify practices that can reduce their carbon footprint while 
                      maintaining or improving productivity.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CarbonFootprintTab;
