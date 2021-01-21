import * as PIXI from 'pixi.js';

export class Game {
    app;

    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600 });
    }
}