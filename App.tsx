import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/authFirebase';
import TabNavigator from './navigations/TabNavigator';
import  DetailsScreen  from './src/screen/detailsScreen';
import SeeAllScreen from './src/screen/seeAll';
import OnboardingScreen from './src/screen/onBoard';
import AuthScreen from './src/screen/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();


export default function App() {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect (() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      if (initializing) setInitializing(false);
    });
    
    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <SafeAreaView style={[
          styles.container, 
          Platform.OS === 'web' && { height: '100vh' as any, width: '100vw' as any }
        ]}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // --- LOGGED IN STACK ---
            <>
              <Stack.Screen name="Go Back" component={TabNavigator} />
              <Stack.Screen 
                name="Details" 
                component={DetailsScreen} 
                options={{ headerShown: true, title: 'Movie Details' }} 
              />
              <Stack.Screen 
                name="SeeAll" 
                component={SeeAllScreen} 
                options={({ route }: any) => ({ 
                  headerShown: true, 
                  title: route.params?.title || 'See All' 
                })} 
              />
            </>
          ) : (
            <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            </>
          )}
        </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});