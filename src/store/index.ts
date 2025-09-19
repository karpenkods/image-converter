import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './slices/appSlice';
import { imageApi } from './api/imageApi';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['app/setOriginalImage', 'app/setConvertedImage'],
        ignoredPaths: ['app.originalImage.file', 'app.convertedImage.blob'],
      },
    }).concat(imageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
