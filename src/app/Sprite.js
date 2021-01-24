import * as PIXI from 'pixi.js';

export class Sprite extends PIXI.Sprite {
    moveSpeed;
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
}