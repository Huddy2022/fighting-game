const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gamer = localStorage.getItem('playerName');

let playerData = {
    playerName: gamer,
    roundsWon: 0,
    totalGameTime: 0,
    score: 0,
};

canvas.width = 1024
canvas.height = 673

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const gravity = 0.7

const ghost = new Sprite({
    position: {
        x: 875,
        y: 350
    },
    imageSrc: './img/ghost.png',
    scale: 2.5,
    framesMax: 4
})

const fireSkull = new Sprite({
    position: {
        x: 70,
        y: 380
    },
    imageSrc: './img/fire-skull.png',
    scale: 1,
    framesMax: 8
})

const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samurai/Idle.png',
    scale: 3.5,
    framesMax: 8,
    damageAmount: 5,
    offset: {
        x: 320,
        y: 250
    },
    sprites: {
        idle: {
            imageSrc: './img/samurai/Idle.png',
            framesMax: 8
        },
        idleReverse: {
            imageSrc: './img/samurai/IdleReverse.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samurai/Run.png',
            framesMax: 8,
        },
        runReverse: {
            imageSrc: './img/samurai/runReverse.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samurai/Jump.png',
            framesMax: 2,
        },
        jumpReverse: {
            imageSrc: './img/samurai/jumpReverse.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samurai/Fall.png',
            framesMax: 2,
        },
        fallReverse: {
            imageSrc: './img/samurai/fallReverse.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samurai/Attack1.png',
            framesMax: 6,
        },
        attackReverse: {
            imageSrc: './img/samurai/AttackReverse.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samurai/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        takeHitReverse: {
            imageSrc: './img/samurai/Take Hit - white silhouette Reverse.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samurai/Death.png',
            framesMax: 6,
        },
        deathReverse: {
            imageSrc: './img/samurai/DeathReverse.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/wizard/idle.png',
    scale: 3.5,
    framesMax: 8,
    damageAmount: 5,
    offset: {
        x: 375,
        y: 407
    },
    sprites: {
        idle: {
            imageSrc: './img/wizard/idle.png',
            framesMax: 8
        },
        idleReverse: {
            imageSrc: './img/wizard/idleReverse.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/wizard/run.png',
            framesMax: 8,
        },
        runReverse: {
            imageSrc: './img/wizard/RunReverse.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/wizard/jump.png',
            framesMax: 2,
        },
        jumpReverse: {
            imageSrc: './img/wizard/JumpReverse.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/wizard/fall.png',
            framesMax: 2,
        },
        fallReverse: {
            imageSrc: './img/wizard/FallReverse.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/wizard/attack1.png',
            framesMax: 8,
        },
        attackReverse: {
            imageSrc: './img/wizard/AttackReverse.png',
            framesMax: 8,
        },
        takeHit: {
            imageSrc: './img/wizard/take_hit.png',
            framesMax: 3,
        },
        takeHitReverse: {
            imageSrc: './img/wizard/TakeHitReverse.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/wizard/death.png',
            framesMax: 7,
        },
        deathReverse: {
            imageSrc: './img/wizard/DeathReverse.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -200,
            y: 50
        },
        width: 150,
        height: 50
    },
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}

let enemyAttackCooldown = 0;
let attackCooldownDuration = 60; // Cooldown duration in frames (assuming 60 FPS)


function updateEnemyAI() {

    const playerPositionX = player.position.x;
    const enemyPositionX = enemy.position.x;
    const distanceToPlayer = Math.abs(playerPositionX - enemyPositionX);

    // Check if the enemy is on the ground
    const isEnemyOnGround = enemy.position.y === 473;

    if (isEnemyOnGround) {
        // Follow the player horizontally while maintaining a distance
        if (distanceToPlayer > 100) {
            if (playerPositionX < enemyPositionX) {
                enemy.velocity.x = -3;
                enemy.switchSprite('run'); // Move left
            } else if (playerPositionX > enemyPositionX) {
                enemy.velocity.x = 3; // Move right
                enemy.switchSprite('runReverse');
            }
        } else {
            enemy.velocity.x = 0; // Stop moving horizontally if too close to the player
        }

        // Implement attacking behavior with cooldown
        if (distanceToPlayer < 175 && enemyAttackCooldown <= 0) {
            // If the player is within attack range and the cooldown has expired, perform an attack
            enemy.attack();
            enemyAttackCooldown = attackCooldownDuration; // Set the cooldown
        }

        // Reduce attack cooldown
        enemyAttackCooldown = Math.max(0, enemyAttackCooldown - 1);

        // Implement jumping behavior (less frequent)
        if (Math.random() < 0.005 && isEnemyOnGround) {
            // Jump with a small probability (0.5% chance) if the enemy is on the ground
            enemy.velocity.y = -15; // Adjust the jump height by changing the vertical velocity
        }

        // Handle enemy attacks only if it is not taking a hit
        if (!enemy.isTakingHit) {
            // Implement attacking behavior with cooldown
            if (distanceToPlayer < 100 && enemyAttackCooldown <= 0) {
                enemy.attack();
                enemyAttackCooldown = attackCooldownDuration;
            }

            // Detect for collision & player get hit
            if (rectangluarCollison({
                    rectangle1: enemy,
                    rectangle2: player
                }) && enemy.isAttacking && enemy.frameCurrent === 4) {
                if (player.lastKey === 'a') {
                    player.switchSprite('takeHitReverse');
                } else {
                    player.switchSprite('takeHit');
                }

                player.takeHit(enemy);
                enemy.isAttacking = false;
                gsap.to('#playerHealth', {
                    width: player.health + '%'
                });

                if (enemy.health <= 0 || player.health <= 0) {
                    determineWinner({
                        player,
                        enemy,
                        timerId,
                    });
                }
            }
        }
    }

    // Update the enemy's position
    enemy.update();
}

let preGameTimer = 3;
let preGameText = 'FIGHT!';
let preGameTimerId;

function startPreGameTimer() {
    const preGameTextElement = document.querySelector('#preGameText');
    preGameTimerId = setInterval(() => {
        if (preGameTimer > 0) {
            document.querySelector('#preGameTimer').innerHTML = preGameTimer;
            preGameTimer--;
        } else {
            preGameTextElement.innerHTML = preGameText;
            document.querySelector('#preGameTimer').style.display = 'none';
            clearInterval(preGameTimerId);

            // Optionally: Hide the preGameText after a short delay
            setTimeout(() => {
                preGameTextElement.style.display = 'none';
                startGame();
            }, 1000);
        }
    }, 1000);
}

function startGame() {
    decreaseTimer();
    animate();
}

function animate() {

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    ghost.update()
    fireSkull.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.05)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    // Update the enemy's AI
    updateEnemyAI();

    //enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    if (escapeKeyPressed) {
        window.location.href = 'index.html';
    }

    //Player movemnet
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('runReverse')
        player.attackBox.offset.x = -200
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
        player.attackBox.offset.x = 100
    } else {
        if (player.lastKey === 'a') {
            player.switchSprite('idleReverse');

        } else {
            player.switchSprite('idle');

        }
    }

    //Player Jump
    if (player.velocity.y < 0 && player.lastKey === 'a') {
        player.switchSprite('jumpReverse')
    } else if (player.velocity.y < 0 && player.lastKey === 'd') {
        player.switchSprite('jump')
    }

    // Player Fall
    if (player.velocity.y > 0 && player.lastKey === 'a') {
        player.switchSprite('fallReverse')
    } else if (player.velocity.y > 0 && player.lastKey === 'd') {
        player.switchSprite('fall')
    }

    // Detect for collision & enemy get hit
    if (rectangluarCollison({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.frameCurrent === 4) {
        if (player.lastKey === 'a') {
            enemy.switchSprite('takeHitReverse');
        } else {
            enemy.switchSprite('takeHit');
        }
        enemy.takeHit(player)
        player.velocity.x = -3;
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // If player misses

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({
            player,
            enemy,
            timerId
        })

    }



}

function displayNextRoundButton(player,
    enemy) {
    const roundTwoButton = document.getElementById('startRoundTwo');
    const tryAgainButton = document.getElementById('tryAgain');

    if (player.health === enemy.health) {
        roundTwoButton.style.display = 'none';
        gameOver();
    } else if (player.health > enemy.health) {
        tryAgainButton.style.display = 'none';
        nextRound();
    } else if (enemy.health > player.health) {
        roundTwoButton.style.display = 'none';
        gameOver();
    }
}

// Call this function when the game is over
function saveLeaderboardData() {
    // Save player data to localStorage
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

function gameOver() {
    const tryAgainButton = document.getElementById('tryAgain');
    const gameEndTimeElement = document.getElementById('timer');
    const gameEndTime = parseInt(gameEndTimeElement.textContent, 10);
    const gameStartTime = 60;

    playerData.roundsWon = 0;

    playerData.totalGameTime = gameStartTime - gameEndTime;

    // Calculate total score
    const maxGameTime = 60; // Maximum game time in seconds
    const minScore = 1; // Minimum score
    const maxScore = 600; // Maximum score

    // Calculate the normalized game time (from 0 to 1)
    const normalizedGameTime = Math.max(0, Math.min(1, playerData.totalGameTime / maxGameTime));

    // Calculate the score using a linear interpolation
    const totalScore = Math.round((1 - normalizedGameTime) * (maxScore - minScore) + minScore);

    playerData.score = totalScore;

    // Save leaderboard data
    saveLeaderboardData();

    // Store totalGameTime in localStorage
    localStorage.setItem('totalGameTime', playerData.totalGameTime);

    // Store score in localStorage
    localStorage.setItem('score', playerData.score);

    tryAgainButton.style.display = 'block';

}

function nextRound() {
    const roundTwoButton = document.getElementById('startRoundTwo');
    const gameEndTimeElement = document.getElementById('timer');
    const gameEndTime = parseInt(gameEndTimeElement.textContent, 10);
    const gameStartTime = 60;

    playerData.roundsWon = 0;

    playerData.totalGameTime = gameStartTime - gameEndTime;

    // Calculate total score
    const maxGameTime = 60; // Maximum game time in seconds
    const minScore = 1; // Minimum score
    const maxScore = 600; // Maximum score

    // Calculate the normalized game time (from 0 to 1)
    const normalizedGameTime = Math.max(0, Math.min(1, playerData.totalGameTime / maxGameTime));

    // Calculate the score using a linear interpolation
    const totalScore = Math.round((1 - normalizedGameTime) * (maxScore - minScore) + minScore);

    playerData.score = totalScore;

    // Save leaderboard data
    saveLeaderboardData();

    // Store totalGameTime in localStorage
    localStorage.setItem('totalGameTime', playerData.totalGameTime);

    // Store score in localStorage
    localStorage.setItem('score', playerData.score);

    roundTwoButton.style.display = 'block';

}

function newGame() {
    playerRoundsWon = 0;
    enemyRoundsWon = 0;
    player.health = 100; // Reset player health
    enemy.health = 100; // Reset enemy health

    // Show the canvas and hide the pre-game timer
    document.querySelector('#preGameTimer').style.display = 'block';

    player.dead = false;
    enemy.dead = false;

    // Start the pre-game timer
    startPreGameTimer();

}
newGame();

let escapeKeyPressed = false;

window.addEventListener('keydown', (event) => {

    if (event.key === 'Escape') {
        escapeKeyPressed = true;
        // Clear the player's data from localStorage
        localStorage.removeItem('playerData');
    }

    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                if (player.lastKey === 'a') {
                    player.attack2();
                } else {
                    player.attack();
                }
                break;

        }
    }
})

window.addEventListener('keyup', (event) => {

    if (event.key === 'Escape') {
        escapeKeyPressed = false;
    }

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})