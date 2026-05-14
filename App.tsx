import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import ComponentsShowcase from './src/screens/dev/ComponentsShowcase';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <ComponentsShowcase />
    </>
  );
}
