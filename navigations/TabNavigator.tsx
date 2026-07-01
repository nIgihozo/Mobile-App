import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../src/screen/index'; 
import SearchScreen from '../src/screen/search';
import ProfileScreen from '../src/screen/profile';
import HistoryScreen from '../src/screen/history';
import AddScreen from '../src/screen/fav';
import { Entypo, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Favorite" 
        component={AddScreen} 
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="heart-o" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="history" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }}
      />
      
    </Tab.Navigator>
    
  );
}