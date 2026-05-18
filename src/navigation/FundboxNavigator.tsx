import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClaimScreen from '../screens/fundbox/ClaimScreen';
import ClaimSuccessScreen from '../screens/fundbox/ClaimSuccessScreen';
import DropOffConfirmScreen from '../screens/fundbox/DropOffConfirmScreen';
import DropOffSuccessScreen from '../screens/fundbox/DropOffSuccessScreen';
import FundboxMapScreen from '../screens/fundbox/FundboxMapScreen';
import MatchFundboxRouteScreen from '../screens/fundbox/MatchFundboxRouteScreen';
import FundboxRouteScreen from '../screens/fundbox/FundboxRouteScreen';
import MatchLocationScreen from '../screens/fundbox/MatchLocationScreen';
import PossibleMatchScreen from '../screens/fundbox/PossibleMatchScreen';
import { FundboxStackParamList } from './types';

const Stack = createNativeStackNavigator<FundboxStackParamList>();

export default function FundboxNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={FundboxMapScreen} />
      <Stack.Screen name="Route" component={FundboxRouteScreen} />
      <Stack.Screen name="DropOff" component={DropOffConfirmScreen} />
      <Stack.Screen name="DropOffSuccess" component={DropOffSuccessScreen} />
      <Stack.Screen name="PossibleMatch" component={PossibleMatchScreen} />
      <Stack.Screen name="MatchFundboxRoute" component={MatchFundboxRouteScreen} />
      <Stack.Screen name="Claim" component={ClaimScreen} />
      <Stack.Screen name="MatchLocation" component={MatchLocationScreen} />
      <Stack.Screen name="ClaimSuccess" component={ClaimSuccessScreen} />
    </Stack.Navigator>
  );
}
