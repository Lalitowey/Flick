// DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');

const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres') || '[]');
const genreIds = selectedGenres.map(genre => genre.split('-')[1]);
const genreFilter = genreIds.join('%7C');

// constants
const apiUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreFilter}`;
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRhZjQ4YTRjZjlmYThkODA2OTA0ODM0ZDlhMDYyYiIsInN1YiI6IjY1MTRiYTI4OTNiZDY5MDEzOGZiZjQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E_AHqlFdOwGdJHZhcYHEFqsASC8XlhkxXAVvkrplQYI'; // Replace with your actual API key
const urls = [];

//variables
let cardCount = parseInt(localStorage.getItem('cardCount')) || 0;
let df = [];
//functions
async function fetchData(apiKey, totalPages) {
    for (let i = 1; i <= totalPages; i++) {
      const url = `${apiUrl}&page=${i}`;
  
      try {
        const response =  await fetch(url, {  
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = await response.json();
        const results = data.results;
  
        df = df.concat(results);
        const imageUrls = results.map(result => `https://image.tmdb.org/t/p/w500/${result.poster_path}`);
        urls.push(...imageUrls);
        console.log('Fetched image URLS: ', imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
  }
}

function appendNewCard() {
  console.log('Card count: ', cardCount, 'URLs length: ', urls.length);
  if (cardCount < urls.length){
    const card = new Card({
      imageUrl: urls[cardCount],
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
    console.log('Appending new card with URL: ', urls[cardCount])
    // Save cardCount to localStorage
    localStorage.setItem('cardCount', cardCount.toString());
  }
}

// Initial fetch and card creation
fetchData(apiKey, 3).then(() => {
  for (let i = 0; i < 10; i++) {
    appendNewCard();
  }
});
