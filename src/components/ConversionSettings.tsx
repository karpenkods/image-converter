'use client';

import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  Box,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  updateConversionSettings,
  setIsConverting,
  setConvertedImage,
} from '../store/slices/appSlice';
import { SupportedFormat, AppState } from '../types';

export const ConversionSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { conversionSettings, originalImage, isConverting } = useSelector(
    (state: RootState) => state.app as AppState
  );

  const handleFormatChange = (event: { target: { value: string } }) => {
    dispatch(
      updateConversionSettings({
        format: event.target.value as SupportedFormat,
      })
    );
  };
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value) || undefined;

    if (
      width &&
      conversionSettings.maintainAspectRatio &&
      originalImage?.width &&
      originalImage?.height
    ) {
      // Calculate proportional height
      const aspectRatio = originalImage.height / originalImage.width;
      const height = Math.round(width * aspectRatio);
      dispatch(updateConversionSettings({ width, height }));
    } else {
      dispatch(updateConversionSettings({ width }));
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(event.target.value) || undefined;

    if (
      height &&
      conversionSettings.maintainAspectRatio &&
      originalImage?.width &&
      originalImage?.height
    ) {
      // Calculate proportional width
      const aspectRatio = originalImage.width / originalImage.height;
      const width = Math.round(height * aspectRatio);
      dispatch(updateConversionSettings({ width, height }));
    } else {
      dispatch(updateConversionSettings({ height }));
    }
  };

  const handleAspectRatioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const maintainAspectRatio = event.target.checked;

    // If enabling aspect ratio and width is set, calculate height
    if (
      maintainAspectRatio &&
      conversionSettings.width &&
      originalImage?.width &&
      originalImage?.height
    ) {
      const aspectRatio = originalImage.height / originalImage.width;
      const height = Math.round(conversionSettings.width * aspectRatio);
      dispatch(updateConversionSettings({ maintainAspectRatio, height }));
    } else {
      dispatch(updateConversionSettings({ maintainAspectRatio }));
    }
  };

  const handleQualityChange = (event: Event, newValue: number | number[]) => {
    dispatch(updateConversionSettings({ quality: newValue as number }));
  };

  const handleConvert = async () => {
    if (!originalImage) return;

    dispatch(setIsConverting(true));

    try {
      if (conversionSettings.format === 'pdf') {
        // Handle PDF conversion on client side
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          // Create PDF using jsPDF
          const { jsPDF } = await import('jspdf');
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height],
          });

          const imgData = canvas.toDataURL('image/jpeg');
          pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);

          const pdfBlob = pdf.output('blob');

          dispatch(
            setConvertedImage({
              blob: pdfBlob,
              url: URL.createObjectURL(pdfBlob),
              name: `${originalImage.name.split('.')[0].replace(/_/g, '-')}.pdf`,
              format: 'pdf',
            })
          );

          dispatch(setIsConverting(false));
        };

        img.src = originalImage.url;
        return;
      }

      // Handle other formats via API
      const formData = new FormData();
      formData.append('file', originalImage.file);
      formData.append('format', conversionSettings.format);
      formData.append('quality', conversionSettings.quality.toString());

      if (conversionSettings.width) {
        formData.append('width', conversionSettings.width.toString());
      }
      if (conversionSettings.height) {
        formData.append('height', conversionSettings.height.toString());
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'converted';

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        dispatch(
          setConvertedImage({
            blob,
            url: URL.createObjectURL(blob),
            name: filename,
            format: conversionSettings.format,
            width: conversionSettings.width,
            height: conversionSettings.height,
          })
        );
      }
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      dispatch(setIsConverting(false));
    }
  };

  if (!originalImage) return null;

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Настройки конвертации
      </Typography>

      {originalImage?.width && originalImage?.height && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Оригинальные размеры: {originalImage.width} × {originalImage.height}{' '}
          пикселей
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Формат</InputLabel>
          <Select
            value={conversionSettings.format}
            label="Формат"
            onChange={handleFormatChange}
          >
            <MenuItem value="webp">WebP</MenuItem>
            <MenuItem value="png">PNG</MenuItem>
            <MenuItem value="jpg">JPG</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="ico">ICO</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Ширина"
          type="number"
          value={conversionSettings.width || ''}
          onChange={handleWidthChange}
          sx={{ width: 120 }}
          helperText={
            conversionSettings.maintainAspectRatio
              ? 'Высота изменится автоматически'
              : ''
          }
        />

        <TextField
          label="Высота"
          type="number"
          value={conversionSettings.height || ''}
          onChange={handleHeightChange}
          InputProps={{
            readOnly: conversionSettings.maintainAspectRatio,
          }}
          helperText={
            conversionSettings.maintainAspectRatio
              ? 'Рассчитано автоматически'
              : ''
          }
          sx={{ width: 120 }}
        />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={conversionSettings.maintainAspectRatio}
            onChange={handleAspectRatioChange}
          />
        }
        label="Сохранить пропорции"
        sx={{ mb: 2 }}
      />

      {conversionSettings.format !== 'pdf' && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Качество: {conversionSettings.quality}%
          </Typography>
          <Slider
            value={conversionSettings.quality}
            onChange={handleQualityChange}
            min={10}
            max={100}
            step={10}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleConvert}
        disabled={isConverting}
        size="large"
      >
        {isConverting ? 'Конвертация...' : 'Конвертировать'}
      </Button>
    </Paper>
  );
};
