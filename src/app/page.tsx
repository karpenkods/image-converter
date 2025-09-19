'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Header } from '../components/Header';
import { ImageUploader } from '../components/ImageUploader';
import { ConversionSettings } from '../components/ConversionSettings';
import { ImagePreview } from '../components/ImagePreview';

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Image Converter
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Конвертируйте изображения в любой формат
          </Typography>
        </Box>

        <ImageUploader />
        <ConversionSettings />
        <ImagePreview />
      </Container>
    </>
  );
}
