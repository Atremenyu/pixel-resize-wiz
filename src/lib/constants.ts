export interface BannerFormat {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  useCase: string;
}

export const bannerFormats: BannerFormat[] = [
    { name: 'Banner 600x500', width: 600, height: 500, aspectRatio: 1.2, useCase: 'Banner Cuadrado Estándar' },
    { name: 'Banner 640x200', width: 640, height: 200, aspectRatio: 3.2, useCase: 'Banner Rectangular Horizontal' },
    { name: 'Banner 728x90', width: 728, height: 90, aspectRatio: 8.09, useCase: 'Banner Leaderboard Horizontal' },
    { name: 'Banner 420x200', width: 420, height: 200, aspectRatio: 2.1, useCase: 'Banner Horizontal Mediano' },
    { name: 'Banner 1100x361', width: 1100, height: 361, aspectRatio: 3.05, useCase: 'Banner de Cabecera Grande' },
    { name: 'Banner 630x250', width: 630, height: 250, aspectRatio: 2.52, useCase: 'Banner de Contenido Ancho' }
];

export const findBestFormat = (width: number, height: number): BannerFormat => {
  const aspectRatio = width / height;
  return bannerFormats.reduce((best, format) => {
    const currentDiff = Math.abs(aspectRatio - format.aspectRatio);
    const bestDiff = Math.abs(aspectRatio - best.aspectRatio);
    return currentDiff < bestDiff ? format : best;
  });
};
