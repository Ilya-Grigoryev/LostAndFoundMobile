import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClaimScreen from '../screens/fundbox/ClaimScreen';
import ClaimSuccessScreen from '../screens/fundbox/ClaimSuccessScreen';
import DropOffConfirmScreen from '../screens/fundbox/DropOffConfirmScreen';
import FundboxMapScreen from '../screens/fundbox/FundboxMapScreen';
import FundboxRouteScreen from '../screens/fundbox/FundboxRouteScreen';
import VerificationCodeScreen from '../screens/fundbox/VerificationCodeScreen';
import { FundboxStackParamList } from './types';

const Stack = createNativeStackNavigator<FundboxStackParamList>();

export default function FundboxNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={FundboxMapScreen} />
      <Stack.Screen name="Route" component={FundboxRouteScreen} />
      <Stack.Screen name="DropOff" component={DropOffConfirmScreen} />
      <Stack.Screen name="Code" component={VerificationCodeScreen} />
      <Stack.Screen name="Claim" component={ClaimScreen} />
      <Stack.Screen name="ClaimSuccess" component={ClaimSuccessScreen} />
    </Stack.Navigator>
  );
}
