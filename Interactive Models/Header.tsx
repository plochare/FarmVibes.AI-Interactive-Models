import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#2E7D32' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AgricultureIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FarmVibes.AI Interactive Models
          </Typography>

          <AgricultureIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            FarmVibes.AI
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              href="https://github.com/microsoft/farmvibes-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </Button>
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              href="https://microsoft.github.io/farmvibes-ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resources
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Typography variant="caption" sx={{ color: 'white', display: { xs: 'none', md: 'block' } }}>
              Powered by Farmvibes.AI 
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
