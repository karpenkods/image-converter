import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AppState,
  ImageFile,
  ConvertedImage,
  ConversionSettings,
} from '../../types';

const initialState: AppState = {
  theme: 'light',
  language: 'ru',
  originalImage: null,
  convertedImage: null,
  conversionSettings: {
    format: 'webp',
    maintainAspectRatio: true,
    quality: 90,
  },
  isConverting: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'ru' | 'en'>) => {
      state.language = action.payload;
    },
    setOriginalImage: (state, action: PayloadAction<ImageFile | null>) => {
      state.originalImage = action.payload;
      state.convertedImage = null;
    },
    setConvertedImage: (
      state,
      action: PayloadAction<ConvertedImage | null>
    ) => {
      state.convertedImage = action.payload;
    },
    updateConversionSettings: (
      state,
      action: PayloadAction<Partial<ConversionSettings>>
    ) => {
      state.conversionSettings = {
        ...state.conversionSettings,
        ...action.payload,
      };
    },
    setIsConverting: (state, action: PayloadAction<boolean>) => {
      state.isConverting = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setOriginalImage,
  setConvertedImage,
  updateConversionSettings,
  setIsConverting,
} = appSlice.actions;
