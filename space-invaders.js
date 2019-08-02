var aliens = [];
var bullets = [];
var hits = 0;
var miss = 0;
var currentAliensPos = 0;

// get HTML elements
var body = document.getElementsByTagName('body')[0];
var ship = document.getElementById('ship');
var message = document.getElementById('message');
var hitsTxt = document.getElementById('hits');
var missTxt = document.getElementById('miss');

// create array of random aliens
for(var i=0; i<20; i++) {
	var type = Math.floor(Math.random() * 3) + 1;
	var posX = Math.floor(Math.random() * (window.innerWidth - 100)) + 0;
	var posY = Math.floor(Math.random() * 200) + 0;

	var alien = document.createElement('div');
	alien.classList.add('enemy');
	alien.classList.add('e'+type);
	alien.style.top = posY + 'px';
	alien.style.left = posX + 'px';

	aliens.push(alien);
	body.appendChild(alien);
}

// animate the aliens
var animateAliens = setInterval(function() {
	currentAliensPos = Math.abs(currentAliensPos - 50);
	aliens.forEach(function(alien) {
		alien.style.backgroundPositionX = currentAliensPos+'px';
	});
}, 1000);

// move the aliens
var moveAliens = setInterval(function() {
	aliens.forEach(function(alien) {
		var alienBounds = alien.getBoundingClientRect();

		// check if game over
		if(alienBounds.top >= window.innerHeight - 150) {
			stopGame("Aliens Killed YOU");
			return;
		}

		// decide what the alien does
		var think = Math.floor(Math.random() * 3) - 1;
		var spaceX = Math.floor(Math.random() * 100) + 1;

		// calculate new X position
		var posX = alienBounds.left + spaceX * think;
		if(posX <= 10 || posX >= window.innerWidth - 50) return;

		// move the alien
		alien.style.top = alienBounds.top + 50 + 'px';
		alien.style.left = posX + 'px';
	});
}, 1500);

// treat bullets
var animateBullets = setInterval(function() {
	bullets.forEach(function(bullet, i) {
		// get bounds of a bullet
		var bulletBounds = bullet.getBoundingClientRect();

		// when bullets get to the top
		if(bulletBounds.top < 0) {
			// remove bullet from the screen
			bullets.splice(i, 1);
			body.removeChild(bullet);

			// increase the miss counter
			missTxt.innerHTML = "Miss: " + (++miss);
		}

		// collisions to aliens
		aliens.forEach(function(alien, j) {
			var alienBounds = alien.getBoundingClientRect();
			if(
				bulletBounds.top <= alienBounds.bottom &&
				bulletBounds.left >= alienBounds.left &&
				bulletBounds.left <= alienBounds.right
			){
				// remove bullet (if still on screen)
				if (bullet.parentNode == body) {
					bullets.splice(i, 1);
					body.removeChild(bullet);
				}

				// increate the hits counter
				hitsTxt.innerHTML = "Hits: " + (++hits);

				// take alien out of the game
				aliens.splice(j, 1);
				body.removeChild(alien);

				// show explosion animation
				var bum = document.createElement('div');
				bum.classList.add('explosion');
				bum.style.top = alienBounds.top + 'px';
				bum.style.left = alienBounds.left + 'px';
				body.appendChild(bum);

				// remove explosion animation
				setTimeout(function(){
					body.removeChild(bum);
				}, 1000);

				// create a winning condition
				if(aliens.length <= 0) {
					stopGame("You saved the day!");
					return;
				}
			}
		});
	});
}, 100);

// activate the ship
body.addEventListener('keydown', shipActions);

// move ship and fire when you press a key
function shipActions(e) {
	// get the bounds of the ship
	var bounds = ship.getBoundingClientRect();

	// left arrow
	if (e.keyCode == '37') {
		if(bounds.x - 20 <= 0) return;
		ship.style.left = (bounds.x - 20) + 'px';
	}

	// right arrow
	if (e.keyCode == '39') {
		if(bounds.x + 100 >= window.innerWidth) return;
		ship.style.left = (bounds.x + 20) + 'px';
	}

	// space bar
	if (e.keyCode == '32') {
		var bullet = document.createElement('div');
		bullet.classList.add('bullet');
		bullet.style.left = (bounds.x + 32) + 'px';

		bullets.push(bullet);
		body.appendChild(bullet);
	}
}

// end game and show message
function stopGame(msg) {
	// stop the game timers
	clearInterval(animateAliens);
	clearInterval(moveAliens);
	clearInterval(animateBullets);

	// stop moving and firing the ship
	body.removeEventListener('keydown', shipActions);

	// display the message
	message.innerHTML = msg;
	message.style.display = "block";
}
