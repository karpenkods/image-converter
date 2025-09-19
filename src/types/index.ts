export interface ImageFile {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

export interface ConvertedImage {
  blob: Blob;
  url: string;
  name: string;
  format: string;
  width?: number;
  height?: number;
}

export type SupportedFormat = 'webp' | 'png' | 'jpg' | 'pdf' | 'ico';

export interface ConversionSettings {
  format: SupportedFormat;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  quality: number;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  originalImage: ImageFile | null;
  convertedImage: ConvertedImage | null;
  conversionSettings: ConversionSettings;
  isConverting: boolean;
}
