import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ArtistAvailabilityScreen } from '../screens/availability/ArtistAvailabilityScreen';

export type AvailabilityStackParams = {
  ArtistAvailability: {
    artistId: string;
    artistName: string;
  };
};

const Stack = createStackNavigator<AvailabilityStackParams>();

export const AvailabilityStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen 
        name="ArtistAvailability" 
        component={ArtistAvailabilityScreen}
        options={{
          title: 'Disponibilidad',
        }}
      />
    </Stack.Navigator>
  );
};
