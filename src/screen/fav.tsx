import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../config/authFirebase'; 
import { collection, onSnapshot, query } from 'firebase/firestore';

const FavScreen = ({ navigation }: any) => {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const favRef = collection(db, 'users', user.uid, 'favorites');
        const q = query(favRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const favData: any[] = [];
            querySnapshot.forEach((doc) => {
                favData.push({ id: doc.id, ...doc.data() });
            });
            setFavorites(favData);
            setIsLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    const renderMovieItem = ({ item }: any) => (
        <TouchableOpacity 
            style={styles.movieCard} 
            onPress={() => navigation.navigate('Details', { movie: item })}
        >
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.movieRating}>⭐ {item.vote_average}</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4facfe" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Favorites</Text>
            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={renderMovieItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No favorites yet. Go explore!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    header: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        padding: 20, 
        color: '#333' 
    },
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    listContent: { 
        paddingHorizontal: 10 
    },
    movieCard: { 
        flex: 1, 
        margin: 10, 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        overflow: 'hidden', 
        elevation: 3 
    },
    poster: { 
        width: '100%', 
        height: 220 
    },
    movieInfo: { 
        padding: 10 
    },
    movieTitle: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    movieRating: { 
        fontSize: 12, 
        color: '#666', 
        marginTop: 4 
    },
    emptyText: { 
        color: '#999', 
        fontSize: 16 
    }
});

export default FavScreen;