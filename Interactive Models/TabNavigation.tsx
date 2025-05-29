import React from 'react';
import { Box, Tab, Tabs, Container } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import Co2Icon from '@mui/icons-material/Co2';
import ThermostatIcon from '@mui/icons-material/Thermostat';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notebook-tabpanel-${index}`}
      aria-labelledby={`notebook-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `notebook-tab-${index}`,
    'aria-controls': `notebook-tabpanel-${index}`,
  };
}

interface TabNavigationProps {
  children: React.ReactNode[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ children }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="notebook examples tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.04)',
                },
              },
              '& .Mui-selected': {
                color: '#2E7D32 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2E7D32',
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<GrassIcon />} 
              iconPosition="start" 
              label="Harvest Period Detection" 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<Co2Icon />} 
              iconPosition="start" 
              label="Carbon Footprint" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<ThermostatIcon />} 
              iconPosition="start" 
              label="Microclimate Forecast" 
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>
        
        {children.map((child, index) => (
          <TabPanel key={index} value={value} index={index}>
            {child}
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default TabNavigation;
