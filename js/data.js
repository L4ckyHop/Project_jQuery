//Модуль работы с данными фильмов
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
});