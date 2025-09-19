'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { AppProvider } from '@/components/AppProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <AppProvider>{children}</AppProvider>
        </Provider>
      </body>
    </html>
  );
}
