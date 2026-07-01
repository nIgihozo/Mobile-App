import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert,TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../config/authFirebase'; 
import { signOut, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
    const user = auth.currentUser;
    const [name, setName] = useState(user?.displayName || '');
    const [email] = useState(user?.email || ''); 
    const [profilePic, setProfilePic] = useState(user?.photoURL || 'https://via.placeholder.com/150');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateProfile(user, { displayName: name, photoURL: profilePic });
            Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
            Alert.alert("Error", "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                Alert.alert("Check your Email", "A password reset link has been sent to " + email);
            } catch (error) {
                Alert.alert("Error", "Could not send reset email.");
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: profilePic }} style={styles.avatar} />
                        <View style={styles.editBadge}>
                            <Text style={styles.editBadgeText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                
                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        placeholder="Enter your name"
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={[styles.input, styles.disabledInput]} 
                        value={email} 
                        editable={false} 
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading}>
                        <Text style={styles.saveButtonText}>{loading ? "Updating..." : "Save Changes"}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    
                    <TouchableOpacity style={styles.actionButton} onPress={handlePasswordReset}>
                        <Text style={styles.actionButtonText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={() => signOut(auth)}>
                        <Text style={[styles.actionButtonText, styles.logoutText]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    scrollContent: { 
        paddingBottom: 40 
    },
    photoSection: { 
        alignItems: 'center', 
        marginVertical: 30 
    },
    avatar: { 
        width: 130, 
        height: 130, 
        borderRadius: 65, 
        backgroundColor: '#ddd' 
    },
    editBadge: { 
        position: 'absolute', 
        bottom: 5, right: 5, 
        backgroundColor: '#4facfe', 
        paddingHorizontal: 12, 
        paddingVertical: 4, 
        borderRadius: 20, 
        borderWidth: 2, 
        borderColor: '#fff' 
    },
    editBadgeText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    form: { 
        paddingHorizontal: 25 
    },
    label: { 
        fontSize: 14, 
        color: '#666', 
        marginBottom: 8, 
        fontWeight: '600', 
        marginLeft: 4 
    },
    input: { 
        backgroundColor: '#fff', 
        height: 55, borderRadius: 12, 
        paddingHorizontal: 15, 
        fontSize: 16, 
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: '#e1e4e8' 
    },
    disabledInput: { 
        backgroundColor: '#f1f3f5', 
        color: '#888' 
    },
    saveButton: { 
        backgroundColor: '#4facfe', 
        height: 55, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 10 
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#e1e4e8', 
        marginVertical: 30 
    },
    actionButton: {
         height: 55, 
         justifyContent: 'center', 
         alignItems: 'center', 
         marginBottom: 12 
        },
        actionButtonText: { 
        fontSize: 16, 
        color: '#4facfe', 
        fontWeight: '600' 
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: '#fff', 
    },
    logoutText: {
         color: '#ff4d4d' 
        }
});

export default ProfileScreen;