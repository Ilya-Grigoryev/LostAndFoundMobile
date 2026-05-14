import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import { MainStackParamList } from './types';
import FinderNavigator from './FinderNavigator';
import FundboxNavigator from './FundboxNavigator';
import LoserNavigator from './LoserNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Finder" component={FinderNavigator} />
      <Stack.Screen name="Loser" component={LoserNavigator} />
      <Stack.Screen name="Fundbox" component={FundboxNavigator} />
    </Stack.Navigator>
  );
}
