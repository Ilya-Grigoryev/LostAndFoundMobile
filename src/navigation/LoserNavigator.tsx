import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoserReportProvider } from '../contexts/LoserReportContext';
import CategoryScreen from '../screens/loser/CategoryScreen';
import LocationAddressScreen from '../screens/loser/LocationAddressScreen';
import LocationMapScreen from '../screens/loser/LocationMapScreen';
import LocationModeScreen from '../screens/loser/LocationModeScreen';
import LoserConfirmScreen from '../screens/loser/LoserConfirmScreen';
import LoserSuccessScreen from '../screens/loser/LoserSuccessScreen';
import { LoserStackParamList } from './types';

const Stack = createNativeStackNavigator<LoserStackParamList>();

export default function LoserNavigator() {
  return (
    <LoserReportProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="LocationMode" component={LocationModeScreen} />
        <Stack.Screen name="LocationMap" component={LocationMapScreen} />
        <Stack.Screen name="LocationAddress" component={LocationAddressScreen} />
        <Stack.Screen name="Confirm" component={LoserConfirmScreen} />
        <Stack.Screen name="Success" component={LoserSuccessScreen} />
      </Stack.Navigator>
    </LoserReportProvider>
  );
}
