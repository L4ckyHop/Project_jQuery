// Работа с данными
$(document).ready(function() {
    const LOCAL_STORAGE_KEY = 'moviesData';
    const JSON_FILE = 'movies.json';
    let movies = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Загрузка данных из JSON
    function loadMoviesFromJSON() {
        return new Promise((resolve, reject) => {
            $.getJSON(JSON_FILE)
                .done(function(data) {
                    const moviesWithId = data.map((movie, index) => ({
                        ...movie,
                        id: index + 1,
                        isFavorite: favorites.includes(index + 1)
                    }));
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(moviesWithId));
                    movies = moviesWithId;
                    resolve(moviesWithId);
                })
                .fail((jqxhr, textStatus, error) => {
                    reject(`Ошибка загрузки JSON: ${textStatus}, ${error}`);
                });
        });
    }
    // Получение фильмов из localStorage
    function getMoviesFromStorage() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    }
    // Имитация AJAX запроса
    function mockApiRequest(action, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let result;
                switch(action) {
                    case 'ADD':
                        result = addMovieToStorage(data);
                        break;
                    case 'DELETE':
                        result = deleteMovieFromStorage(data);
                        break;
                    case 'TOGGLE_FAVORITE':
                        result = toggleFavoriteMovie(data);
                        break;
                    default:
                        result = getMovies();
                }
                resolve(result);
            }, 500);
        });
    }
    // Основные функции работы с данными
    function getMovies() {
        return [...movies];
    }
    function addMovieToStorage(movieData) {
        const newMovie = {
            ...movieData,
            id: Date.now(),
            isFavorite: false
        };
        movies.push(newMovie);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
        $(document).trigger('movieAdded', [newMovie]);
        return newMovie;
    }
    function deleteMovieFromStorage(movieId) {
        movies = movies.filter(movie => movie.id !== movieId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
        $(document).trigger('movieDeleted', [movieId]);
        return movieId;
    }
    function toggleFavoriteMovie(movieId) {
        const movie = movies.find(m => m.id === movieId);
        if (movie) {
            movie.isFavorite = !movie.isFavorite;
            // Обновляем список избранного
            if (movie.isFavorite) {
                favorites.push(movieId);
            } else {
                favorites = favorites.filter(id => id !== movieId);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
            $(document).trigger('favoriteToggled', [movieId]);
        }
        return movieId;
    }
    // Инициализация данных
    async function initMovieData() {
        try {
            const storedMovies = getMoviesFromStorage();
            if (storedMovies.length > 0) {
                movies = storedMovies;
                console.log('Данные загружены из localStorage');
            } else {
                await loadMoviesFromJSON();
                console.log('Данные загружены из JSON файла');
            }
            $(document).trigger('moviesDataReady', [movies]);
        } catch (error) {
            console.error(error);
            toastr.error('Ошибка загрузки данных фильмов');
        }
    }
    // Публичный API модуля
    window.movieData = {
        init: initMovieData,
        getMovies: getMovies,
        addMovie: (movie) => mockApiRequest('ADD', movie),
        deleteMovie: (id) => mockApiRequest('DELETE', id),
        toggleFavorite: (id) => mockApiRequest('TOGGLE_FAVORITE', id),
        getFavorites: () => movies.filter(m => m.isFavorite)
    };
});