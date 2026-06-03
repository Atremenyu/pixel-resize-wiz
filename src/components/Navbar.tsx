import React from 'react';
import { AppBar, Toolbar, Button, Container, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Image as ImageIcon, Animation as AnimationIcon } from '@mui/icons-material';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<ImageIcon />}
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              variant={location.pathname === '/' ? 'outlined' : 'text'}
            >
              Imágenes
            </Button>
            <Button
              component={Link}
              to="/gif-optimizer"
              startIcon={<AnimationIcon />}
              color={location.pathname === '/gif-optimizer' ? 'primary' : 'inherit'}
              variant={location.pathname === '/gif-optimizer' ? 'outlined' : 'text'}
            >
              GIF / Animados
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
