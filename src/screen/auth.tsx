import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../config/authFirebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthScreen = ({ navigation}: any) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthentication = async () => {
    
    if (!email || !password) {
        Alert.alert("Error", "Please all fields must be completed in order to continue!");
        return;
    }

    setLoading(true);

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successfully")
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account created successfully!");
            setIsLogin(true);
        }
    } catch(error: any) {
        let errorMessage = "Something went wrong. Please try again.";

        if (error.code === 'auth/email-already-in-use') {
                errorMessage = "That email is already registered!";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            }

            Alert.alert("Authentication Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.inner}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? "Sign in to continue" : "Start your journey with create account!"}
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity 
                        style={styles.mainButton} 
                        onPress={handleAuthentication}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    inner: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20 
    },
    header: { 
        marginBottom: 40 
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#666', 
        marginTop: 5 
    },
    form: {
        width: '100%' 
    },
    input: {
        backgroundColor: '#f5f5f5',
        height: 60,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee'
    },
    mainButton: {
        backgroundColor: '#4facfe',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4facfe',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 5
    },
    buttonText: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    switchText: { 
        textAlign: 'center', 
        marginTop: 20, 
        color: '#4facfe', 
        fontWeight: '600' 
    }
});

export default AuthScreen;
