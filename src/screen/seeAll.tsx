import React, { useState } from 'react';
import {  Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, Linking,ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'; 
import { RootState, AppDispatch } from '../../redux/store'; 
import { toggleFavorites, fetchMoreMovies } from '../../redux/movieSlice';


const SeeAllScreen = ({ route, navigation }: any) => {
    const { title, data } = route.params; 
    const dispatch = useDispatch<AppDispatch>();
    const {favorites, isLoading} = useSelector((state: RootState) => state.movies);

    const movies = useSelector((state: RootState) => {
        if (title.includes('Korean')) return state.movies.koreanShows;
        if (title.includes('Disney')) return state.movies.disneyMovies;
        return state.movies.trendingMovies;
    });

    const [page, setPage] = useState(1);

    const handleLoadMore = () => {
        if (!isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            
            
            const catMap: any = { 
                'Korean TV Shows': 'korean', 
                'Disney Movies': 'disney', 
                'Latest Movies': 'trending' 
            };
            
            const category = catMap[title];
            if (category) {
                dispatch(fetchMoreMovies({ category, page: nextPage }));
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>{title}</Text>
            <FlatList
                data={movies}
                numColumns={2} 
                keyExtractor={(item, index) => `${item.id || item.provider_id || 'no-id'}-${index}`}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListFooterComponent={isLoading ? <ActivityIndicator size="small" color="#4facfe" /> : null}
                renderItem={({ item }) => {
                    const isFavorite = favorites?.some((fav: any) => fav.id === item.id);
                    
                    return (

                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('Details', { movie: item })}
                    >
                        <Image 
                            source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} 
                            style={styles.image} 
                        />

                        <TouchableOpacity 
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                        onPress={() => dispatch(toggleFavorites(item))}
                        >
                            <AntDesign 
                            name={isFavorite ? "heart" : "heart"} 
                            size={22} 
                            color={isFavorite ? "red" : "white"} 
                            />
                            </TouchableOpacity>
                            <Text style={styles.movieTitle} numberOfLines={1}>{item.title || item.name}</Text>
                            </TouchableOpacity>
                            );
                        }}
                        />
                        </SafeAreaView>
                        );
                    };

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white', 
        padding: 10 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginVertical: 15, 
        paddingLeft: 10 
    },
    card: { 
        flex: 1, 
        margin: 5, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 10, 
        overflow: 'hidden' 
    },
    image: { 
        width: '100%', 
        height: 200 
    },
    movieTitle: { 
        padding: 10, 
        fontWeight: 'bold' 
    }
});

export default SeeAllScreen;