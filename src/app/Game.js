import * as PIXI from 'pixi.js';

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
            this.sprites.playerJet = new PIXI.Sprite(resources.playerJet.texture);
            this.sprites.playerJet.width = modelSize;
            this.sprites.playerJet.height = modelSize;
            this.sprites.playerJet.x = 0;
            this.sprites.playerJet.y = halfPositionOnY;
            this.app.stage.addChild(this.sprites.playerJet);

            this.sprites.enemyJet = new PIXI.Sprite(resources.enemyJet.texture);
            this.sprites.enemyJet.width = modelSize;
            this.sprites.enemyJet.height = modelSize;
            this.sprites.enemyJet.x = this.app.renderer.width - modelSize;
            this.sprites.enemyJet.y = halfPositionOnY;
            this.app.stage.addChild(this.sprites.enemyJet);
        });
    }
}