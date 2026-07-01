import React, { useEffect, useState } from 'react';
import { getMovieCredits, getMovieTrailer } from '../service/movieApi';
import YoutubePlayer from 'react-native-youtube-iframe';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'; 
import { db, auth } from '../../config/authFirebase';
import { AntDesign } from '@expo/vector-icons';
import { addToHistory } from '../service/movieApi';

const DetailsScreen = ({ route }: {route: any}) => {
    const { movie } = route.params;
    const [cast, setCast] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [videoKey, setVideoKey] = useState<string | null>(null);
    

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const user = auth.currentUser;
            if (user) {
                const favDocRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());
                const docSnap = await getDoc(favDocRef);
                if (docSnap.exists()) {
                    setIsFavorite(true);
                }
            }
        };
        const fetchCast = async () => {
            const castData = await getMovieCredits(movie.id, movie.first_air_date ? 'tv' : 'movie');
            setCast(castData);
        };
        const getTrailer = async () => {
            const key = await getMovieTrailer(movie.id);
            setVideoKey(key);
        };
        
        
        checkFavoriteStatus();
        fetchCast();
        getTrailer();
    }, [movie.id]);

    useEffect(() => {
    if (videoKey && (movie?.title || movie?.name)) {
        const movieName = movie.title || movie.name;
        
        console.log("Saving to history:", movieName);
        
        addToHistory('Watched Trailer', movieName);
    }
}, [videoKey, movie]);

    const toggleFavorite = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Login Required", "Please login to add favorites");
            return;
        }

        const favDocRef = doc(db, 'users', user.uid, 'favorites', movie.id.toString());

        try {
            if (isFavorite) {
                await deleteDoc(favDocRef);
                setIsFavorite(false);
                console.log("Deleted from Cloud");
            } else {
                await setDoc(favDocRef, {
                    id: movie.id,
                    title: movie.title || movie.name,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date || movie.first_air_date,
                    overview: movie.overview
                });
                setIsFavorite(true);
                console.log("Saved to Cloud");
            }
        } catch (error) {
            console.error("Firebase Error:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                <Image 
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} 
                    style={styles.headerImage} 
                />
                <TouchableOpacity 
                style={styles.floatingFavButton}
                onPress={toggleFavorite} 
                >
                    <AntDesign 
                    name={isFavorite ? "heart" : "heart"} 
                    size={28} 
                    color={isFavorite ? "red" : "white"} 
                    />
                    </TouchableOpacity>
                    </View>

                    {videoKey ? (
                        <View>
                            <YoutubePlayer
                            height={220}
                            play={false}
                            videoId={videoKey}
                            webViewProps={{
                                allowsInlineMediaPlayback: true, // Keeps it inside the app
            }}
            
            />
            </View>
            ) : (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No trailer for this movie found</Text>
                </View>
            )}
                    
                
                <View style={styles.content}>
                    
                    <Text style={styles.title}>{movie.title || movie.name}</Text>
                    
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>{movie.release_date || movie.first_air_date}</Text>
                        <Text style={styles.infoText}> • </Text>
                        <Text style={styles.infoText}>{movie.duration}</Text>
                        <Text style={styles.infoText}> • </Text>
                        <Text style={styles.infoText}>⭐ {movie.vote_average.toFixed(1)}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {cast.map((actor) => (
                            <View key={actor.id} style={{ marginRight: 15, alignItems: 'center' }}>
                                <Image 
                                source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profile_path}` }} 
                                style={{ width: 80, height: 80, borderRadius: 40 }} 
                                />
                                <Text style={{ fontSize: 12, width: 80, textAlign: 'center' }}>{actor.name}</Text>
                                </View>
                            ))}
                            </ScrollView>
                            </View>
                            </ScrollView>
                            </SafeAreaView>
                            );
                        };

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    headerImage: { 
        width: '100%', 
        height: 450, 
        resizeMode: 'cover' 
    },
    floatingFavButton: { 
    position: 'absolute', 
    top: 40, 
    right: 20, 
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 10,
    borderRadius: 25,
},
    content: {
         padding: 20 
        },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    infoRow: { 
        flexDirection: 'row', 
        marginBottom: 20 
    },
    infoText: { 
        color: '#666', 
        fontSize: 16 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginTop: 10, 
        marginBottom: 10 
    },
    overview: { 
        fontSize: 16, 
        lineHeight: 24, 
        color: '#444' 
    },
    errorContainer: {
    height: 220,
    width: '100%',
    backgroundColor: '#1A1A1A', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  errorText: {
    color: '#999', 
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  }
    
});

export default DetailsScreen;