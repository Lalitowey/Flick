// DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');


// constants
const apiUrl = 'https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc';
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRhZjQ4YTRjZjlmYThkODA2OTA0ODM0ZDlhMDYyYiIsInN1YiI6IjY1MTRiYTI4OTNiZDY5MDEzOGZiZjQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E_AHqlFdOwGdJHZhcYHEFqsASC8XlhkxXAVvkrplQYI'; // Replace with your actual API key
const urls = [];


//variables
let cardCount = 0;

//functions
function fetchImages() {
  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      // Extract image URLs from the API response
      const results = data.results;
      if (results && results.length > 0) {
        const imageUrls = results.map(result => `https://image.tmdb.org/t/p/w500/${result.poster_path}`);
        // Update the urls array with the new image URLs
        urls.splice(0, urls.length, ...imageUrls);

        // Append the new cards with the fetched image URLs
        for (let i = 0; i < 10; i++) {
          appendNewCard();
        }
      } else {
        console.error('No results found in the API response.');
      }
    })
    .catch(error => console.error('Error fetching images:', error));
}

function appendNewCard() {
  const card = new Card({
    imageUrl: urls[cardCount % 10],
    onDismiss: appendNewCard,
    onLike: () => {
      like.style.animationPlayState = 'running';
      like.classList.toggle('trigger');
    },
    onDislike: () => {
      dislike.style.animationPlayState = 'running';
      dislike.classList.toggle('trigger');
    },
  });
  swiper.append(card.element);
  cardCount++;

  const cards = swiper.querySelectorAll('.card:not(.dismissing)');
  cards.forEach((card, index) => {
    card.style.setProperty('--i', index);
  });
}

// Initial fetch and card creation
fetchImages();