import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Button, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GrassIcon from '@mui/icons-material/Grass';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AgricultureIcon from '@mui/icons-material/Agriculture';

// Mock data for NDVI values over time
const generateNDVIData = (fieldType: string, year: number) => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Different crop types have different NDVI patterns
  let basePattern: number[];
  let harvestPeriod: { start: number; end: number };
  
  switch (fieldType) {
    case 'corn':
      basePattern = [0.2, 0.2, 0.3, 0.4, 0.6, 0.8, 0.9, 0.8, 0.7, 0.5, 0.3, 0.2];
      harvestPeriod = { start: 8, end: 9 }; // Sep-Oct
      break;
    case 'wheat':
      basePattern = [0.3, 0.4, 0.5, 0.7, 0.8, 0.7, 0.5, 0.3, 0.2, 0.3, 0.3, 0.3];
      harvestPeriod = { start: 5, end: 6 }; // Jun-Jul
      break;
    case 'soybeans':
      basePattern = [0.2, 0.2, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.7, 0.5, 0.3, 0.2];
      harvestPeriod = { start: 9, end: 10 }; // Oct-Nov
      break;
    default:
      basePattern = [0.3, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7, 0.6, 0.5, 0.4, 0.3, 0.3];
      harvestPeriod = { start: 7, end: 8 }; // Aug-Sep
  }
  
  // Add yearly variation based on the year
  const yearFactor = (year - 2020) * 0.02;
  
  for (let i = 0; i < 12; i++) {
    // Add some randomness to the data
    const randomFactor = (Math.random() - 0.5) * 0.1;
    let ndviValue = basePattern[i] + randomFactor + yearFactor;
    ndviValue = Math.min(1, Math.max(0, ndviValue)); // Clamp between 0 and 1
    
    data.push({
      month: months[i],
      ndvi: ndviValue,
      isHarvestPeriod: i >= harvestPeriod.start && i <= harvestPeriod.end,
    });
  }
  
  return { data, harvestPeriod };
};

// Field options
const fields = [
  { id: 'corn', name: 'Corn Field (Iowa)' },
  { id: 'wheat', name: 'Wheat Field (Kansas)' },
  { id: 'soybeans', name: 'Soybean Field (Illinois)' },
];

// Year options
const years = [2020, 2021, 2022, 2023, 2024, 2025];

const HarvestPeriodTab: React.FC = () => {
  const [selectedField, setSelectedField] = useState('corn');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [customNotes, setCustomNotes] = useState('');
  
  const handleFieldChange = (event: SelectChangeEvent) => {
    setSelectedField(event.target.value);
  };
  
  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(Number(event.target.value));
  };
  
  const { data: ndviData } = generateNDVIData(selectedField, selectedYear);
  
  // Calculate optimal harvest months
  const harvestMonths = ndviData
    .filter(item => item.isHarvestPeriod)
    .map(item => item.month)
    .join('-');
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isHarvestPeriod = payload[0].payload.isHarvestPeriod;
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2"><strong>Month:</strong> {label}</Typography>
          <Typography variant="body2" style={{ color: payload[0].color }}>
            <strong>NDVI:</strong> {payload[0].value.toFixed(2)}
          </Typography>
          {isHarvestPeriod && (
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold', mt: 1 }}>
              Optimal Harvest Period
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
        Harvest Period Detection
      </Typography>
      
      <Typography variant="body1" paragraph>
        This interactive example demonstrates how FarmVibes.AI uses NDVI (Normalized Difference Vegetation Index) 
        data from satellite imagery to detect optimal harvest periods for different crops. By analyzing vegetation 
        health over time, farmers can make more informed decisions about when to harvest.
      </Typography>
      
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Controls section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr'
              },
              gap: 3
            }}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="field-select-label">Field Type</InputLabel>
                  <Select
                    labelId="field-select-label"
                    id="field-select"
                    value={selectedField}
                    label="Field Type"
                    onChange={handleFieldChange}
                  >
                    {fields.map((field) => (
                      <MenuItem key={field.id} value={field.id}>{field.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={selectedYear.toString()}
                    label="Year"
                    onChange={handleYearChange}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            {/* Results panel */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Harvest Analysis
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GrassIcon sx={{ fontSize: 40, color: '#2E7D32', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Field Type</Typography>
                    <Typography variant="h6">
                      {fields.find(f => f.id === selectedField)?.name || selectedField}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarMonthIcon sx={{ fontSize: 40, color: '#1565C0', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Optimal Harvest Period</Typography>
                    <Typography variant="h6">{harvestMonths}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AgricultureIcon sx={{ fontSize: 40, color: '#FF8F00', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Peak NDVI Value</Typography>
                    <Typography variant="h6">
                      {Math.max(...ndviData.map(item => item.ndvi)).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Farmer Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Add your observations about this field..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 1 }}
                    disabled={!customNotes.trim()}
                  >
                    Save Notes
                  </Button>
                </Box>
              </Box>
            </Paper>
            
            {/* NDVI Chart */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                NDVI Trends ({selectedYear})
              </Typography>
              
              <Box sx={{ height: 400, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ndviData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 1]} label={{ value: 'NDVI Value', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ndvi" 
                      stroke="#2E7D32" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    {/* Highlight harvest period */}
                    {ndviData.map((entry, index) => (
                      entry.isHarvestPeriod && (
                        <Line 
                          key={index}
                          type="monotone" 
                          dataKey="ndvi" 
                          stroke="#FF8F00" 
                          strokeWidth={4}
                          dot={{ r: 6, fill: '#FF8F00' }}
                          activeDot={{ r: 10 }}
                          connectNulls
                          data={[
                            { month: entry.month, ndvi: entry.ndvi },
                            ...(ndviData[index + 1]?.isHarvestPeriod ? [] : [{ month: entry.month, ndvi: null }])
                          ]}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Yearly Comparison
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr'
                  },
                  gap: 3
                }}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Peak NDVI by Year
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={years.map(year => ({
                            year,
                            peak: Math.max(...generateNDVIData(selectedField, year).data.map(item => item.ndvi))
                          }))}
                          margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip />
                          <Bar dataKey="peak" fill="#2E7D32" name="Peak NDVI" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Harvest Window Length (Days)
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={years.map(year => ({
                            year,
                            days: (generateNDVIData(selectedField, year).harvestPeriod.end - 
                                  generateNDVIData(selectedField, year).harvestPeriod.start + 1) * 30
                          }))}
                          margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="days" fill="#1565C0" name="Harvest Window (Days)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mt: 3 }}>
                  The FarmVibes.AI harvest detection algorithm analyzes NDVI patterns to identify the optimal 
                  harvest window when crop maturity is at its peak. This helps farmers maximize yield quality 
                  and minimize losses from harvesting too early or too late.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HarvestPeriodTab;
