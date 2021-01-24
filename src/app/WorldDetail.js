const modelSize = 100;
const moveSpeed = 5;
const gameWidth = 800;
const gameHeight = 600;
const halfPositionOnY = gameHeight / 2 - modelSize / 2;

export class WorldDetail {
    static get modelSize() {
        return modelSize;
    }

    static get moveSpeed() {
        return moveSpeed;
    }

    static get gameWidth() {
        return gameWidth;
    }

    static get gameHeight() {
        return gameHeight;
    }

    static get halfPositionOnY() {
        return halfPositionOnY;
    }
}