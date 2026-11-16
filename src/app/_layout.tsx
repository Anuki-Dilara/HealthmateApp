import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Prepare the local database when HealthMate starts.
  useEffect(() => {
    async function prepareHealthMateDatabase() {
      try {
        await initDatabase();
        console.log('HealthMate database initialized successfully.');
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

      {/* main stack contains the bottom-tab section. */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}


