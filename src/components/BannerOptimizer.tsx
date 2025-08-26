import React, { useState, useCallback } from 'react';
import {
  Button, Card, CardContent, CardHeader, Typography, Chip, LinearProgress, Slider,
  Container, Grid, Box, Paper, Snackbar, Alert, CircularProgress, TextField
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Image as ImageIcon,
  Bolt as ZapIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import JSZip from 'jszip';

const getFileExtension = (mimeType: string) => {
  switch (mimeType) {
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/jpeg':
    default: return 'jpeg';
  }
};

interface BannerFormat {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  useCase: string;
}

interface ProcessedFile {
  id: string;
  originalFile: File;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  optimizedBlob?: Blob;
  originalSize: number;
  optimizedSize?: number;
  selectedFormat?: BannerFormat;
  errorMessage?: string;
  outputFilename: string;
}

const bannerFormats: BannerFormat[] = [
    { name: 'Banner 600x500', width: 600, height: 500, aspectRatio: 1.2, useCase: 'Standard Square Banner' },
    { name: 'Banner 640x200', width: 640, height: 200, aspectRatio: 3.2, useCase: 'Horizontal Rectangular Banner' },
    { name: 'Banner 728x90', width: 728, height: 90, aspectRatio: 8.09, useCase: 'Leaderboard Horizontal Banner' },
    { name: 'Banner 420x200', width: 420, height: 200, aspectRatio: 2.1, useCase: 'Medium Horizontal Banner' },
    { name: 'Banner 1100x361', width: 1100, height: 361, aspectRatio: 3.05, useCase: 'Large Header Banner' },
    { name: 'Banner 630x250', width: 630, height: 250, aspectRatio: 2.52, useCase: 'Wide Content Banner' }
];

const DropZone: React.FC<{
  onFilesSelected: (files: File[]) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  showToast: (message: string, severity: 'success' | 'error') => void;
}> = ({ onFilesSelected, isDragOver, setIsDragOver, showToast }) => {

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image file`, 'error');
        return false;
      }
      return true;
    });
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, setIsDragOver, showToast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <Paper
      variant="outlined"
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      sx={{
        p: 4,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragOver ? 'primary.main' : 'divider',
        backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
        transition: 'all 0.3s ease',
        transform: isDragOver ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <UploadFileIcon sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
      <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
        Drop your images here
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Drag and drop your images or click to browse. We'll automatically optimize them for banner formats.
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<ImageIcon />}
      >
        Choose Files
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleFileInput}
        />
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Supported formats: PNG, JPG, GIF, WebP, BMP
      </Typography>
    </Paper>
  );
};

const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
        case 'queued':
            return <ImageIcon />;
        case 'processing':
            return <CircularProgress size={24} color="inherit" />;
        case 'completed':
            return <CheckCircleIcon />;
        case 'error':
            return <ErrorIcon />;
    }
};

const getStatusColor = (status: ProcessedFile['status']) => {
    switch (status) {
        case 'queued':
            return 'grey.500';
        case 'processing':
            return 'primary.main';
        case 'completed':
            return 'success.main';
        case 'error':
            return 'error.main';
    }
};

const FileProcessor: React.FC<{
  file: ProcessedFile;
  onOutputFilenameChange: (fileId: string, newFilename: string) => void;
}> = ({ file, onOutputFilenameChange }) => {
  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText',
            bgcolor: getStatusColor(file.status)
          }}>
            {getStatusIcon(file.status)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap>{file.originalFile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatSize(file.originalSize)}
              {file.optimizedSize && ` → ${formatSize(file.optimizedSize)}`}
            </Typography>
          </Box>
          {file.selectedFormat && (
            <Chip label={file.selectedFormat.name} size="small" />
          )}
        </Box>

        {file.status === 'queued' && (
          <Box>
            <TextField
              fullWidth
              label="Output Filename"
              value={file.outputFilename}
              onChange={(e) => onOutputFilenameChange(file.id, e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Ready to be optimized.
            </Typography>
          </Box>
        )}
        
        {file.status === 'processing' && (
          <Box>
            <LinearProgress variant="determinate" value={file.progress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Processing... {file.progress}%</Typography>
          </Box>
        )}
        
        {file.status === 'error' && (
          <Alert severity="error">{file.errorMessage}</Alert>
        )}
        
        {file.status === 'completed' && file.optimizedBlob && (
          <Box>
            <Alert severity="success" icon={<ZapIcon />}>Optimized successfully</Alert>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                const url = URL.createObjectURL(file.optimizedBlob!);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.outputFilename.toLowerCase();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download Optimized
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const findBestFormat = (width: number, height: number): BannerFormat => {
  const aspectRatio = width / height;
  return bannerFormats.reduce((best, format) => {
    const currentDiff = Math.abs(aspectRatio - format.aspectRatio);
    const bestDiff = Math.abs(aspectRatio - best.aspectRatio);
    return currentDiff < bestDiff ? format : best;
  });
};

const BannerOptimizer: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const optimizeImage = useCallback(async (file: File, quality: number): Promise<{ blob: Blob; size: number; format: BannerFormat }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));

      img.onload = () => {
        const selectedFormat = findBestFormat(img.width, img.height);
        canvas.width = selectedFormat.width;
        canvas.height = selectedFormat.height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, selectedFormat.width, selectedFormat.height);
        const outputType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ? file.type : 'image/jpeg';
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to create optimized blob'));
          resolve({ blob, size: blob.size, format: selectedFormat });
        }, outputType, quality / 100);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleOutputFilenameChange = useCallback((fileId: string, newFilename: string) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId
        ? { ...f, outputFilename: newFilename }
        : f
    ));
  }, []);

  const addFilesToQueue = useCallback((newFiles: File[]) => {
    const filesToQueue: ProcessedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36),
      originalFile: file,
      status: 'queued' as const,
      progress: 0,
      originalSize: file.size,
      outputFilename: 'Loading...'
    }));

    setFiles(prev => [...prev, ...filesToQueue]);

    filesToQueue.forEach(fileToQueue => {
      const img = new Image();
      img.onload = () => {
        const selectedFormat = findBestFormat(img.width, img.height);
        const extension = getFileExtension(fileToQueue.originalFile.type);
        const baseName = fileToQueue.originalFile.name.substring(0, fileToQueue.originalFile.name.lastIndexOf('.'));
        const defaultFilename = `${baseName}_${selectedFormat.width}x${selectedFormat.height}.${extension}`.toLowerCase();

        setFiles(prev => prev.map(f =>
          f.id === fileToQueue.id
            ? {
                ...f,
                selectedFormat: selectedFormat,
                outputFilename: defaultFilename
              }
            : f
        ));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        setFiles(prev => prev.map(f =>
          f.id === fileToQueue.id
            ? { ...f, status: 'error', errorMessage: 'Failed to read image dimensions.' }
            : f
        ));
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(fileToQueue.originalFile);
    });
  }, []);

  const startAllProcessing = useCallback(async () => {
    const filesToProcess = files.filter(f => f.status === 'queued');

    setFiles(prev => prev.map(f =>
      f.status === 'queued' ? { ...f, status: 'processing' } : f
    ));

    for (const fileToProcess of filesToProcess) {
      try {
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f =>
            f.id === fileToProcess.id
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        const result = await optimizeImage(fileToProcess.originalFile, 90);
        clearInterval(progressInterval);

        setFiles(prev => prev.map(f =>
          f.id === fileToProcess.id
            ? {
                ...f,
                status: 'completed' as const,
                progress: 100,
                optimizedBlob: result.blob,
                optimizedSize: result.size,
                selectedFormat: result.format
              }
            : f
        ));
        showToast(`${fileToProcess.outputFilename} optimized successfully`, 'success');
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileToProcess.id
            ? {
                ...f,
                status: 'error' as const,
                errorMessage: error instanceof Error ? error.message : 'Processing failed'
              }
            : f
        ));
        showToast(`Failed to process ${fileToProcess.outputFilename}`, 'error');
      }
    }
  }, [files, optimizeImage, showToast]);

  const downloadAllFiles = useCallback(async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.optimizedBlob);
    if (completedFiles.length === 0) {
      showToast("No files to download. Process some images first.", 'error');
      return;
    }

    const zip = new JSZip();
    for (const file of completedFiles) {
      if (file.optimizedBlob && file.selectedFormat) {
        zip.file(file.outputFilename.toLowerCase(), file.optimizedBlob);
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimized_banners_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${completedFiles.length} optimized files`, 'success');
    } catch (error) {
      showToast("Could not create the ZIP file.", 'error');
    }
  }, [files, showToast]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Chip icon={<ZapIcon />} label="Banner Optimizer" color="primary" sx={{ mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Optimize Images for Perfect Banners
        </Typography>
        <Typography variant="h6" color="text.secondary" component="p" sx={{ maxWidth: 'md', mx: 'auto' }}>
          Upload your images and we'll automatically convert them to standard banner formats
          with optimized file sizes for web use.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {bannerFormats.map((format) => (
          <Grid item xs={12} sm={6} md={4} key={format.name}>
            <Card sx={{ textAlign: 'center' }}>
              <CardHeader title={format.name} subheader={format.useCase} />
              <CardContent>
                <Typography variant="h4" color="primary">{format.width}×{format.height}</Typography>
                <Typography variant="body2" color="text.secondary">Ratio: {format.aspectRatio.toFixed(2)}:1</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <DropZone
          onFilesSelected={addFilesToQueue}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          showToast={showToast}
        />
      </Box>

      {files.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              {files.some(f => f.status === 'queued') ? 'Files Queue' : 'Processing Results'}
            </Typography>
            <Box>
              {files.some(f => f.status === 'queued') && (
                <Button
                  onClick={startAllProcessing}
                  variant="contained"
                  color="primary"
                  startIcon={<ZapIcon />}
                >
                  Optimize All ({files.filter(f => f.status === 'queued').length})
                </Button>
              )}
              {files.filter(f => f.status === 'completed').length > 1 && (
                <Button
                  onClick={downloadAllFiles}
                  variant="contained"
                  startIcon={<ArchiveIcon />}
                  sx={{ ml: 2 }}
                >
                  Download All ({files.filter(f => f.status === 'completed').length})
                </Button>
              )}
            </Box>
          </Box>
          <Grid container spacing={2}>
            {files.map((file) => (
              <Grid item xs={12} key={file.id}>
                <FileProcessor file={file} onOutputFilenameChange={handleOutputFilenameChange} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BannerOptimizer;