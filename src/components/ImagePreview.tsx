'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { saveAs } from 'file-saver';
import { AppState } from '../types';

export const ImagePreview: React.FC = () => {
  const { originalImage, convertedImage } = useSelector(
    (state: RootState) => state.app as AppState
  );

  const handleDownload = () => {
    if (convertedImage) {
      saveAs(convertedImage.blob, convertedImage.name);
    }
  };

  if (!originalImage) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Предварительный просмотр
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card>
            <CardMedia
              component="img"
              image={originalImage.url}
              alt="Оригинальное изображение"
              sx={{ height: 300, objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h6">Оригинал</Typography>
              <Typography variant="body2" color="text.secondary">
                Имя: {originalImage.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Размер: {(originalImage.size / 1024 / 1024).toFixed(2)} МБ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Тип: {originalImage.type}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {convertedImage && convertedImage.format !== 'pdf' && (
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardMedia
                component="img"
                image={convertedImage.url}
                alt="Конвертированное изображение"
                sx={{ height: 300, objectFit: 'contain' }}
              />
              <CardContent>
                <Typography variant="h6">Результат</Typography>
                <Typography variant="body2" color="text.secondary">
                  Имя: {convertedImage.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Размер: {(convertedImage.blob.size / 1024 / 1024).toFixed(2)}{' '}
                  МБ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Формат: {convertedImage.format.toUpperCase()}
                </Typography>
                {convertedImage.width && convertedImage.height && (
                  <Typography variant="body2" color="text.secondary">
                    Размеры: {convertedImage.width} × {convertedImage.height}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  fullWidth
                >
                  Скачать
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}

        {convertedImage && convertedImage.format === 'pdf' && (
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">PDF создан</Typography>
                <Typography variant="body2" color="text.secondary">
                  Имя: {convertedImage.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Размер: {(convertedImage.blob.size / 1024 / 1024).toFixed(2)}{' '}
                  МБ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Формат: PDF
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  fullWidth
                >
                  Скачать PDF
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
