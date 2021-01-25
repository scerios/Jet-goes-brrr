import { Sprite } from '@pixi/sprite';

export class GameElement extends Sprite {
    moveSpeed;
    randomDirection;
    isGoingUp = false;
    isGoingDown = false;
    isGoingLeft = false;
    isGoingRight = false;
    isAlive = true;

    constructor(details) {
        super(details.texture);
        this.width = details.width;
        this.height = details.height;
        this.x = details.x;
        this.y = details.y;
        this.moveSpeed = details.moveSpeed;
        this.vx = details.vx;
        this.vy = details.vy;
    }

    moveUp() {
        this.vy = -this.moveSpeed;
        if (this.isGoingDown) {
            this.isGoingDown = false;
        }
        this.isGoingUp = true;
    }

    moveDown() {
        this.vy = this.moveSpeed;
        if (this.isGoingUp) {
            this.isGoingUp = false;
        }
        this.isGoingDown = true;
    }

    moveLeft() {
        this.vx = -this.moveSpeed;
        if (this.isGoingRight) {
            this.isGoingRight = false;
        }
        this.isGoingLeft = true;
    }

    moveRight() {
        this.vx = this.moveSpeed;
        if (this.isGoingLeft) {
            this.isGoingLeft = false;
        }
        this.isGoingRight = true;
    }

    stopVerticalMovement() {
        this.vy = 0;
        this.isGoingUp = false;
        this.isGoingDown = false;
    }

    stopHorizontalMovement() {
        this.vx = 0;
        this.isGoingLeft = false;
        this.isGoingRight = false;
    }

    checkIfIsNextToTopBorder() {
        if (this.isAlive) {
            return this.y - this.vy - this.moveSpeed < 0;
        } else {
            return false;
        }
    }

    checkIfIsNextToBottomBorder() {
        if (this.isAlive) {
            return this.y + 100 + this.vy > 600;
        } else {
            return false;
        }
    }

    checkIfIsNextToLeftBorder() {
        if (this.isAlive) {
            return this.x - this.vx - this.moveSpeed < 0;
        } else {
            return false;
        }
    }

    checkIfIsNextToRightBorder() {
        if (this.isAlive) {
            return this.x + 100 + this.vx > 800;
        } else {
            return false;
        }
    }

    limitMovement() {
        if (this.isGoingUp && !this.checkIfIsNextToTopBorder()) {
            this.y += this.vy;
        }

        if (this.isGoingDown && !this.checkIfIsNextToBottomBorder()) {
            this.y += this.vy;
        }
    }

    randomMovement() {
        let direction;

        let randomDirection = setInterval(() => {
            direction = Math.floor(Math.random() * 3);

            switch (direction) {
                case 0:
                    this.vy = 0;
                    this.isGoingUp = false;
                    this.isGoingDown = false;
                    break;

                case 1:
                    this.vy = this.moveSpeed;
                    this.isGoingUp = false;
                    this.isGoingDown = true;
                    break;

                case 2:
                    this.vy = -this.moveSpeed;
                    this.isGoingUp = true;
                    this.isGoingDown = false;
                    break;
            }

        }, 250);

        this.randomDirection = randomDirection;
    }
}