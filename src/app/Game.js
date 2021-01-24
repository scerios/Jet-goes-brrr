import * as PIXI from 'pixi.js';
import { Sprite } from './Sprite.js';

export class Game {
    app;
    sprites;
    isRunning = false;

    constructor(gameplayElements, backgroundImages) {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        this.sprites = {};
        this.setup(gameplayElements, backgroundImages);
    }

    setup(gameplayElements, backgroundImages) {
        this.addAssetsToLoader(gameplayElements);

        this.addAssetsToLoader(backgroundImages)

        this.addSpritesToLoader();
    }

    addAssetsToLoader(assets) {
        for (let asset of assets) {
            let name = asset.match(/(?<=\/)(.*?)(?=\.)/g)[0];
            this.app.loader.add(name, asset);
        }
    }

    addSpritesToLoader() {
        const modelSize = 100;
        const halfPositionOnY = this.app.renderer.height / 2 - modelSize / 2;

        this.app.loader.load((loader, resources) => {
            let playerJet = new Sprite({
                texture: resources.playerJet.texture,
                width: modelSize,
                height: modelSize,
                x: 0,
                y: halfPositionOnY,
                moveSpeed: 5,
                vx: 0,
                vy: 0
            });

            this.app.stage.addChild(playerJet);

            let enemyJet = new Sprite({
                texture: resources.enemyJet.texture,
                width: modelSize,
                height: modelSize,
                x: this.app.renderer.width - modelSize,
                y: halfPositionOnY,
                moveSpeed: 5,
                vx: 0,
                vy: 0
            });

            this.app.stage.addChild(enemyJet);
        });
    }
}