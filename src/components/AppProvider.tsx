'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { RootState } from '../store';
import { setTheme, setLanguage } from '../store/slices/appSlice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppState } from '@/types';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.app as AppState);
  const [storedTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [storedLanguage] = useLocalStorage<'ru' | 'en'>('language', 'ru');
  const [isHydrated, setIsHydrated] = useState(false);

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  useEffect(() => {
    // Предотвращаем ошибки гидратации из-за браузерных расширений
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Инициализируем состояние из localStorage только после гидратации
      dispatch(setTheme(storedTheme));
      dispatch(setLanguage(storedLanguage));
    }
  }, [dispatch, storedTheme, storedLanguage, isHydrated]);

  // Показываем загрузочный экран до полной гидратации
  if (!isHydrated) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
          }}
        >
          Загрузка...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
