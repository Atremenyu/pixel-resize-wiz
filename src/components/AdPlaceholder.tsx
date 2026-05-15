import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

interface AdPlaceholderProps {
  type: 'vertical' | 'horizontal';
  label: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, label }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = {
    vertical: {
      width: '160px',
      height: '600px',
      display: isMobile ? 'none' : 'flex',
    },
    horizontal: {
      width: '100%',
      maxWidth: '728px',
      height: '90px',
      display: 'flex',
      margin: '20px auto',
    },
  };

  return (
    <Box
      sx={{
        ...styles[type],
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        border: '1px dashed #ccc',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '"ANUNCIO"',
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: 'text.secondary',
          opacity: 0.5,
        }
      }}
    >
      {/*
          ZONA PARA CÓDIGO DE ADSENSE - {label}
          Pega aquí el código <ins> de tu anuncio de Google AdSense.
          Recuerda también incluir el script de AdSense en index.html si no lo has hecho.
      */}
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', p: 1 }}>
        Espacio para anuncio {type === 'vertical' ? '160x600' : 'Horizontal'}
        <br />
        ({label})
      </Typography>

      {/*
          Ejemplo de integración (Descomenta y adapta cuando tengas tu código):

          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format={type === 'vertical' ? 'vertical' : 'horizontal'}
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
      */}
    </Box>
  );
};

export default AdPlaceholder;
