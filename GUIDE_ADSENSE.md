# Guía para agregar anuncios de Google AdSense

Esta guía te ayudará a insertar tus propios códigos de anuncio en los espacios que hemos creado.

## Pasos generales

### 1. Agregar el script principal (Requerido)
Para que cualquier anuncio de Google AdSense funcione, debes tener el script principal en el `<head>` de tu archivo `index.html`.

Abre `index.html` y pega esto dentro de la etiqueta `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```
*(Reemplaza `ca-pub-XXXXXXXXXXXXXXXX` con tu ID de editor de AdSense).*

---

### 2. Insertar los códigos de los anuncios
He creado un componente especial llamado `AdPlaceholder` para facilitar esto. Sigue estos pasos:

1. Abre el archivo `src/components/AdPlaceholder.tsx`.
2. Busca los comentarios que dicen: `ZONA PARA CÓDIGO DE ADSENSE`.
3. Verás una sección de ejemplo comentada. Debes adaptar tu código para que sea compatible con React.

**Ejemplo de cómo debe quedar el código dentro de `AdPlaceholder.tsx`:**

```tsx
const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, label }) => {
  // ... (código existente)

  return (
    <Box sx={{ /* ... */ }}>
      {/* 1. ELIMINA EL TEXTO DE RELLENO ACTUAL (Typography) */}

      {/* 2. PEGA AQUÍ TU CÓDIGO <ins> DE ADSENSE */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format={type === 'vertical' ? 'vertical' : 'horizontal'}
           data-full-width-responsive="true"></ins>

      {/* 3. PEGA EL SCRIPT DE ACTIVACIÓN (IMPORTANTE: Usa useEffect para esto en React) */}
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </Box>
  );
};
```

**Nota sobre React:** Si el código anterior te da errores, te recomiendo usar una librería como `react-adsense` o simplemente asegurarte de que el script de activación `(adsbygoogle = window.adsbygoogle || []).push({});` se ejecute después de que el componente se cargue.

---

## Ubicación de los anuncios

- **Anuncios Laterales:** Aparecerán automáticamente a la izquierda y derecha solo en pantallas muy anchas (más de 1600px). Son fijos mientras haces scroll.
- **Anuncios Horizontales:** Hay uno arriba (debajo del título) y uno abajo de todo. Se ven en todos los dispositivos.

## Cumplimiento de reglas
Asegúrate de no colocar demasiados anuncios que tapen el contenido principal de la herramienta, especialmente en la zona de "Drop your images", para que los usuarios puedan seguir usando el optimizador sin problemas.
