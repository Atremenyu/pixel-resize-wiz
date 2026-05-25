import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>Política de Privacidad</Typography>
        <Typography variant="body1" paragraph>
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>1. Introducción</Typography>
        <Typography variant="body1" paragraph>
          En Banner Optimizer, respetamos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad.
        </Typography>

        <Typography variant="h5" gutterBottom>2. Los datos que recopilamos</Typography>
        <Typography variant="body1" paragraph>
          <strong>Imágenes:</strong> Banner Optimizer es una herramienta de procesamiento en el lado del cliente. Esto significa que las imágenes que sube para optimizar <strong>no se envían a nuestros servidores</strong>. Todo el procesamiento ocurre localmente en su navegador.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Cookies y Tecnologías de Seguimiento:</strong> Utilizamos Google AdSense para mostrar anuncios. Google puede utilizar cookies para publicar anuncios basados en las visitas anteriores de un usuario a nuestro sitio web u otros sitios web.
        </Typography>

        <Typography variant="h5" gutterBottom>3. Google AdSense y la Cookie de DoubleClick</Typography>
        <Typography variant="body1" paragraph>
          Google, como proveedor externo, utiliza cookies para publicar anuncios en nuestro sitio. El uso de la cookie de DoubleClick permite a Google y a sus socios publicar anuncios basados en las visitas de los usuarios a nuestro sitio y/u otros sitios en Internet.
        </Typography>
        <Typography variant="body1" paragraph>
          Los usuarios pueden inhabilitar el uso de la cookie de DoubleClick para la publicidad basada en intereses visitando <a href="https://www.google.com/ads/preferences/" target="_blank" rel="noopener noreferrer">Configuración de anuncios de Google</a>.
        </Typography>

        <Typography variant="h5" gutterBottom>4. Seguridad de los datos</Typography>
        <Typography variant="body1" paragraph>
          Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan, utilicen o accedan accidentalmente de forma no autorizada.
        </Typography>

        <Typography variant="h5" gutterBottom>5. Sus derechos legales</Typography>
        <Typography variant="body1" paragraph>
          Usted tiene derechos bajo las leyes de protección de datos en relación con sus datos personales, incluyendo el derecho a solicitar el acceso, la corrección, la eliminación o la transferencia de sus datos personales.
        </Typography>

        <Typography variant="h5" gutterBottom>6. Contacto</Typography>
        <Typography variant="body1" paragraph>
          Si tiene alguna pregunta sobre esta política de privacidad, puede contactarnos en: <strong>atreart@outlook.com</strong>
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
