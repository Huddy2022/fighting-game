const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 673

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

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
        x: 0,
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
        x: 200,
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
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
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
    offset: {
        x: 0,
        y: 405
    },
    sprites: {
        idle: {
            imageSrc: './img/wizard/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/wizard/run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/wizard/jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/wizard/fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/wizard/attack1.png',
            framesMax: 8,
        }
    },
    color: 'blue'
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

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    ghost.update()
    fireSkull.update()
    player.update()
    enemy.update()

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
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //Enemy Jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Detect for collision
    if (rectangluarCollison({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangluarCollison({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({
            player,
            enemy,
            timerId
        })

    }
}

animate()

window.addEventListener('keydown', (event) => {
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

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break
    }
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
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})