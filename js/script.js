$(document).ready(function() {
    // Данные фильмов
    const mockMovies = [
        {
            id: 1,
            title: "Пять Ночей с Фредди",
            year: 2014,
            genre: "Ужасы",
            rating: 8.6,
            description: "Погрузитесь в страшную атмосферу пиццерии Фредди Фазбера",
            poster: "img/fnaf.jpg",
            isFavorite: true
        },
        {
            id: 2,
            title: "Фильм",
            year: 2025,
            genre: "Фантастика",
            rating: 8.7,
            description: "Невероятный фильм, который основан на реальных событиях",
            poster: "https://example.com/posters/inception.jpg",
            isFavorite: false
        }
    ];
    //Функция рендеринга карточек фильмов
    function renderMovies(movies) {
        const $container = $('#movies-container');
        $container.empty();
        movies.forEach(movie => {
            const favoriteClass = movie.isFavorite ? 'active' : '';
            const movieCard = `
                <div class="movie-card" data-id="${movie.id}">
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">
                            <span>${movie.year}</span> | 
                            <span>${movie.genre}</span> | 
                            <span>★ ${movie.rating}</span>
                        </div>
                        <p class="description">${movie.description}</p>
                    </div>
                    <div class="movie-actions">
                        <button class="btn favorite-btn ${favoriteClass}" 
                                data-id="${movie.id}">★</button>
                        <button class="btn delete-btn" 
                                data-id="${movie.id}">Удалить</button>
                    </div>
                </div>
            `;
            $container.append(movieCard);
        });
        // Назначаем обработчики событий
        bindEvents();
    }
    //Назначение обработчиков событий
    function bindEvents() {
        //Обработчик для кнопки "Удалить"
        $('.delete-btn').click(function() {
            const movieId = $(this).data('id');
            if (window.confirmDeleteMovie) {
                window.confirmDeleteMovie(movieId);
            }
        });
        //Обработчик для кнопки "Избранное"
        $('.favorite-btn').click(function() {
            const movieId = $(this).data('id');
            const isFavorite = !$(this).hasClass('active');
            
            if (window.toggleFavoriteMovie) {
                window.toggleFavoriteMovie(movieId, isFavorite);
            }
            // Визуальная обратная связь
            $(this).toggleClass('active', isFavorite);
        });
    }
    // Инициализация рендеринга
    renderMovies(mockMovies);
    //API для других модулей
    window.movieRenderer = {
        renderMovies: renderMovies
    };
});