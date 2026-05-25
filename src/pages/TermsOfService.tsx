import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>Términos de Servicio</Typography>
        <Typography variant="body1" paragraph>
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>1. Aceptación de los Términos</Typography>
        <Typography variant="body1" paragraph>
          Al acceder y utilizar Banner Optimizer, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra herramienta.
        </Typography>

        <Typography variant="h5" gutterBottom>2. Uso de la Herramienta</Typography>
        <Typography variant="body1" paragraph>
          Banner Optimizer proporciona un servicio de optimización de imágenes basado en el navegador. Usted es el único responsable de las imágenes que procesa utilizando nuestra herramienta.
        </Typography>
        <Typography variant="body1" paragraph>
          Usted se compromete a no utilizar la herramienta para procesar contenido ilegal, ofensivo o que infrinja los derechos de autor de terceros.
        </Typography>

        <Typography variant="h5" gutterBottom>3. Propiedad Intelectual</Typography>
        <Typography variant="body1" paragraph>
          El diseño, el código y el contenido original de Banner Optimizer son propiedad nuestra. Usted conserva todos los derechos sobre las imágenes que sube y procesa.
        </Typography>

        <Typography variant="h5" gutterBottom>4. Limitación de Responsabilidad</Typography>
        <Typography variant="body1" paragraph>
          Banner Optimizer se proporciona "tal cual", sin garantías de ningún tipo. No seremos responsables de ninguna pérdida de datos o daños resultantes del uso de nuestra herramienta. El procesamiento ocurre localmente en su dispositivo.
        </Typography>

        <Typography variant="h5" gutterBottom>5. Cambios en los Términos</Typography>
        <Typography variant="body1" paragraph>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio tras la publicación de cambios constituirá su aceptación de dichos cambios.
        </Typography>

        <Typography variant="h5" gutterBottom>6. Ley Aplicable</Typography>
        <Typography variant="body1" paragraph>
          Estos términos se rigen e interpretan de acuerdo con las leyes vigentes en México, y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en dicha ubicación.
        </Typography>

        <Typography variant="h5" gutterBottom>7. Contacto</Typography>
        <Typography variant="body1" paragraph>
          Para cualquier duda sobre estos Términos, por favor contáctenos en: <strong>atreart@outlook.com</strong>
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
