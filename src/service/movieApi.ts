import Constants from 'expo-constants';
import { db, auth } from '../../config/authFirebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';

const MY_TOKEN = Constants.expoConfig?.extra?.tmdbToken;
const BASE_URL = 'https://api.themoviedb.org/3';


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${MY_TOKEN}`
    }
};

export const getTrendingMovies = async (page: number = 1) => {

    try {
        
        const response = await fetch(`${BASE_URL}/trending/all/day?language=en-US&page=${page}`, options);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Trending Error:', error);
        return [];
    }
};

export const getKoreanTVShows = async (page: number = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?with_origin_country=KR&page=${page}`, options);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Korean Error:', error);
        return [];
    }
};

export const getDisneyMovies = async (page: number = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?with_companies=2&page=${page}`, options);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Disney Error:', error);
        return [];
    }
};

export const getTVDetails = async (id: number,) => {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}`, options);
        return await response.json();
    } catch (error) { return null; }
};

export const getMovieDetails = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}`, options);
        return await response.json();
    } catch (error) { return null; }
};

export const getMovieCredits = async (id: number, type: 'movie' | 'tv' = 'movie') => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/credits`, options);
        const data = await response.json();
        return data.cast.slice(0, 10);
    } catch (error) {
        return [];
    }
};

export const searchMovies = async (query: string) => {
    try {
        const response = await fetch(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US`, options);
        const data= await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Search Error:', error);
        return [];
    }
};

export const getWatchProviders = async () => {
    try {
        const response = await fetch(`${BASE_URL}/watch/providers/movie?language=en-US&watch_region=US`, options);
        const data = await response.json();
        return data.results.slice(0, 10); 
    } catch (error) {
        console.error('Providers Error:', error);
        return [];
    }
};

// Fetching movies trailer
export const getMovieTrailer = async (movieId: number) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWUzNTA4MzM5ZGVlYjBiYzNlODg4NDA3MmY2ZTY1NiIsIm5iZiI6MTc3NTAzMjA1MS4yODE5OTk4LCJzdWIiOiI2OWNjZDZmM2YxN2I0MGJhMWM1NzMwODYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AvuRlUsw_eFtuMdD9gNA8lWyIBnXosh2k9_oZGtqhdk' 
        }
    };
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos`, 
            options
        );
        const data = await response.json();

        if (data?.results?.length > 0) {
            
            let video = data.results.find(
                (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube' && vid.official === true
            );

            
            if (!video) {
                video = data.results.find(
                    (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
                );
            }

            
            if (!video) {
                video = data.results.find(
                    (vid: any) => vid.type === 'Teaser' && vid.site === 'YouTube'
                );
            }
            return video ? video.key : null;
        }
        return null;
    } catch (error) {
        console.error('Error Getting Movie Trailer:', error);
        return null;
    }
};

export const addToHistory = async (action: string, movieTitle: string) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await addDoc(collection(db, 'users', user.uid, 'history'), {
        action: action,
        title: movieTitle,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }
};

export const deleteHistoryItem = async (itemId: string) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'history', itemId));
        } catch (error) {
            console.error("Error deleting history:", error);
        }
    }
};