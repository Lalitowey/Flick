// this options variable allows us to implement our authorization token in one spot
// as the token can expire at any point, this lets us quickly update the key if need-be. :)
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'PLACE API TOKEN HERE'
    }
  };

  // this function pulls genres from the TMDB and creates the genre buttons
  function fetchGenresAndCreateButtons() {
    fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        .then(response => response.json())
        .then(data => {
            const genreList = data.genres;
            const genreContainer = document.getElementById('genre-container');

            genreList.forEach(genre => {
                const genreButton = document.createElement('button');
                genreButton.textContent = genre.name;
                genreButton.className = 'genre-button';

                genreContainer.appendChild(genreButton);
            });
        })
        .catch(err => console.error(err));
}

// this calls the function and creates the buttons.
fetchGenresAndCreateButtons();
  

//fetching our movie/show list. link can be replaced from TMDB documentation at user discretion.
  fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
    .then(response => response.json())
    .then(data => {
      const movieList = data.results;

    const posterContainer = document.getElementById('poster-container');

    movieList.forEach(movie => {
      //definining where exactly to find the poster part of the URL.
      if (movie.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

        const posterButton = document.createElement('a');
        posterButton.href = `https://www.themoviedb.org/movie/${movie.id}`;
        posterButton.target = '_blank';
        posterButton.className = 'poster-button';

        // creating the image element of the poster.
        const imgElement = document.createElement('img');
        imgElement.src = posterUrl;
        imgElement.alt = movie.title;
        
        // this line creates a CSS class that lets us resize the image of the posters in the style.css file.
        imgElement.className = 'poster-image';

        posterButton.appendChild(imgElement);
        posterContainer.appendChild(posterButton);
      }
    });
  })
    .catch(err => console.error(err));
  