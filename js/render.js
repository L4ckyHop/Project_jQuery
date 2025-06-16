// Рендеринг фильмов
$(document).ready(function() {
    function renderMovies(movies, containerId = '#movies-container') {
        const $container = $(containerId);
        $container.empty();
        if (movies.length === 0) {
            $container.html('<p class="no-results">Фильмы не найдены</p>');
            return;
        }
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
                        <button class="btn details-btn" 
                                data-id="${movie.id}">Подробнее</button>
                        <button class="btn delete-btn" 
                                data-id="${movie.id}">Удалить</button>
                    </div>
                </div>
            `;
            $container.append(movieCard);
        });
    }
    function renderFavorites() {
        const favorites = movieData.getFavorites();
        renderMovies(favorites, '#favorites-container');
    }
    function initRenderer() {
        // Обработчики событий
        $(document).on('click', '.favorite-btn', function() {
            const movieId = $(this).data('id');
            movieData.toggleFavorite(movieId);
        });
        $(document).on('click', '.delete-btn', function() {
            const movieId = $(this).data('id');
            movieUI.confirmDelete(movieId);
        });
        $(document).on('click', '.details-btn', function() {
            const movieId = $(this).data('id');
            movieUI.showMovieDetails(movieId);
        });
        // Подписка на события данных
        $(document).on('moviesDataReady', function(e, movies) {
            renderMovies(movies);
        });
        $(document).on('movieAdded favoriteToggled movieDeleted', function() {
            renderMovies(movieData.getMovies());
            renderFavorites();
        });
        // Обработчик переключения вкладок
        $('.tab').click(function() {
            $('.tab').removeClass('active');
            $(this).addClass('active');
            $('.tab-content').removeClass('active');
            $(`#${$(this).data('tab')}-tab`).addClass('active');
            if ($(this).data('tab') === 'favorites') {
                renderFavorites();
            }
        });
    }
    // Публичный API модуля
    window.movieRenderer = {
        init: initRenderer,
        renderMovies: renderMovies,
        renderFavorites: renderFavorites
    };
});