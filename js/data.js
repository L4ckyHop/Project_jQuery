// Модуль работы с данными фильмов
$(document).ready(function() {
    // Конфигурация
    const API_URL = 'https://my-json-server.typicode.com/typicode/demo/posts'; // API
    const LOCAL_STORAGE_KEY = 'moviesData';
    const JSON_FILE = 'movies.json';
    // Основной массив фильмов
    let movies = [];
    // Загрузка данных из JSON файла через AJAX
    function loadMoviesFromJSON() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: JSON_FILE,
                dataType: 'json',
                success: function(data) {
                    // Добавляем ID для каждого фильма
                    const moviesWithId = data.map((movie, index) => ({
                        ...movie,
                        id: index + 1,
                        isFavorite: false
                    }));
                    
                    // Сохраняем в локальное хранилище
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(moviesWithId));
                    movies = moviesWithId;
                    resolve(moviesWithId);
                },
                error: function(xhr, status, error) {
                    reject(`Ошибка загрузки JSON: ${error}`);
                }
            });
        });
    }
    // Имитация AJAX запроса к API с задержкой
    function mockApiRequest(action, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch(action) {
                    case 'GET':
                        resolve(getMoviesFromStorage());
                        break;
                    case 'ADD':
                        resolve(addMovieToStorage(data));
                        break;
                    case 'DELETE':
                        resolve(deleteMovieFromStorage(data));
                        break;
                    case 'TOGGLE_FAVORITE':
                        resolve(toggleFavoriteMovie(data));
                        break;
                    default:
                        resolve([]);
                }
            }, 800); // Имитация задержки сети
        });
    }
    // Получение фильмов из localStorage
    function getMoviesFromStorage() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            movies = JSON.parse(storedData);
            return movies;
        }
        return [];
    }

    // Добавление нового фильма
    function addMovieToStorage(movieData) {
        const storedData = getMoviesFromStorage();
        const newMovie = {
            ...movieData,
            id: Date.now(), // Уникальный ID на основе времени
            isFavorite: false,
            rating: parseFloat(movieData.rating) || 0
        };
        
        storedData.push(newMovie);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedData));
        movies = storedData;
        
        // Генерация события
        $(document).trigger('movieAdded', [newMovie]);
        return newMovie;
    }

    // Удаление фильма
    function deleteMovieFromStorage(movieId) {
        let storedData = getMoviesFromStorage();
        storedData = storedData.filter(movie => movie.id !== movieId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedData));
        movies = storedData;
        
        // Генерация события
        $(document).trigger('movieDeleted', [movieId]);
        return movieId;
    }

    // Переключение статуса "Избранное"
    function toggleFavoriteMovie(movieId) {
        const storedData = getMoviesFromStorage();
        const updatedData = storedData.map(movie => 
            movie.id === movieId 
                ? {...movie, isFavorite: !movie.isFavorite} 
                : movie
        );
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        movies = updatedData;
        
        // Генерация события
        $(document).trigger('favoriteToggled', [movieId]);
        return movieId;
    }
    // Инициализация данных
    async function initMovieData() {
        try {
            // Пытаемся загрузить из localStorage
            const storedMovies = getMoviesFromStorage();
            if (storedMovies.length === 0) {
                // Если данных нет - загружаем из JSON
                await loadMoviesFromJSON();
                console.log('Данные загружены из JSON файла');
            } else {
                movies = storedMovies;
                console.log('Данные загружены из localStorage');
            }
            // Уведомляем приложение о готовности данных
            $(document).trigger('moviesDataReady', [movies]);
            return movies;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    // Публичный API модуля
    window.movieData = {
        init: initMovieData,
        getMovies: () => movies,
        addMovie: (movie) => mockApiRequest('ADD', movie),
        deleteMovie: (id) => mockApiRequest('DELETE', id),
        toggleFavorite: (id) => mockApiRequest('TOGGLE_FAVORITE', id),
        refresh: () => mockApiRequest('GET')
    };
    // Инициализация при загрузке
    initMovieData();
});