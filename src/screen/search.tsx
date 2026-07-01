import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { searchMovies } from '../service/movieApi';
import { addToHistory} from '../service/movieApi';

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            setIsLoading(true);
            const data = await searchMovies(text);
            setResults(data);
            setIsLoading(false);
        } else {
            setResults([]);
        }
        if (query.length > 0) {
    addToHistory('Searched', query);
}
};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.note}>
                <Text style={styles.noteText}>Welcome on your search page</Text>
                <Text style={styles.noteText2}>Search your favorite movie here!!!</Text>
            </View>
            <View style={styles.searchBarContainer}>
                <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search movies or TV shows..."
                    value={query}
                    onChangeText={handleSearch}
                    autoFocus={true}
                />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#4facfe" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={results}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.card}
                            onPress={() => navigation.navigate('Details', { movie: item })}
                        >
                            <Image 
                                source={{ 
                                    uri: item.poster_path 
                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                    : 'https://via.placeholder.com/150'
                                }} 
                                style={styles.image} 
                            />
                            <Text style={styles.movieTitle} numberOfLines={2}>
                                {item.title || item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        query.length > 2 ? (
                            <Text style={styles.emptyText}>No results found for "{query}"</Text>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white' 
    },
    note: {
        padding: 10,
        alignItems: 'center',
        marginTop: 50,
    },
    noteText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
     noteText2: {
        fontSize: 15,
        color: '#4facfe',
        marginTop: 10
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        margin: 20,
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 50,
    },
    searchIcon: {
         marginRight: 10
    },
    searchInput: { 
        flex: 1, 
        fontSize: 16 
    },
    listContainer: { 
        paddingHorizontal: 10, 
        paddingBottom: 20 
    },
    card: { 
        flex: 1, 
        margin: 10, 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        elevation: 2 
    },
    image: { 
        width: '100%', 
        height: 220, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10 
    },
    movieTitle: { 
        padding: 10, 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: '#666' 
    }
});

export default SearchScreen