import React, { useState, useCallback } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, FileImage, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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
  status: 'processing' | 'completed' | 'error';
  progress: number;
  optimizedBlob?: Blob;
  originalSize: number;
  optimizedSize?: number;
  selectedFormat?: BannerFormat;
  errorMessage?: string;
}

const bannerFormats: BannerFormat[] = [
  { name: 'Banner 600x500', width: 600, height: 500, aspectRatio: 1.2, useCase: 'Standard Square Banner' },
  { name: 'Banner 640x200', width: 640, height: 200, aspectRatio: 3.2, useCase: 'Horizontal Rectangular Banner' },
  { name: 'Banner 728x90', width: 728, height: 90, aspectRatio: 8.09, useCase: 'Leaderboard Horizontal Banner' }
];

const DropZone: React.FC<{
  onFilesSelected: (files: File[]) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
}> = ({ onFilesSelected, isDragOver, setIsDragOver }) => {
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, setIsDragOver, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-bounce ${
        isDragOver 
          ? 'border-primary bg-primary-muted scale-105 shadow-glow' 
          : 'border-border bg-gradient-surface hover:border-primary/50 hover:shadow-md'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <div className="p-12 text-center">
        <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-primary mb-6 flex items-center justify-center transition-transform duration-300 ${
          isDragOver ? 'scale-110' : ''
        }`}>
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-foreground">
          Drop your images here
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Drag and drop your images or click to browse. We'll automatically optimize them for banner formats.
        </p>
        
        <Button 
          variant="outline" 
          size="lg"
          className="relative overflow-hidden"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <FileImage className="w-5 h-5 mr-2" />
          Choose Files
        </Button>
        
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
        
        <div className="mt-6 text-sm text-muted-foreground">
          Supported formats: PNG, JPG, GIF, WebP, BMP
        </div>
      </div>
    </div>
  );
};

const FileProcessor: React.FC<{ file: ProcessedFile }> = ({ file }) => {
  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            file.status === 'completed' ? 'bg-success text-success-foreground' :
            file.status === 'error' ? 'bg-destructive text-destructive-foreground' :
            'bg-primary text-primary-foreground'
          }`}>
            {file.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
             file.status === 'error' ? <AlertCircle className="w-5 h-5" /> :
             <Loader2 className="w-5 h-5 animate-spin" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.originalFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatSize(file.originalSize)}
              {file.optimizedSize && ` → ${formatSize(file.optimizedSize)}`}
            </p>
          </div>
          
          {file.selectedFormat && (
            <Badge variant="secondary" className="text-xs">
              {file.selectedFormat.name}
            </Badge>
          )}
        </div>
        
        {file.status === 'processing' && (
          <div className="space-y-2">
            <Progress value={file.progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Processing... {file.progress}%</p>
          </div>
        )}
        
        {file.status === 'error' && (
          <div className="bg-destructive-muted p-3 rounded-lg">
            <p className="text-sm text-destructive-foreground">{file.errorMessage}</p>
          </div>
        )}
        
        {file.status === 'completed' && file.optimizedBlob && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-success">
              <Zap className="w-4 h-4" />
              Optimized successfully
            </div>
            <Button 
              size="sm" 
              className="w-full bg-gradient-success hover:shadow-md transition-all duration-300"
              onClick={() => {
                const url = URL.createObjectURL(file.optimizedBlob!);
                const a = document.createElement('a');
                a.href = url;
                a.download = `optimized_${file.selectedFormat?.name.toLowerCase().replace(/\s+/g, '_')}_${file.originalFile.name}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Optimized
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BannerOptimizer: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const { toast } = useToast();

  const findBestFormat = (width: number, height: number): BannerFormat => {
    const aspectRatio = width / height;
    return bannerFormats.reduce((best, format) => {
      const currentDiff = Math.abs(aspectRatio - format.aspectRatio);
      const bestDiff = Math.abs(aspectRatio - best.aspectRatio);
      return currentDiff < bestDiff ? format : best;
    });
  };

  const optimizeImage = async (file: File): Promise<{ blob: Blob; size: number; format: BannerFormat }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        const selectedFormat = findBestFormat(img.width, img.height);
        
        canvas.width = selectedFormat.width;
        canvas.height = selectedFormat.height;
        
        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, selectedFormat.width, selectedFormat.height);
        
        // Try different quality levels to get under 200KB
        const tryQuality = (quality: number): void => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create optimized blob'));
              return;
            }
            
            if (blob.size <= 200 * 1024 || quality <= 10) {
              resolve({ blob, size: blob.size, format: selectedFormat });
            } else {
              tryQuality(quality - 5);
            }
          }, 'image/jpeg', quality / 100);
        };
        
        tryQuality(95);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const processFiles = useCallback(async (newFiles: File[]) => {
    const processedFiles: ProcessedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36),
      originalFile: file,
      status: 'processing' as const,
      progress: 0,
      originalSize: file.size
    }));

    setFiles(prev => [...prev, ...processedFiles]);

    for (const processedFile of processedFiles) {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === processedFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        const result = await optimizeImage(processedFile.originalFile);
        
        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.id === processedFile.id 
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

        toast({
          title: "Optimization complete",
          description: `${processedFile.originalFile.name} optimized successfully`,
        });

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === processedFile.id 
            ? { 
                ...f, 
                status: 'error' as const, 
                errorMessage: error instanceof Error ? error.message : 'Processing failed'
              }
            : f
        ));

        toast({
          title: "Optimization failed",
          description: `Failed to process ${processedFile.originalFile.name}`,
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-full mb-6 shadow-glow">
            <Zap className="w-6 h-6" />
            <span className="font-semibold">Banner Optimizer</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Optimize Images for Perfect Banners
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your images and we'll automatically convert them to standard banner formats 
            with optimized file sizes for web use.
          </p>
        </div>

        {/* Banner Formats Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {bannerFormats.map((format) => (
            <Card key={format.name} className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{format.name}</CardTitle>
                <CardDescription className="text-xs">{format.useCase}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-1">
                  {format.width}×{format.height}
                </div>
                <div className="text-xs text-muted-foreground">
                  Ratio: {format.aspectRatio.toFixed(2)}:1
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Drop Zone */}
        <div className="mb-8">
          <DropZone 
            onFilesSelected={processFiles}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
          />
        </div>

        {/* Processing Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Processing Files</h2>
            <div className="grid gap-4">
              {files.map((file) => (
                <FileProcessor key={file.id} file={file} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerOptimizer;