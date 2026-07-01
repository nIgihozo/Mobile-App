import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/authFirebase'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { deleteHistoryItem } from '../service/movieApi';
import { Feather } from '@expo/vector-icons';

interface HistoryItem {
    id: string;
    action: string;
    title: string;
    timestamp?: any; 
}

const HistoryScreen = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        
        const q = query(
            collection(db, 'users', user.uid, 'history'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HistoryItem[];
            setHistory(items);
            setIsLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    const handleDelete = async (id: string) => {
        await deleteHistoryItem(id);
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4facfe" />
                <Text style={styles.loadingText}>Your History is Loading...</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4facfe" />
                <Text style={styles.loadingText}>Your History is Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
           <Text style={styles.header}>Your Activity</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        {/* Wrap text in a View to keep it separate from the button */}
                        <View style={styles.itemContent}>
                            <Text style={styles.actionText}>
                                {item.action}: <Text style={styles.movieTitle}>{item.title}</Text>
                            </Text>
                        </View>
                        
                        
                        <TouchableOpacity 
                            onPress={() => handleDelete(item.id)} 
                            style={styles.deleteButton}
                        >
                            <Feather name="trash-2" size={18} color="#FF4D4D" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No history yet!</Text>}
            />
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    historyItem: { 
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10, 
        elevation: 2,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemContent: {
        flex: 1, 
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    },
    actionText: { fontSize: 16, color: '#666' },
    movieTitle: { fontWeight: 'bold', color: '#000' },
    loadingText: { marginTop: 10, color: '#666' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default HistoryScreen;