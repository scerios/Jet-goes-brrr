const modelSize = 100;
const moveSpeed = 5;
const gameWidth = 800;
const gameHeight = 600;
const halfPositionOnY = gameHeight / 2 - modelSize / 2;

export class WorldDetail {
    static get getModelSize() {
        return modelSize;
    }

    static get getMoveSpeed() {
        return moveSpeed;
    }

    static get getGameWidth() {
        return gameWidth;
    }

    static get getGameHeight() {
        return gameHeight;
    }

    static get getHalfPositionOnY() {
        return halfPositionOnY;
    }
}