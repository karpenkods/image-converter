'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTheme, setLanguage } from '../store/slices/appSlice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppState } from '@/types';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, language } = useSelector(
    (state: RootState) => state.app as AppState
  );
  const [, setStoredTheme] = useLocalStorage<'light' | 'dark'>(
    'theme',
    'light'
  );
  const [, setStoredLanguage] = useLocalStorage<'ru' | 'en'>('language', 'ru');

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    setStoredTheme(newTheme);
  };

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLanguage = event.target.value as 'ru' | 'en';
    dispatch(setLanguage(newLanguage));
    setStoredLanguage(newLanguage);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Image Converter
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            }}
          >
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>

          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={handleThemeChange}
                color="default"
              />
            }
            label={theme === 'dark' ? 'Темная' : 'Светлая'}
          />

          <IconButton color="inherit" onClick={handleThemeChange}>
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
