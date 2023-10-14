let playerRoundsWon = 0;
let enemyRoundsWon = 0;

function rectangluarCollison({
    rectangle1,
    rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


function determineWinner({
    player,
    enemy,
    timerId
}) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';

    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
        displayNextRoundButton();
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
        enemy.switchSprite('death');
        playerRoundsWon++;
        displayStars(playerRoundsWon, '#playerStars');
        displayNextRoundButton();
        console.log(playerRoundsWon)
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins';
        enemy.switchSprite('idle');
        enemyRoundsWon++;
        displayStars(enemyRoundsWon, '#enemyStars');
        displayNextRoundButton();
    }

}

function displayGameResult(playerRoundsWon, enemyRoundsWon) {
    // Determine and display the overall game result (e.g., "Player Wins" or "Enemy Wins")
    // Reset playerRoundsWon and enemyRoundsWon if you want to play another game
    if (playerRoundsWon >= 2) {
        document.querySelector('#displayText').innerHTML = 'Player Wins the Game!';
        playerRoundsWon = 0;
        enemyRoundsWon = 0;
        // Redirect to index.html or handle game over logic here
    } else if (enemyRoundsWon >= 2) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins the Game!';
        playerRoundsWon = 0;
        enemyRoundsWon = 0;
        // Redirect to index.html or handle game over logic here
    }
    // You can redirect to index.html or handle game over logic here
}

function displayStars(roundsWon, elementId) {
    const starsContainer = document.querySelector(elementId);
    starsContainer.innerHTML = '';

    for (let i = 0; i < roundsWon; i++) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        starsContainer.appendChild(star);
    }
}


let timer = 60
let timerId

function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({
            player,
            enemy,
            timerId
        })
    }
}