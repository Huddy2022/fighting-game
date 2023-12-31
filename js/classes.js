class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {
            x: 0,
            y: 0
        }
    }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.framesHold = 15
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.frameElapsed++
        if (this.frameElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {
            x: 0,
            y: 0
        },
        damageAmount = 5, // default damage amount
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey = null
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.damageAmount = damageAmount;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

    }

    update() {
        if (this.dead) {
            // Hide the canvas when the character is dead
            this.display = 'none';
            return;
        }

        this.draw()
        if (!this.dead) this.animateFrames()

        //Attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // Draw attack boxes
        //c.fillRect(
        //    this.attackBox.position.x,
        //    this.attackBox.position.y,
        //    this.attackBox.width,
        //    this.attackBox.height
        //)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Restrict player and enemy within the canvas width & height
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
        }

        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
        }

        //Gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
            this.velocity.y = 0
            this.position.y = 473
        } else
            this.velocity.y += gravity
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true

    }

    attack2() {
        this.switchSprite('attackReverse')
        this.isAttacking = true

    }

    takeHit(attacker) {
        this.health -= attacker.damageAmount;

        if (this.health <= 0) {
            this.switchSprite('death')
        }

    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.framesMax - 1)
                this.dead = true

            return
        }

        if (this.image === this.sprites.deathReverse.image) {
            if (this.frameCurrent === this.sprites.deathReverse.framesMax - 1)
                this.dead = true

            return
        }

        // overriding all other animations with attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1
        )
            return

        if (
            this.image === this.sprites.attackReverse.image &&
            this.frameCurrent < this.sprites.attackReverse.framesMax - 1
        )
            return

        // overriding when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        if (
            this.image === this.sprites.takeHitReverse.image &&
            this.frameCurrent < this.sprites.takeHitReverse.framesMax - 1
        )
            return


        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'idleReverse':
                if (this.image !== this.sprites.idleReverse.image) {
                    this.image = this.sprites.idleReverse.image
                    this.framesMax = this.sprites.idleReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'runReverse':
                if (this.image !== this.sprites.runReverse.image) {
                    this.image = this.sprites.runReverse.image
                    this.framesMax = this.sprites.runReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jumpReverse':
                if (this.image !== this.sprites.jumpReverse.image) {
                    this.image = this.sprites.jumpReverse.image
                    this.framesMax = this.sprites.jumpReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'fallReverse':
                if (this.image !== this.sprites.fallReverse.image) {
                    this.image = this.sprites.fallReverse.image
                    this.framesMax = this.sprites.fallReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attackReverse':
                if (this.image !== this.sprites.attackReverse.image) {
                    this.image = this.sprites.attackReverse.image
                    this.framesMax = this.sprites.attackReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'takeHitReverse':
                if (this.image !== this.sprites.takeHitReverse.image) {
                    this.image = this.sprites.takeHitReverse.image
                    this.framesMax = this.sprites.takeHitReverse.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'deathReverse':
                if (this.image !== this.sprites.deathReverse.image) {
                    this.image = this.sprites.deathReverse.image
                    this.framesMax = this.sprites.deathReverse.framesMax
                    this.frameCurrent = 0
                }
                break
        }
    }
}