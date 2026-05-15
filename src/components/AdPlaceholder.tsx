import React, { useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdPlaceholderProps {
  type: 'vertical' | 'horizontal';
  label: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, label }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const styles = {
    vertical: {
      width: '180px',
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
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client="ca-pub-8438097053505351"
           data-ad-slot={type === 'vertical' ? "7635642545" : "7635642545"} // Usando el slot proveido por el usuario
           data-ad-format={type === 'vertical' ? undefined : 'auto'}
           data-full-width-responsive={type === 'vertical' ? "false" : "true"}></ins>

      {!window.adsbygoogle && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', p: 1, position: 'absolute' }}>
          Anuncio {label}
        </Typography>
      )}
    </Box>
  );
};

export default AdPlaceholder;
