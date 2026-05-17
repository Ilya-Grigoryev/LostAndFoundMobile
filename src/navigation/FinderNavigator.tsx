import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinderReportProvider } from '../contexts/FinderReportContext';
import FinderCameraGpsScreen from '../screens/finder/FinderCameraGpsScreen';
import FinderChoiceScreen from '../screens/finder/FinderChoiceScreen';
import FinderLocationScreen from '../screens/finder/FinderLocationScreen';
import FinderSuccessScreen from '../screens/finder/FinderSuccessScreen';
import { FinderStackParamList } from './types';

const Stack = createNativeStackNavigator<FinderStackParamList>();

export default function FinderNavigator() {
  return (
    <FinderReportProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CameraGps" component={FinderCameraGpsScreen} />
        <Stack.Screen name="Location" component={FinderLocationScreen} />
        <Stack.Screen name="Choice" component={FinderChoiceScreen} />
        <Stack.Screen name="Success" component={FinderSuccessScreen} />
      </Stack.Navigator>
    </FinderReportProvider>
  );
}
