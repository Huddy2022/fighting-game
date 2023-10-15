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
        displayRoundTwoButton();
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
        enemy.switchSprite('death');
        playerRoundsWon++;
        displayStars(1, '#playerStars');
        displayRoundTwoButton();
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins';
        enemy.switchSprite('idle');
        enemyRoundsWon++;
        displayStars(1, '#enemyStars');
        displayRoundTwoButton();
    }
}

function displayStars(roundsWon, elementId) {
    const starsContainer = document.querySelector(elementId);
    starsContainer.innerHTML = '';

    if (roundsWon > 0) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        star.style.marginTop = '60px';
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