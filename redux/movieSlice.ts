import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrendingMovies, getKoreanTVShows, getDisneyMovies, getWatchProviders, getMovieDetails, getTVDetails} from '../src/service/movieApi';

export const fetchHomeData = createAsyncThunk('movies/fetchHomeData', async () => {
    const [trendingRaw, koreanRaw, disneyRaw, providers] = await Promise.all([
        getTrendingMovies(),
        getKoreanTVShows(),
        getDisneyMovies(),
        getWatchProviders()
    ]);

    const enrichList = async (list: any[]) => {
        return await Promise.all(list.map(async (item) => {
            if (item.media_type === 'tv' || item.first_air_date) {
                const details = await getTVDetails(item.id);
                return { ...item, duration: `${details?.number_of_episodes || '?'} Eps.` };
            } else {
                const details = await getMovieDetails(item.id);
                return { ...item, duration: `${details?.runtime || '?'} min` };
            }
        }));
    };

    const [trending, korean, disney] = await Promise.all([
        enrichList(trendingRaw),
        enrichList(koreanRaw),
        enrichList(disneyRaw)
    ]);

    return { trending, korean, disney, providers };
});

export const fetchMoreMovies = createAsyncThunk(
    'movies/fetchMore',
    async ({ category, page }: { category: 'trending' | 'korean' | 'disney', page: number }) => {
        let results;
        if (category === 'trending') results = await getTrendingMovies(page);
        else if (category === 'korean') results = await getKoreanTVShows(page);
        else results = await getDisneyMovies(page);

        return { results, category };
    }
);

interface MovieState {
    trendingMovies: any[];
    koreanShows: any[];
    disneyMovies: any[];
    providers: any[];
    favorites: any[];
    isLoading: boolean;
}

const initialState: MovieState = {
    trendingMovies: [],
    koreanShows: [],
    disneyMovies: [],
    providers: [],
    favorites: [],
    isLoading: false,
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        toggleFavorites: (state, action) => {
            const movie = action.payload;
            const index = state.favorites.findIndex((item) => item.id === movie.id)

            if (index >=0) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(movie);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHomeData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.trendingMovies = action.payload.trending;
                state.koreanShows = action.payload.korean;
                state.disneyMovies = action.payload.disney;
                state.providers = action.payload.providers;
            })
            .addCase(fetchHomeData.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchMoreMovies.fulfilled, (state, action) => {
                const { results, category } = action.payload;
                const filterUnique = (existing: any[], incoming: any[]) => {
                    const existingIds = new Set(existing.map(m => m.id));
                    return incoming.filter(m => !existingIds.has(m.id));
                };
                if (category === 'trending') {
                    state.trendingMovies = [...state.trendingMovies, ...filterUnique(state.trendingMovies, results)];
                } else if (category === 'korean') {
                    state.koreanShows = [...state.koreanShows, ...filterUnique(state.koreanShows, results)];
                } else if (category === 'disney') {
                    state.disneyMovies = [...state.disneyMovies, ...results];
                }
            });
    },
});

export const { toggleFavorites } = movieSlice.actions;
export default movieSlice.reducer;