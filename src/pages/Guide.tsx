import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid, Card, CardContent } from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Straighten as StraightenIcon,
  CloudDone as CloudDoneIcon
} from '@mui/icons-material';

const Guide = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">Guía de Optimización de Banners</Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph>
          Aprende a crear y optimizar banners perfectos para tu sitio web.
        </Typography>

        <Divider sx={{ my: 6 }} />

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>¿Por qué optimizar tus banners?</Typography>
          <Typography variant="body1" paragraph>
            La optimización de imágenes es un proceso crítico para cualquier sitio web moderno. No se trata solo de hacer que las imágenes se vean bien, sino de asegurar que tu sitio funcione de manera eficiente y sea amigable tanto para los usuarios como para los motores de búsqueda.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Velocidad de Carga</Typography>
                  </Box>
                  <Typography variant="body2">
                    Las imágenes pesadas ralentizan tu sitio. Un banner optimizado carga instantáneamente, mejorando la experiencia del usuario y reduciendo la tasa de rebote.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LightbulbIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">SEO (Core Web Vitals)</Typography>
                  </Box>
                  <Typography variant="body2">
                    Google premia los sitios rápidos. Imágenes optimizadas ayudan a mejorar tus métricas de LCP (Largest Contentful Paint), elevando tu posición en los resultados de búsqueda.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>Formatos Estándar que Soportamos</Typography>
          <Typography variant="body1" paragraph>
            Nuestra herramienta ajusta tus imágenes automáticamente a los formatos más efectivos utilizados en la publicidad digital y diseño web:
          </Typography>
          <ul>
            <li><Typography variant="body1"><strong>728x90 (Leaderboard):</strong> Ideal para la parte superior de las páginas.</Typography></li>
            <li><Typography variant="body1"><strong>600x500 (Rectángulo Grande):</strong> Perfecto para insertar dentro del contenido de un artículo.</Typography></li>
            <li><Typography variant="body1"><strong>1100x361 (Header Hero):</strong> Diseñado para cabeceras impactantes que ocupan el ancho total.</Typography></li>
            <li><Typography variant="body1"><strong>640x200 (Banner Horizontal):</strong> Un formato versátil para promociones intermedias.</Typography></li>
          </ul>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>Cómo usar Banner Optimizer</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { step: "1", title: "Sube tu Imagen", desc: "Arrastra tus archivos al área de carga o selecciónalos desde tu computadora. Soportamos PNG, JPG, WebP y más." },
              { step: "2", title: "Detección Automática", desc: "Nuestro algoritmo analiza la relación de aspecto de tu imagen y selecciona el formato de banner que mejor se adapta." },
              { step: "3", title: "Optimización Local", desc: "La imagen se procesa directamente en tu navegador. Tus archivos nunca salen de tu dispositivo, garantizando máxima privacidad." },
              { step: "4", title: "Descarga", desc: "Obtén tu imagen optimizada individualmente o descarga todas en un conveniente archivo ZIP." }
            ].map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{
                    minWidth: 32, height: 32, borderRadius: '50%',
                    bgcolor: 'primary.main', color: 'primary.contrastText',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.step}
                  </Box>
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 6, p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CloudDoneIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h5">Consejo Pro: El formato WebP</Typography>
          </Box>
          <Typography variant="body1">
            Si tu navegador lo soporta, te recomendamos usar el formato WebP. Ofrece una compresión superior a la de JPEG y PNG, manteniendo una calidad visual excelente con un peso hasta un 30% menor.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          ¿Tienes más preguntas? No dudes en visitar nuestra sección de contacto.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Guide;
