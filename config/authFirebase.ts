import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth'
import { getAuth,initializeAuth, browserSessionPersistence,  getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCl85IWnvM61UVwEX6KK6qH0cAsIQIOWkU",
  authDomain: "movie-app-2326f.firebaseapp.com",
  projectId: "movie-app-2326f",
  storageBucket: "movie-app-2326f.firebasestorage.app",
  messagingSenderId: "1027546557566",
  appId: "1:1027546557566:web:dbf1d7ee3f57cf343a3c2f",
  measurementId: "G-WTM4Q9JJ2F"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? browserSessionPersistence 
    : getReactNativePersistence(AsyncStorage)
});



export const db = getFirestore(app);


export default app;