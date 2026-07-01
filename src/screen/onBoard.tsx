import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { getTrendingMovies } from '../service/movieApi';

const { width } = Dimensions.get('window');

const Onboarding = ({ navigation }: { navigation: any }) => {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const getTrendingForOnboarding = async () => {
      try {
        const movies = await getTrendingMovies();
        const dynamicSlides = movies.slice(0, 3).map((movie: any, index: number) => ({
          id: movie.id.toString(),
          title: index === 0 ? "Discover Movies" : index === 1 ? "Create Playlists" : "Get Started",
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }));
        setSlides(dynamicSlides);
      } catch (error) {
        console.error("Failed to fetch onboarding movies:", error);
      }
    };

    getTrendingForOnboarding();
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex , animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.replace('Auth'); 
    }
  };

  const renderItem = ({ item }: { item: any }) => (
  <View style={{ 
    width: width, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20 
  }}>
    <Image 
      source={{ uri: item.poster_path }} 
      style={{
        width: width * 0.8, 
        height: (width * 0.8) * 1.5, 
        borderRadius: 20,
        backgroundColor: '#333'
      }} 
      resizeMode="cover" 
    />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  if (slides.length === 0) return null; 

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => (
          { length: width, offset: width * index, index }
        )}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={width} 
        style={{ flexGrow: 0 }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
        />
      
      
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
        ))}
      </View>

    
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
},
  slide: { 
    width, alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
},
  image: { 
    width: width * 0.8, 
    height:width * 0.75,
    marginBottom: 40 ,
    backgroundColor: '#333', 
    borderRadius: 20
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333' 
},
  description: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 10 
},
  indicatorContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 20 
},
  dot: { 
    height: 10, 
    width: 10, 
    borderRadius: 5, 
    backgroundColor: '#ccc', 
    marginHorizontal: 5 
},
  activeDot: { 
    backgroundColor: '#2196F3', 
    width: 20 
},
  button: { 
    backgroundColor: '#2196F3', 
    padding: 15, 
    margin: 20, 
    borderRadius: 10, 
    alignItems: 'center' 
},
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
}
});

export default Onboarding;