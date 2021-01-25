import { GameElement } from './GameElement.js';

export class Player extends GameElement {
    up;
    down;
    left;
    right;

    constructor(details) {
        super(details);
        this.up = details.up;
        this.down = details.down;
        this.left = details.left;
        this.right = details.right;
    }

    checkForHorizontalMovement() {
        if (this.left.isDown) {
            this.moveLeft();
        } else if (this.right.isDown) {
            this.moveRight();
        } else {
            this.stopHorizontalMovement();
        }
    }

    checkForVerticalMovement() {
        if (this.up.isDown) {
            this.moveUp();
        } else if (this.down.isDown) {
            this.moveDown();
        } else {
            this.stopVerticalMovement();
        }
    }

    upArrowKeyReleased() {
        this.checkForVerticalMovement();
        this.isGoingUp = false;

        if (this.down.isDown) {
            this.moveDown();
        } else {
            this.stopVerticalMovement();
        }
    }

    downArrowKeyReleased() {
        this.checkForVerticalMovement();
        this.isGoingDown = false;

        if (this.up.isDown) {
            this.moveUp();
        } else {
            this.stopVerticalMovement();
        }
    }

    leftArrowKeyReleased() {
        this.checkForHorizontalMovement();
        this.isGoingLeft = false;

        if (this.right.isDown) {
            this.moveRight();
        } else {
            this.stopHorizontalMovement();
        }
    }

    rightArrowKeyReleased() {
        this.checkForHorizontalMovement();
        this.isGoingRight = false;

        if (this.left.isDown) {
            this.moveLeft();
        } else {
            this.stopHorizontalMovement();
        }
    }

    limitMovement() {
        if (this.isGoingUp && !this.checkIfIsNextToTopBorder()) {
            this.y += this.vy;
        }

        if (this.isGoingDown && !this.checkIfIsNextToBottomBorder()) {
            this.y += this.vy;
        }

        if (this.isGoingLeft && !this.checkIfIsNextToLeftBorder()) {
            this.x += this.vx;
        }

        if (this.isGoingRight && !this.checkIfIsNextToRightBorder()) {
            this.x += this.vx;
        }
    }
}