//Makes the card and the swipe. Steven Peralta
class Card {
	constructor({
		imageUrl,
		onDismiss,
		onLike,
		onDislike
	}) {
		this.imageUrl = imageUrl;
		this.onDismiss = onDismiss;
		this.onLike = onLike;
		this.onDislike = onDislike;
		this.#init();
		console.log('Creating card with image URL: ', imageUrl);
	}

	publicDismiss(direction){
		this.#dissmiss(direction);
	}

	//private properties
	#startPoint;
	#offsetX;
	#offsetY;


	// Private methods
	#init = ()=>{
		const card = document.createElement('div');
		card.classList.add('card');
		const img = document.createElement('img');
		img.src = this.imageUrl;
		card.append(img);
		this.element = card;
		this.#listenToMouseEvent();
	}

	#listenToMouseEvent = () => {
		//mousedown
		this.element.addEventListener('mousedown', e => {
			const { clientX, clientY } = e;
			this.#startPoint = { x: clientX, y: clientY };
			// no transition when moving
			this.element.style.transition = '';
			document.addEventListener('mousemove', this.#handleMouseMove);
		});

		//mouseup
		document.addEventListener('mouseup', this.#handleMouseUp);

		//prevent drag
		this.element.addEventListener('dragstart', e => {e.preventDefault();
		});	
	}

	#handleMouseMove = (e) => {
	    if (!this.#startPoint) return;
	    const { clientX, clientY } = e;
	    this.#offsetX = clientX - this.#startPoint.x;
	    this.#offsetY = clientY - this.#startPoint.y;
	    
	    const rotate = this.#offsetX * 0.1;

	    this.element.style.transform = `translate(${this.#offsetX}px, ${this.#offsetY}px) rotate(${rotate}deg)`;
	
	    //dismiss card when moving too far away
	    if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.7)
		{
	    	const direction = this.#offsetX > 0 ? 1 : -1;
	    	this.#dissmiss(direction);
	    }
	}

	#handleMouseUp = (e) => {
		this.#startPoint = null;
		document.removeEventListener('mousemove', this.#handleMouseMove);
		// trasition when move back
		this.element.style.transition = 'transform 0.5s';
		this.element.style.transform = '';
	}

	/*
	#cloneCard = () => {
        const clonedCard = this.element.cloneNode(true);

        // Remove the dismissing class and transform style
        clonedCard.classList.remove('dismissing');
        clonedCard.style.transition = '';
        clonedCard.style.transform = '';

        // Add a class or modify styles as needed for the left container
        clonedCard.classList.add('liked-card');

        // Add a click event listener for removal
        clonedCard.addEventListener('click', () => {
            const confirmRemove = window.confirm('Remove from watch list?');
            if (confirmRemove) {
                this.#removeClonedCard(clonedCard);
            }
        });

        return clonedCard;
    }

    #removeClonedCard = (cardToRemove) => {
        // Remove the clicked cloned card from the left container
        cardToRemove.remove();

        // Trigger onDismiss callback if provided
        if (typeof this.onDismiss === 'function') {
            this.onDismiss();
        }
    }
	*/

	#dissmiss = (direction) => {
		this.#startPoint = null;
		document.removeEventListener('mouseup', this.#handleMouseUp);
		document.removeEventListener('mousemove', this.#handleMouseMove);

		this.element.style.transition = 'transform 1s';
		this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.#offsetY}px) rotate(${90 * direction}deg)`;
		this.element.classList.add('dismissing');
		setTimeout(() => {
			this.element.remove();
			const index = cards.indexOf(this);
			if (index > -1){
				cards.splice(index, 1);
			}
		}, 1000);

		if (typeof this.onDismiss === 'function'){
			this.onDismiss();
		}
		if (typeof this.onDislike === 'function' && direction === 1){
			this.onDislike();
			console.log('remove');
		}
		if (typeof this.onLike === 'function' && direction === -1){
			this.onLike();
			const clonedCard = document.createElement('div');
			clonedCard.className = 'card liked-card';
			const img = document.createElement('img');
			img.src = this.imageUrl;
			clonedCard.appendChild(img);
			// 1 - Create var that holds current # of movie posters 
			// 2 - Only use GET requeset when tha var == 0
			// 3 - iF var != 0 when user makes decision on poster then decrement var by 1
			console.log('like');

			saveLikedCardsToLocalStorage(this.imageUrl);
			setTimeout(function() {
			  // Refresh the window after the delay
			  window.location.reload();
			}, 1000);
		}
	}
}

function saveLikedCardsToLocalStorage(cardUrl) {
  // Get the current liked cards from local storage or initialize an empty array
  const likedCards = JSON.parse(localStorage.getItem('likedCards')) || [];

  // Add the new card URL to the liked cards array
  likedCards.push(cardUrl);

  // Save the updated liked cards array back to local storage
  localStorage.setItem('likedCards', JSON.stringify(likedCards));
}

// DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');

const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres') || '[]');
const selectedPosters = JSON.parse(localStorage.getItem('selectedPosters') || '[]');
const genreIds = selectedGenres.map(genre => genre.split('-')[1]);
const genreFilter = genreIds.concat(selectedPosters).join('%7C');

// constants
const apiUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreFilter}`;
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTRhZjQ4YTRjZjlmYThkODA2OTA0ODM0ZDlhMDYyYiIsInN1YiI6IjY1MTRiYTI4OTNiZDY5MDEzOGZiZjQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E_AHqlFdOwGdJHZhcYHEFqsASC8XlhkxXAVvkrplQYI'; // Replace with your actual API key
const urls = [];

//variables
let posterCount = 0;
let df = [];
let cards = [];

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

let cardCount = localStorage.getItem('cardCount') ? parseInt(localStorage.getItem('cardCount')) : 0;

function appendNewCard() {
  console.log('Card count: ', cardCount, 'URLs length: ', urls.length);
  if(cardCount < urls.length) {
    const card = new Card({
      imageUrl: urls[cardCount],
      onDismiss: () => {
        cardCount++;
        localStorage.setItem('cardCount', cardCount.toString());
        appendNewCard();
        posterCount--;
        if (posterCount === 0) {
          fetchData(apiKey, 3).then(() => {
            posterCount = urls.length;
          });
        }
      },
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
    const cardElements = swiper.querySelectorAll('.card:not(.dismissing)');
    cardElements.forEach((cardElement, index) => {
      cardElement.style.setProperty('--i', index);
    });
	cards.push(card);
  }
}

// Function to make buttons swipe the card without needing to drag
function swipeCard(direction) {
  if (cards.length > 0) {
	const topCard = cards[cards.length - 1];
	const cardElement = topCard.element;

	cardElement.style.transition = 'transform 1s ease-out';
	cardElement.style.transform = `translateX(${direction * 100}vw) rotate(${direction * 70}deg)`;
	
	setTimeout(() => {
		topCard.publicDismiss(direction);
	}, 500);
  }
}

fetchData(apiKey, 10).then(() => {
    posterCount = urls.length
    appendNewCard();
});

// Event listeners
like.addEventListener('click', () => {
	swipeCard(-1);
});

dislike.addEventListener('click', () => {
	swipeCard(1);
});
