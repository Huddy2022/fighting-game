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
        displayNextRoundButton(player, enemy);
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player Wins';
        enemy.switchSprite('death');
        playerRoundsWon++;
        displayNextRoundButton(player, enemy);
        enemy.dead;
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Wins';
        enemy.switchSprite('idle');
        player.switchSprite('death');
        enemyRoundsWon++;
        displayStars(1, '#enemyStars');
        displayNextRoundButton(player, enemy);
        player.dead;
    }
}

function displayStars(count, elementId) {
    const starsContainer = document.querySelector(elementId);
    starsContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        star.style.marginTop = '60px';

        // Adjust the margin-right to create space between stars
        star.style.marginRight = '5px';

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