'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Paper, Typography, Button } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setOriginalImage } from '../store/slices/appSlice';
import { ImageFile } from '../types';

export const ImageUploader: React.FC = () => {
  const dispatch = useDispatch();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          const imageFile: ImageFile = {
            file,
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
          };
          dispatch(setOriginalImage(imageFile));
        };

        img.src = url;
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp'],
    },
    multiple: false,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        mb: 4,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      <Box sx={{ textAlign: 'center' }}>
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Отпустите файл здесь...'
            : 'Перетащите изображение сюда или нажмите для выбора'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Поддерживаемые форматы: JPEG, PNG, WebP, GIF, BMP
        </Typography>
        <Button variant="outlined" component="span">
          Выбрать файл
        </Button>
      </Box>
    </Paper>
  );
};
