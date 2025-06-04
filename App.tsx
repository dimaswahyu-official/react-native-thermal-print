import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import ReceiptScreen from './src/screen/ReceiptScreen';

export type RootStackParamList = {
  Home: undefined;
  Receipt: { items: Item[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export interface Item {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
