import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GuestRegistrationScreen from '../screens/onboarding/GuestRegistrationScreen';
import LanguagePickerScreen from '../screens/onboarding/LanguagePickerScreen';
import { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguagePicker" component={LanguagePickerScreen} />
      <Stack.Screen name="GuestRegistration" component={GuestRegistrationScreen} />
    </Stack.Navigator>
  );
}
