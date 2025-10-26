import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { RootStackParamList } from './src/types';
import CombinedSelectionScreen from './src/screens/CombinedSelectionScreen';
import CanvasEditorScreen from './src/screens/CanvasEditorScreen';
import { COLORS } from './src/constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.black} />
      <Stack.Navigator
        initialRouteName="CombinedSelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.black,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: COLORS.black,
          },
        }}
      >
        <Stack.Screen 
          name="CombinedSelection" 
          component={CombinedSelectionScreen}
          options={{ title: 'Create Collage' }}
        />
        <Stack.Screen 
          name="CanvasEditor" 
          component={CanvasEditorScreen}
          options={{ title: 'Editor' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}