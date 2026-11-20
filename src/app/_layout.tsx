import {
    DarkTheme,
    DefaultTheme,
    Stack,
    ThemeProvider,
} from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { initDatabase } from '@/database/healthmateDatabase';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepareHealthMateDatabase() {
      try {
        await initDatabase();

        console.log(
          'HealthMate database initialized successfully.'
        );
      } catch (error) {
        console.error(
          'HealthMate database initialization failed:',
          error
        );
      }
    }

    void prepareHealthMateDatabase();
  }, []);
  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="editrecord" />
      </Stack>
    </ThemeProvider>
  );
}


