// Интерактив и UX
$(document).ready(function() {
    // Показ деталей фильма
    function showMovieDetails(movieId) {
        const movie = movieData.getMovies().find(m => m.id === movieId);
        if (!movie) return;
        Swal.fire({
            title: movie.title,
            html: `
                <div class="movie-details">
                    <img src="${movie.poster}" alt="${movie.title}" style="max-width: 200px; margin-bottom: 20px;">
                    <p><strong>Год:</strong> ${movie.year}</p>
                    <p><strong>Жанр:</strong> ${movie.genre}</p>
                    <p><strong>Рейтинг:</strong> ${movie.rating}</p>
                    <p><strong>Описание:</strong></p>
                    <p>${movie.description}</p>
                </div>
            `,
            confirmButtonText: 'Закрыть',
            width: '600px'
        });
    }
    // Подтверждение удаления
    function confirmDelete(movieId) {
        const movie = movieData.getMovies().find(m => m.id === movieId);
        if (!movie) return;
        Swal.fire({
            title: 'Удалить фильм?',
            text: `Вы уверены, что хотите удалить "${movie.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена'
        }).then((result) => {
            if (result.isConfirmed) {
                movieData.deleteMovie(movieId);
                toastr.success(`Фильм "${movie.title}" удален`);
            }
        });
    }
    // Анимации
    function setupAnimations() {
        $(document).on('movieAdded', function(e, movie) {
            $(`.movie-card[data-id="${movie.id}"]`)
                .hide()
                .fadeIn(1000);
        });
        $(document).on('movieDeleted', function(e, movieId) {
            $(`.movie-card[data-id="${movieId}"]`)
                .fadeOut(500, function() {
                    $(this).remove();
                });
        });
    }
    // Инициализация UI
    function initUI() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right'
        };
        
        setupAnimations();
    }
    // Публичный API модуля
    window.movieUI = {
        init: initUI,
        showMovieDetails: showMovieDetails,
        confirmDelete: confirmDelete
    };
});