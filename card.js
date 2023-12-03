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
	    if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.7) {
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

	#dissmiss = (direction) => {
		this.#startPoint = null;
		document.removeEventListener('mouseup', this.#handleMouseUp);
		document.removeEventListener('mousemove', this.#handleMouseMove);

		this.element.style.transition = 'transform 1s';
		this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.#offsetY}px) rotate(${90 * direction}deg)`;
		this.element.classList.add('dismissing');
		setTimeout(() => {
			this.element.remove();
		}, 1000);

		if (typeof this.onDismiss === 'function'){
			this.onDismiss();
		}
		if (typeof this.onDislike === 'function' && direction === 1){
			this.onDislike();
			console.log('remove')
		}
		if (typeof this.onLike === 'function' && direction === -1){
			this.onLike();
			console.log('like')

			 saveLikedCardsToLocalStorage(this.imageUrl);
			 window.location.reload();
			const likedCardsContainer = document.getElementById('liked-cards-container');
    		const clonedCard = this.#cloneCard();
    		likedCardsContainer.appendChild(clonedCard);
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
