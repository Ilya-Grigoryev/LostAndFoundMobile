import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from './src/contexts/LocalizationContext';
import RootNavigator from './src/navigation/RootNavigator';
import { RootStackParamList } from './src/navigation/types';
import { addMatchNotificationTapListener } from './src/services/matchingService';
import { colors } from './src/theme';

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => addMatchNotificationTapListener(navigationRef), [navigationRef]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LocalizationProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
