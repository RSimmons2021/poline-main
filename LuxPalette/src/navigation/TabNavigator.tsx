import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';

import ExploreScreen from '../screens/ExploreScreen';
import InteriorScreen from '../screens/InteriorScreen';
import FashionScreen from '../screens/FashionScreen';
import PaintingScreen from '../screens/PaintingScreen';
import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Interior') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fashion') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Painting') {
            iconName = focused ? 'color-palette' : 'color-palette-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.gridLine,
          borderTopWidth: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Interior" component={InteriorScreen} />
      <Tab.Screen name="Fashion" component={FashionScreen} />
      <Tab.Screen name="Painting" component={PaintingScreen} />
      <Tab.Screen name="Library" component={SavedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
