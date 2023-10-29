// this options variable allows us to implement our authorization token in one spot
// as the token can expire at any point, this lets us quickly update the key if need-be. :)
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRhZjQ4YTRjZjlmYThkODA2OTA0ODM0ZDlhMDYyYiIsInN1YiI6IjY1MTRiYTI4OTNiZDY5MDEzOGZiZjQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E_AHqlFdOwGdJHZhcYHEFqsASC8XlhkxXAVvkrplQYI'
    }
  };

//populates center
  fetch('https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(response => response.json())
    .then(data => {
        const movieList = data.results;
        const posterContainer = document.getElementById('poster-container');

        movieList.forEach((movie, index) => {
            if (movie.poster_path) {
                const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

                // Create an image element for the poster
                const imgElement = document.createElement('img');
                imgElement.src = posterUrl;
                imgElement.alt = movie.title;
                imgElement.className = 'poster-image';

                posterContainer.appendChild(imgElement);

                // Display up to 5 posters (modify as needed)
                if (index >= 4) {
                    return;
                }
            }
        });
    })
    .catch(err => console.error(err));

//populates sidebar

    const postersSidenav = document.getElementById('movie-posters-sidenav');

fetch('https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc', options)
    .then(response => response.json())
    .then(data => {
        const movieList = data.results;

        movieList.forEach((movie, index) => {
            if (movie.poster_path && index < 18) {
                const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

                // Create an image element for the poster
                const imgElement = document.createElement('img');
                imgElement.src = posterUrl;
                imgElement.alt = movie.title;
                imgElement.className = 'sidenav-poster';

                postersSidenav.appendChild(imgElement);
            }
        });
    })
    .catch(err => console.error(err));
