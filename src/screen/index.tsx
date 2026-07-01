import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, ScrollView,SafeAreaView, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef} from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchHomeData, fetchMoreMovies, toggleFavorites } from '../../redux/movieSlice';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const { trendingMovies, koreanShows, disneyMovies, providers, favorites, isLoading } = 
        useSelector((state: RootState) => state.movies);
    

   const handleChannelPress = (providerName: string) => {
    let url = '';
    const name = providerName.toLowerCase();

    if (name.includes('netflix')) url = 'https://www.netflix.com';
    else if (name.includes('disney')) url = 'https://www.disneyplus.com';
    else if (name.includes('amazon') || name.includes('prime')) url = 'https://www.primevideo.com';
    else if (name.includes('apple')) url = 'https://tv.apple.com';
    
    if (url) {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    } else {
        
        Linking.openURL(`https://www.google.com/search?q=${providerName}`).catch(err => console.error(err));
    }
};

    useEffect(() => {
        dispatch(fetchHomeData());
    }, [dispatch]);

    const [currentIndex,setCurrentIndex] = useState(0);
    const [page, setPage] = useState(1);
    const flatListRef = useRef<FlatList>(null);

    const loadMoreMovies = (category: 'trending' | 'korean' | 'disney') => {
    if (!isLoading) {
        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(fetchMoreMovies({ category, page: nextPage })); 
    }
};

    useEffect(() => {
        if (!trendingMovies ||trendingMovies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % trendingMovies.length;

            if (flatListRef.current) {
            flatListRef.current?.scrollToIndex({ 
                index: nextIndex, 
                animated: true,
                viewPosition: 0.5,
             });
            }
            
            return nextIndex;

            });
        }, 3000);

            return () => clearInterval(interval);

        }, [trendingMovies]);

        if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size="large" color="#4facfe" />
            <Text style={{ marginTop: 10, color: '#666' }}>Fetching Movies...</Text>
        </View>
    );
}

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
                
                <Image 
                    source={require('../screen/assets/image/faceOff.jpg')} 
                    style={styles.profilePic} 
                />

                <Image 
                    source={require('../screen/assets/image/disnep.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />

                <AntDesign name="heart" size={30} color="red" />

            </View>

            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={trendingMovies}
                    horizontal
                    pagingEnabled
                    onEndReached={() => loadMoreMovies('trending')}
                    onEndReachedThreshold={0.5}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    getItemLayout={(data, index) => (
                        { length: width, offset: width * index, index }
                    )}
                    onScrollToIndexFailed={() => {}}
                    renderItem={({ item }) => (
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item?.poster_path}` }} style={styles.bannerImage} />
                    )}
                />
            </View>

            <View style={styles.channelHeader}>
                <Text style={styles.channelTitle}>Channel</Text>

                <TouchableOpacity onPress={() => { const formattedProviders = providers.map(p => ({
            ...p,
            id: p.provider_id, 
            title: p.provider_name, 
            name: p.provider_name, 
            poster_path: p.logo_path,
            vote_average: 10,
            duration: "Channel" 
        }));

        navigation.navigate('SeeAll' as never, { 
            title: 'Watch Providers', 
            data: formattedProviders 
        } as never);
    }}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.channelList}
>
    {providers.map((channel) => {
        const isFavorite = favorites.some((fav) => fav.id === channel.id);  

        return (
        <TouchableOpacity 
            key={channel.provider_id} 
            style={styles.channelBox}
            onPress={() => handleChannelPress(channel.provider_name)}
        >

            <TouchableOpacity 
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                        onPress={() => dispatch(toggleFavorites(channel))}
                        >
                            <AntDesign 
                            name={isFavorite ? "heart" : "heart"} 
                            size={22} 
                            color={isFavorite ? "red" : "white"} 
                            />
                            </TouchableOpacity>
            <Image 
                source={{ uri: `https://image.tmdb.org/t/p/original${channel.logo_path}` }} 
                style={styles.channelLogo} 
                resizeMode="contain"
            />
        </TouchableOpacity>
        );
})}
</ScrollView>

            <View style={styles.channelHeader}>
                <Text style={styles.sectionTitle}>Korean TV Shows</Text>

                <TouchableOpacity onPress={() => navigation.navigate('SeeAll' as never, { title: 'Korean TV Shows', data: koreanShows } as never)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.movieList}>
                {koreanShows.map((item) => {
                    const isFavorite = favorites.some((fav) => fav.id === item.id); 
                    return (
                    <TouchableOpacity key={item.id} style={styles.movieCard}
                    onPress={() => navigation.navigate('Details' as never, { movie: item } as never)}
                    
                    >
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
                        
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.cardImage} />
                        <View style={styles.cardInfo}>
                            <Text style={styles.movieTitle} numberOfLines={1}>{item.name || item.title}</Text>
                            <View style={styles.statsRow}>
                                <Text style={styles.statText}>{item.duration}</Text>
                                <View style={styles.playButton}><AntDesign name="play-circle" size={12} color="white" /></View>
                                <Text style={styles.statText}>{(item.vote_average || 0).toFixed(1)} ⭐</Text>
                                </View>
                                </View>
                                </TouchableOpacity>
                    );
})}
    </ScrollView>
    <View style={styles.channelHeader}>
        <Text style={styles.sectionTitle}>Disney Movies</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SeeAll' as never, { title: 'Disney Movies', data: disneyMovies } as never)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.movieList}>
            {disneyMovies.map((item) => {
                const isFavorite = favorites.some((fav) => fav.id === item.id); 

                return (
                <TouchableOpacity key={item.id} style={styles.movieCard}
                onPress={() => navigation.navigate('Details' as never, { movie: item } as never)}
                >
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
            
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.cardImage} />
                    <View style={styles.cardInfo}>
                        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statText}>{item.duration}</Text>
                            <View style={styles.playButton}><AntDesign name="play-circle" size={12} color="white" /></View>
                            <Text style={styles.statText}>{(item.vote_average || 0).toFixed(1)} ⭐</Text>
                            </View>
                            </View>
                            </TouchableOpacity>
                );
                })}
                        </ScrollView>
                        
                        <View style={styles.channelHeader}>
                            <Text style={styles.sectionTitle}>Latest Movies</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SeeAll' as never, { title: 'Latest Movies', data: trendingMovies } as never)}>
                                <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.movieList}>
                                {trendingMovies?.slice(0, 10).map((item) => {
                                    const isFavorite = favorites.some((fav) => fav.id === item.id); 

                                    return (
                                    <TouchableOpacity key={item.id} style={styles.movieCard}
                                    onPress={() => navigation.navigate('Details' as never, { movie: item } as never)}
                                    >
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
                                        <Image 
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} 
                                        style={styles.cardImage} 
                                        />
                                        <View style={styles.cardInfo}>
                                            <Text style={styles.movieTitle} numberOfLines={1}>{item.title || item.name}</Text>
                                            <View style={styles.statsRow}>
                                                <Text style={styles.statText}>{item.duration}</Text>
                                                <View style={styles.playButton}><AntDesign name="play-circle" size={12} color="white" /></View>
                                                <Text style={styles.statText}>{(item.vote_average || 0).toFixed(1)} ⭐</Text>
                                                </View>
                                                </View>
                                                </TouchableOpacity>
                                                );
                                                })}
                                            </ScrollView>
                                            </ScrollView>
                                            </SafeAreaView>
                                            );
                                        };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
    },
    headerRow: {
        flexDirection: 'row',  
        justifyContent: 'space-between',
        alignItems: 'center',  
        paddingHorizontal: 20,   
        marginTop: 10,
        marginBottom: 20,
    },
    carouselContainer: {
        height: 450, 
    },
    bannerImage: {
        width: width * 0.9, 
        height: 400,
        borderRadius: 25,
        marginHorizontal: width * 0.05,
        resizeMode: 'cover',
    },
    profilePic: {
        width: 45,
        height: 45,
        borderRadius: 22.5,    
        borderWidth: 1,
        borderColor: '#fff',
    },
    logo: {
        width: 100,
        height: 40,
    },
    channelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    channelTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000', 
    },
    seeAllText: {
        fontSize: 16,
        color: '#666',
    },
    channelList: {
        paddingLeft: 20,
    },
    channelBox: {
        width: 110,
        height: 70,
        backgroundColor: '#000', 
        borderRadius: 15,       
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    channelLogo: {
        width: '80%',
        height: '80%',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    movieList: {
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 20,
    },
    movieCard: {
        width: 170,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 20,
        marginTop: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    cardInfo: {
        padding: 10,
        alignItems: 'center',
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    statText: {
        fontSize: 12,
        color: '#666',
    },
    playButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4facfe', 
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HomeScreen