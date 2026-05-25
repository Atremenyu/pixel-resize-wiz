import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Banner Optimizer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Herramienta profesional para la optimización y redimensionamiento de banners web de forma rápida, segura y gratuita. Todo el proceso ocurre en tu navegador.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Herramienta
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link component={RouterLink} to="/" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/guia" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Guía de Uso
                </Link>
              </li>
            </Box>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link component={RouterLink} to="/privacidad" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/terminos" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Términos
                </Link>
              </li>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              atreart@outlook.com
            </Typography>
            <Link component={RouterLink} to="/contacto" color="primary" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Enviar un mensaje
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Banner Optimizer
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
