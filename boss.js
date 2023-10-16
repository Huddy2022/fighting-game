const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 673

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background4.png'
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
    offset: {
        x: 320,
        y: 250
    },
    sprites: {
        idle: {
            imageSrc: './img/samurai/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samurai/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samurai/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samurai/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samurai/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samurai/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samurai/Death.png',
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
    imageSrc: './img/boss/idle.png',
    scale: 3.5,
    framesMax: 8,
    offset: {
        x: 375,
        y: 146
    },
    sprites: {
        idle: {
            imageSrc: './img/boss/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/boss/run.png',
            framesMax: 8,
        },
        attack1: {
            imageSrc: './img/boss/attack.png',
            framesMax: 10,
        },
        takeHit: {
            imageSrc: './img/boss/take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/boss/death.png',
            framesMax: 8,
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

console.log(player)

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

decreaseTimer()

let enemyAttackCooldown = 0;
let attackCooldownDuration = 60; // Cooldown duration in frames (assuming 60 FPS)

function updateEnemyAI() {

    const playerPositionX = player.position.x;
    const enemyPositionX = enemy.position.x;
    const distanceToPlayer = Math.abs(playerPositionX - enemyPositionX);

    // Check if the enemy is in the "death" state
    if (enemy.currentSprite === 'death') {
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;
        enemy.isAttacking = false;
        enemy.switchSprite('death');
        return;
    }

    // Follow the player horizontally while maintaining a distance

    if (distanceToPlayer > 200) {
        if (playerPositionX < enemyPositionX) {
            enemy.velocity.x = -5;
            enemy.switchSprite('run'); // Move left
        } else if (playerPositionX > enemyPositionX) {
            enemy.velocity.x = 5; // Move right
            enemy.switchSprite('run');
        }
    } else {
        enemy.velocity.x = 0; // Stop moving horizontally if too close to the player
    }

    // Implement attacking behavior with cooldown
    if (distanceToPlayer < 210 && enemyAttackCooldown <= 0) {
        // If the player is within attack range and the cooldown has expired, perform an attack
        enemy.attack();
        enemyAttackCooldown = attackCooldownDuration; // Set the cooldown
    }

    // Reduce attack cooldown
    enemyAttackCooldown = Math.max(0, enemyAttackCooldown - 1);

    // Implement jumping behavior (less frequent)
    if (Math.random() < 0.005 && enemy.position.y === 473) {
        // Jump with a small probability (0.5% chance) if the enemy is on the ground
        enemy.velocity.y = -15; // Adjust the jump height by changing the vertical velocity
    }

    // Update the enemy's position
    enemy.update();

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
            }) && enemy.isAttacking && enemy.frameCurrent === 5) {
            player.takeHit();
            enemy.isAttacking = false;
            gsap.to('#playerHealth', {
                width: player.health + '%'
            });

            if (enemy.health <= 0 || player.health <= 0) {
                determineWinner({
                    player,
                    enemy,
                    timerId
                });
            }
        }
    }
}

function animate() {
    window.requestAnimationFrame(animate)
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

    //Player movemnet
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //Player Jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy movemnet
    //if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    //    enemy.velocity.x = -5
    //    enemy.switchSprite('run')
    //} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    //    enemy.velocity.x = 5
    //    enemy.switchSprite('run')
    //} else {
    //    enemy.switchSprite('idle')
    //}

    // Enemy Jump
    //if (enemy.velocity.y < 0) {
    //    enemy.switchSprite('jump')
    //} else if (enemy.velocity.y > 0) {
    //    enemy.switchSprite('fall')
    //}

    // Detect for collision & enemy get hit
    if (rectangluarCollison({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.frameCurrent === 4) {
        enemy.takeHit()
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

function displayNextRoundButton() {
    const finalRoundButton = document.getElementById('startFinalRound');
    finalRoundButton.style.display = 'block';
}


function newGame() {
    playerRoundsWon = 0;
    enemyRoundsWon = 0;
    player.health = 100; // Reset player health
    enemy.health = 100;  // Reset enemy health

    // Start the game loop
    animate();
}

newGame()

window.addEventListener('keydown', (event) => {
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
                player.attack()
                break
        }
    }

    //if (!enemy.dead) {
    //    switch (event.key) {
    //        case 'ArrowRight':
    //            keys.ArrowRight.pressed = true
    //            enemy.lastKey = 'ArrowRight'
    //            break
    //        case 'ArrowLeft':
    //            keys.ArrowLeft.pressed = true
    //            enemy.lastKey = 'ArrowLeft'
    //           break
    //        case 'ArrowUp':
    //            enemy.velocity.y = -20
    //            break
    //        case 'ArrowDown':
    //            enemy.attack()
    //            break
    //    }
    //}
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    //enemy keys
    //switch (event.key) {
    //    case 'ArrowRight':
    //        keys.ArrowRight.pressed = false
    //        break
    //    case 'ArrowLeft':
    //        keys.ArrowLeft.pressed = false
    //        break
    //}
})