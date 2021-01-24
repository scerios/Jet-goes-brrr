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
}