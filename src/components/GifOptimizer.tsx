import React, { useState, useCallback, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, Chip, LinearProgress,
  Container, Grid, Box, Paper, Snackbar, Alert, TextField,
  Tabs, Tab, Switch, FormControlLabel, Slider, IconButton,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Animation as AnimationIcon,
  Layers as LayersIcon,
  Bolt as ZapIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import GIF from 'gif.js';
import { GifReader } from 'omggif';
import { bannerFormats, findBestFormat, BannerFormat } from '../lib/constants';
import AdPlaceholder from './AdPlaceholder';
import { encodeAnimation } from 'wasm-webp';
import gifsicle from '@fe-daily/gifsicle-wasm-browser';

interface GifFrame {
  canvas: HTMLCanvasElement;
  delay: number;
}

interface ProcessedAnimation {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  gifBlob?: Blob;
  webpBlob?: Blob;
  originalSize?: number;
  optimizedSizeGif?: number;
  optimizedSizeWebp?: number;
  selectedFormat: BannerFormat;
  errorMessage?: string;
  outputFilename: string;
}

const GifOptimizer: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [files, setFiles] = useState<ProcessedAnimation[]>([]);
  const [layers, setLayers] = useState<{file: File, id: string}[]>([]);
  const [globalDelay, setGlobalDelay] = useState(500);
  const [loop, setLoop] = useState(true);
  const [targetSizeKb, setTargetSizeKb] = useState(180);
  const [gifQuality, setGifQuality] = useState(10); // gif.js quality (1-20)
  const [webpQuality, setWebpQuality] = useState(75);
  const [selectedFormat, setSelectedFormat] = useState<BannerFormat>(bannerFormats[2]); // Default 728x90

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const addLayers = (newFiles: File[]) => {
    const newLayers = newFiles.map(file => ({ file, id: Math.random().toString(36).substring(2, 11) }));
    setLayers(prev => [...prev, ...newLayers]);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  // Helper to run optimization with Gifsicle
  const optimizeWithGifsicle = async (inputBlob: Blob, targetFormat: BannerFormat): Promise<Blob> => {
    try {
      const inputBuffer = await inputBlob.arrayBuffer();
      const results = await gifsicle.run({
        input: [{
          file: inputBuffer,
          name: 'input.gif'
        }],
        command: [
          `gifsicle --resize ${targetFormat.width}x${targetFormat.height} --optimize=3 --lossy=30 input.gif -o output.gif`
        ],
        workerUrl: '/worker.js'
      });

      if (results && results.length > 0) {
        return results[0] as Blob;
      }
      return inputBlob;
    } catch (err) {
      console.error("Gifsicle optimization failed", err);
      return inputBlob;
    }
  };

  const processExistingGif = async (file: File) => {
    const id = Math.random().toString(36).substring(2, 11);

    const newAnim: ProcessedAnimation = {
      id,
      name: file.name,
      status: 'processing',
      progress: 10,
      originalSize: file.size,
      selectedFormat: bannerFormats[2], // Placeholder
      outputFilename: file.name.replace(/\.[^/.]+$/, "")
    };

    setFiles(prev => [newAnim, ...prev]);

    try {
        // First, detect dimensions to find best format
        const buffer = await file.arrayBuffer();
        const gifReader = new GifReader(new Uint8Array(buffer) as Buffer);
        const format = findBestFormat(gifReader.width, gifReader.height);

        setFiles(prev => prev.map(f => f.id === id ? { ...f, selectedFormat: format, progress: 20 } : f));

        // Use Gifsicle to resize and optimize GIF
        const optimizedGifBlob = await optimizeWithGifsicle(file, format);

        // Extract frames for WebP generation
        const frames: GifFrame[] = [];
        const optBuffer = await optimizedGifBlob.arrayBuffer();
        const optReader = new GifReader(new Uint8Array(optBuffer) as Buffer);

        for (let i = 0; i < optReader.numFrames(); i++) {
          const frameInfo = optReader.frameInfo(i);
          const canvas = document.createElement('canvas');
          canvas.width = optReader.width;
          canvas.height = optReader.height;
          const ctx = canvas.getContext('2d')!;
          const imageData = ctx.createImageData(optReader.width, optReader.height);
          optReader.decodeAndBlitFrameRGBA(i, imageData.data);
          ctx.putImageData(imageData, 0, 0);
          frames.push({ canvas, delay: frameInfo.delay * 10 });
        }

        await renderWebP(id, frames, format, optimizedGifBlob);

    } catch (err) {
      console.error(err);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error', errorMessage: 'Error al procesar el GIF.' } : f));
    }
  };

  const createFromLayers = async () => {
    if (layers.length === 0) return;

    const id = Math.random().toString(36).substring(2, 11);

    const newAnim: ProcessedAnimation = {
      id,
      name: "Nuevo Banner Animado",
      status: 'processing',
      progress: 0,
      selectedFormat: selectedFormat,
      outputFilename: "banner_animado"
    };

    setFiles(prev => [newAnim, ...prev]);

    const frames: GifFrame[] = [];
    for (const layer of layers) {
      const img = new Image();
      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = selectedFormat.width;
          canvas.height = selectedFormat.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, selectedFormat.width, selectedFormat.height);
          frames.push({ canvas, delay: globalDelay });
          resolve();
        };
        img.onerror = reject;
      });
      img.src = URL.createObjectURL(layer.file);
      await promise;
      URL.revokeObjectURL(img.src);
    }

    // Generate GIF using gif.js
    const gifBlob = await new Promise<Blob>((resolve) => {
        const gif = new GIF({
          workers: 2,
          quality: gifQuality,
          width: selectedFormat.width,
          height: selectedFormat.height,
          workerScript: '/gif.worker.js',
          repeat: loop ? 0 : -1
        });

        frames.forEach(frame => {
          gif.addFrame(frame.canvas, { delay: frame.delay });
        });

        gif.on('progress', (p) => {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: Math.round(p * 50) } : f));
        });

        gif.on('finished', (blob) => {
          resolve(blob);
        });

        gif.render();
      });

    await renderWebP(id, frames, selectedFormat, gifBlob);
  };

  const renderWebP = async (id: string, frames: GifFrame[], format: BannerFormat, gifBlob: Blob) => {
    try {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 60 } : f));

      const webpFrames = frames.map(f => {
        const ctx = f.canvas.getContext('2d')!;
        return {
            data: ctx.getImageData(0, 0, format.width, format.height).data,
            duration: f.delay,
            config: {
                lossless: 0,
                quality: webpQuality
            }
        };
      });

      // wasm-webp encodeAnimation takes (width, height, hasAlpha, frames)
      const webpUint8 = await encodeAnimation(format.width, format.height, true, webpFrames as any);
      const webpBlob = webpUint8 ? new Blob([webpUint8], { type: 'image/webp' }) : undefined;

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'completed',
        gifBlob,
        webpBlob,
        optimizedSizeGif: gifBlob.size,
        optimizedSizeWebp: webpBlob?.size,
        selectedFormat: format,
        progress: 100
      } : f));

      const isLarge = gifBlob.size > targetSizeKb * 1024 || (webpBlob && webpBlob.size > targetSizeKb * 1024);
      showToast(isLarge ? 'Advertencia: El tamaño supera los 180KB' : 'Animación optimizada con éxito', isLarge ? 'error' : 'success');

    } catch (err) {
      console.error("WebP generation failed", err);
      // Even if WebP fails, we might still have the GIF
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'completed',
        gifBlob,
        optimizedSizeGif: gifBlob.size,
        selectedFormat: format,
        progress: 100,
        errorMessage: 'WebP no pudo ser generado'
      } : f));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
       <Box sx={{ display: { xs: 'none', xl: 'block' }, position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <AdPlaceholder type="vertical" label="Lateral Izquierdo" />
      </Box>
      <Box sx={{ display: { xs: 'none', xl: 'block' }, position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <AdPlaceholder type="vertical" label="Lateral Derecho" />
      </Box>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Chip icon={<AnimationIcon />} label="GIF & WebP Optimizer" color="primary" sx={{ mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Banners Animados Perfectos
        </Typography>
        <Typography variant="h6" color="text.secondary" component="p" sx={{ maxWidth: 'md', mx: 'auto' }}>
          Optimiza GIFs existentes o crea nuevos banners animados. Genera formatos GIF y WebP optimizados para banners web.
        </Typography>
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab icon={<ZapIcon />} label="Optimizar GIF" />
          <Tab icon={<LayersIcon />} label="Crear desde Capas" />
        </Tabs>
        <Box sx={{ p: 4 }}>
          {tab === 0 ? (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                size="large"
              >
                Subir Archivo GIF
                <input
                  type="file"
                  accept="image/gif"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processExistingGif(file);
                  }}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Sube un GIF para redimensionarlo a formato banner y optimizar su peso usando Gifsicle.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Capas del Banner</Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Añadir Imágenes (Frames)
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        addLayers(files);
                      }}
                    />
                  </Button>
                  <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: 1, p: 1 }}>
                    {layers.length === 0 && <Typography color="text.secondary" align="center">No hay imágenes seleccionadas</Typography>}
                    {layers.map((layer, index) => (
                      <Card key={layer.id} sx={{ mb: 1, display: 'flex', alignItems: 'center', p: 0.5 }}>
                        <Typography variant="body2" sx={{ flex: 1, ml: 1 }}>{index + 1}. {layer.file.name}</Typography>
                        <IconButton size="small" color="error" onClick={() => removeLayer(layer.id)}><DeleteIcon /></IconButton>
                      </Card>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Configuración</Typography>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Formato de Banner</InputLabel>
                    <Select
                      value={selectedFormat.name}
                      label="Formato de Banner"
                      onChange={(e) => {
                        const format = bannerFormats.find(f => f.name === e.target.value);
                        if (format) setSelectedFormat(format);
                      }}
                    >
                      {bannerFormats.map(f => (
                        <MenuItem key={f.name} value={f.name}>{f.name} ({f.width}x{f.height})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Retraso entre cuadros (ms)"
                    type="number"
                    fullWidth
                    size="small"
                    value={globalDelay}
                    onChange={(e) => setGlobalDelay(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch checked={loop} onChange={(e) => setLoop(e.target.checked)} />}
                    label="Repetir infinitamente"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={createFromLayers}
                    disabled={layers.length < 2}
                  >
                    Generar Banner Animado
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon color="primary" /> Ajustes de Calidad y Peso
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Meta de tamaño máximo: {targetSizeKb} KB</Typography>
            <Slider
              value={targetSizeKb}
              min={50}
              max={500}
              step={10}
              onChange={(e, v) => setTargetSizeKb(v as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Calidad GIF (1=Max, 20=Min): {gifQuality}</Typography>
            <Slider
              value={gifQuality}
              min={1}
              max={20}
              step={1}
              onChange={(e, v) => setGifQuality(v as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Calidad WebP (0-100): {webpQuality}</Typography>
            <Slider
              value={webpQuality}
              min={0}
              max={100}
              step={5}
              onChange={(e, v) => setWebpQuality(v as number)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Archivos Procesados</Typography>
          <Grid container spacing={2}>
            {files.map(file => (
              <Grid item xs={12} key={file.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{file.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Formato: <Chip label={`${file.selectedFormat.width}x${file.selectedFormat.height}`} size="small" variant="outlined" />
                          {file.originalSize && ` | Original: ${(file.originalSize / 1024).toFixed(1)} KB`}
                        </Typography>
                      </Box>
                      <Chip
                        label={file.status === 'completed' ? 'Listo' : file.status === 'processing' ? 'Procesando' : 'Error'}
                        color={file.status === 'completed' ? 'success' : file.status === 'error' ? 'error' : 'primary'}
                      />
                    </Box>

                    {file.status === 'processing' && (
                      <Box>
                        <LinearProgress variant="determinate" value={file.progress} />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Progreso estimado: {file.progress}%</Typography>
                      </Box>
                    )}

                    {file.status === 'completed' && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                             <Typography variant="subtitle2">GIF Animado</Typography>
                             <Typography variant="h6" color={file.optimizedSizeGif && file.optimizedSizeGif > targetSizeKb * 1024 ? 'error' : 'primary'}>
                               {(file.optimizedSizeGif! / 1024).toFixed(1)} KB
                             </Typography>
                             <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                sx={{ mt: 1 }}
                                onClick={() => {
                                    const url = URL.createObjectURL(file.gifBlob!);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${file.outputFilename}.gif`;
                                    a.click();
                                }}
                             >
                                Descargar GIF
                             </Button>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                             <Typography variant="subtitle2">WebP Animado</Typography>
                             <Typography variant="h6" color={file.optimizedSizeWebp && file.optimizedSizeWebp > targetSizeKb * 1024 ? 'error' : 'primary'}>
                               {file.optimizedSizeWebp ? `${(file.optimizedSizeWebp / 1024).toFixed(1)} KB` : 'No disponible'}
                             </Typography>
                             {file.webpBlob ? (
                               <Button
                                  fullWidth
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<DownloadIcon />}
                                  sx={{ mt: 1 }}
                                  onClick={() => {
                                      const url = URL.createObjectURL(file.webpBlob!);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${file.outputFilename}.webp`;
                                      a.click();
                                  }}
                               >
                                  Descargar WebP
                               </Button>
                             ) : (
                               <Typography variant="caption" color="error">{file.errorMessage || 'Error en WebP'}</Typography>
                             )}
                          </Paper>
                        </Grid>
                      </Grid>
                    )}
                    {file.status === 'error' && <Alert severity="error">{file.errorMessage}</Alert>}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 8 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default GifOptimizer;
