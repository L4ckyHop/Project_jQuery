// Фильтрация, сортировка и формы
$(document).ready(function() {
    const state = {
        search: '',
        genre: 'all',
        sort: 'none'
    };
    let genres = [];
    // Инициализация фильтров
    function initFilters() {
        // Получение уникальных жанров
        $(document).on('moviesDataReady', function(e, movies) {
            genres = [...new Set(movies.map(movie => movie.genre))];
            updateGenreFilter();
        });
        // Обработчики фильтров
        $('#search').on('input', function() {
            state.search = $(this).val().toLowerCase();
            applyFilters();
        });
        $('#genre-filter').change(function() {
            state.genre = $(this).val();
            applyFilters();
        });
        $('#sort-rating').click(function() {
            state.sort = state.sort === 'rating-desc' ? 'rating-asc' : 'rating-desc';
            applyFilters();
        });
        $('#sort-year').click(function() {
            state.sort = state.sort === 'year-desc' ? 'year-asc' : 'year-desc';
            applyFilters();
        });
        // Обработка формы добавления
        $('#add-movie-form').submit(function(e) {
            e.preventDefault();
            addNewMovie();
        });
        // Выбор постера
        $('.poster-options img').click(function() {
            $('#poster').val('img/' + $(this).data('name'));
        });
    }
    // Обновление фильтра по жанрам
    function updateGenreFilter() {
        const $genreFilter = $('#genre-filter');
        $genreFilter.empty().append('<option value="all">Все жанры</option>');
        
        genres.forEach(genre => {
            $genreFilter.append(`<option value="${genre}">${genre}</option>`);
        });
    }
    // Применение фильтров
    function applyFilters() {
        let filteredMovies = movieData.getMovies();
        // Фильтрация по поиску
        if (state.search) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.title.toLowerCase().includes(state.search)
            );
        }
        // Фильтрация по жанру
        if (state.genre !== 'all') {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genre === state.genre
            );
        }
        // Сортировка
        switch(state.sort) {
            case 'rating-desc':
                filteredMovies.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-asc':
                filteredMovies.sort((a, b) => a.rating - b.rating);
                break;
            case 'year-desc':
                filteredMovies.sort((a, b) => b.year - a.year);
                break;
            case 'year-asc':
                filteredMovies.sort((a, b) => a.year - b.year);
                break;
        }
        movieRenderer.renderMovies(filteredMovies);
    }
    // Добавление нового фильма
    function addNewMovie() {
        const newMovie = {
            title: $('#title').val(),
            year: parseInt($('#year').val()),
            genre: $('#genre').val(),
            rating: parseFloat($('#rating').val()),
            description: $('#description').val(),
            poster: $('#poster').val()
        };
        // Валидация
        if (!newMovie.title || !newMovie.genre) {
            toastr.error('Заполните обязательные поля');
            return;
        }
        if (newMovie.rating < 0 || newMovie.rating > 10) {
            toastr.error('Рейтинг должен быть от 0 до 10');
            return;
        }
        movieData.addMovie(newMovie);
        $('#add-movie-form')[0].reset();
        $('.tab').removeClass('active').first().addClass('active');
        $('.tab-content').removeClass('active');
        $('#movies-tab').addClass('active');
        toastr.success('Фильм успешно добавлен!');
    }
    // Публичный API модуля
    window.movieFilters = {
        init: initFilters
    };
});