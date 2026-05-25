import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

const Contact = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>Contacto</Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          ¿Tienes alguna duda, sugerencia o problema técnico?
        </Typography>
        <Typography variant="body1" paragraph>
          Estamos aquí para ayudarte. Puedes ponerte en contacto con nosotros directamente a través de nuestro correo electrónico.
        </Typography>

        <Box sx={{ my: 6 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            href="mailto:atreart@outlook.com"
            sx={{ py: 2, px: 4, borderRadius: 2 }}
          >
            atreart@outlook.com
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Prometemos responderte lo antes posible. ¡Gracias por usar Banner Optimizer!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Contact;
