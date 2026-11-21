import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { initDatabase } from '@/database/healthmateDatabase';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  useColorScheme,
} from 'react-native';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState('');
  useEffect(() => {
    let screenIsActive = true;

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

        if (screenIsActive) {
          setDatabaseError(
            error instanceof Error
              ? error.message
              : 'Unable to initialize the HealthMate database.'
          );
        }

      } finally {
        if (screenIsActive) {
          setIsDatabaseReady(true);
        }
      }
    }

    void prepareHealthMateDatabase();

    return () => {
      screenIsActive = false;
    };
  }, []);
 return (
  <ThemeProvider
    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
  >
    <AnimatedSplashOverlay />
    {!isDatabaseReady ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F7F5',
        }}
      >
        <ActivityIndicator size="large" color="#176B4D" />
        <Text style={{ marginTop: 12, color: '#758178' }}>
          Preparing HealthMate...
        </Text>
      </View>
    ) : databaseError !== '' ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 25,
          backgroundColor: '#F4F7F5',
        }}
      >
        <Text
          style={{
            color: '#BC3F35',
            fontWeight: 'bold',
            fontSize: 17,
          }}
        >
          Unable to start HealthMate
        </Text>

        <Text
          style={{
            color: '#758178',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          {databaseError}
        </Text>
      </View>
    ) : (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="editrecord" />
      </Stack>
    )}
  </ThemeProvider>
);
}


