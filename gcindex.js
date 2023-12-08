// this options variable allows us to implement our authorization token in one spot
// as the token can expire at any point, this lets us quickly update the key if need-be. :)
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRhZjQ4YTRjZjlmYThkODA2OTA0ODM0ZDlhMDYyYiIsInN1YiI6IjY1MTRiYTI4OTNiZDY5MDEzOGZiZjQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E_AHqlFdOwGdJHZhcYHEFqsASC8XlhkxXAVvkrplQYI'
    }
};

// variable for keeping track of active posters
let selectedPosterCount = 0;

// this function limits the number of selected genre checkboxes
function limitCheckboxes(checkboxes, limit) {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const checkedCheckboxes = document.querySelectorAll('.genre-checkbox:checked');
            
            if (checkedCheckboxes.length > limit) {
                event.preventDefault();
                checkbox.checked = false;
            }
        });
    });
}

// this function pulls genres from the TMDB and creates the genre buttons that behave as checkboxes
function fetchGenresAndCreateCheckboxes() {
    fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        .then(response => response.json())
        .then(data => {
            const genreList = data.genres;
            const genreContainer = document.getElementById('genre-container');

            genreList.forEach(genre => {
                const genreCheckbox = document.createElement('input');
                genreCheckbox.type = 'checkbox';
                genreCheckbox.id = `genre-${genre.id}`;
                genreCheckbox.className = 'genre-checkbox';

                const genreLabel = document.createElement('label');
                genreLabel.textContent = genre.name;
                genreLabel.htmlFor = `genre-${genre.id}`;
                genreLabel.className = 'genre-label';

                genreContainer.appendChild(genreCheckbox);
                genreContainer.appendChild(genreLabel);
            });

            // limit the number of selected genre checkboxes to 5
            const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
            limitCheckboxes(genreCheckboxes, 5);
        })
        .catch(err => console.error(err));
}

// this calls the function and creates the buttons (checkboxes).
fetchGenresAndCreateCheckboxes();

//fetching our movie/show list. link can be replaced from TMDB documentation at user discretion.
//also contains logic for checkbox limiting behavior. 
fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
    .then(response => response.json())
    .then(data => {
        const movieList = data.results;
        const posterContainer = document.getElementById('poster-container');

        movieList.forEach(movie => {
            //definining where exactly to find the poster part of the URL.
            if (movie.poster_path) {
                const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        
                // creating the image element of the poster and button, 
                //along with defining class names poster-image and poster-button.
                const imgElement = document.createElement('img');
                imgElement.src = posterUrl;
                imgElement.alt = movie.title;
                imgElement.className = 'poster-image';

                imgElement.dataset.genreIds = JSON.stringify(movie.genre_ids);
                const posterButton = document.createElement('div');
                posterButton.className = 'poster-button';
        
                // creating a click event listener to limit the number of selected posters to 5
                posterButton.addEventListener('click', () => {
                    if (posterButton.classList.contains('checked')) {
                        posterButton.classList.remove('checked');
                        selectedPosterCount--;
                    } else if (selectedPosterCount < 5) {
                        posterButton.classList.add('checked');
                        selectedPosterCount++;
                    }
                });
        
                posterButton.appendChild(imgElement);
                posterContainer.appendChild(posterButton);
            }
        });

        // limit the number of selected movie checkboxes to 5
        const posterButtons = document.querySelectorAll('.poster-button');
        limitCheckboxes(posterButtons, 5);
    })
    .catch(err => console.error(err));

let selectedGenres = [];
//gets the user's selected genres and stores them in local storage
function getUserGenreChoices() {
    var checkboxes = document.getElementsByClassName('genre-checkbox');
    for(var i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].checked == true)
            selectedGenres.push(checkboxes[i].id);
    }
    localStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
}
let selectedPosters = [];

function getUserPosterChoices() {
    var posterButtons = document.getElementsByClassName('poster-button');

    // Create an array to store unique genre IDs
    let uniqueGenreIds = [];

    for (var i = 0; i < posterButtons.length; i++) {
        if (posterButtons[i].classList.contains('checked')) {
            let genreIds = JSON.parse(posterButtons[i].children[0].dataset.genreIds);
            
            // Add the first genre ID to the array
            if (genreIds.length > 0) {
                uniqueGenreIds.push(genreIds[0]);
            }
        }
    }

    // Filter out duplicate genre IDs
    uniqueGenreIds = [...new Set(uniqueGenreIds)];

    // Store the unique genre IDs in the selectedPosters array
    selectedPosters = uniqueGenreIds;

    // Store the selectedPosters array in local storage
    localStorage.setItem('selectedPosters', JSON.stringify(selectedPosters));
}
