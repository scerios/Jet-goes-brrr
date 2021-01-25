import * as PIXI from 'pixi.js';
import { WorldDetail } from './WorldDetail.js';
import { Sprite } from './Sprite.js';
import { Player } from './Player.js';

export class Game {
    app;
    ticker;
    sprites;
    tiles;

    up;
    down;
    left;
    right;
    space;

    isRunning = false;

    constructor(gameplayElements) {
        this.app = new PIXI.Application({ width: WorldDetail.getGameWidth, height: WorldDetail.getGameHeight });
        this.sprites = {};
        this.tiles = {};

        this.setup(gameplayElements);
    }

    setup(gameplayElements) {
        this.initKeyCapture();
        this.keyboardCapture();

        this.addAssetsToLoader(gameplayElements);
        this.createGameElements();

        this.initTicker();
        this.setTickerEvents();
    }

    initKeyCapture() {
        this.up = this.keyboard("ArrowUp");
        this.down = this.keyboard("ArrowDown");
        this.left = this.keyboard("ArrowLeft");
        this.right = this.keyboard("ArrowRight");
        this.space = this.keyboard(" ");
    }

    keyboard(value) {
        let key = {};
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;

        key.downHandler = event => {
            if (event.key === key.value) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        key.upHandler = event => {
            if (event.key === key.value) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        };

        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);

        window.addEventListener(
            "keydown", downListener, false
        );
        window.addEventListener(
            "keyup", upListener, false
        );

        key.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
        };

        return key;
    }

    keyboardCapture() {
        this.up.press = () => {
            this.sprites.playerJet.checkForHorizontalMovement();

            this.left.release = () => {
                this.sprites.playerJet.leftArrowKeyReleased();
            };

            this.right.release = () => {
                this.sprites.playerJet.rightArrowKeyReleased();
            };

            this.sprites.playerJet.moveUp();
        };

        this.up.release = () => {
            this.sprites.playerJet.upArrowKeyReleased();
        };

        this.down.press = () => {
            this.sprites.playerJet.checkForHorizontalMovement();

            this.left.release = () => {
                this.sprites.playerJet.leftArrowKeyReleased();
            };

            this.right.release = () => {
                this.sprites.playerJet.rightArrowKeyReleased();
            };

            this.sprites.playerJet.moveDown();
        };

        this.down.release = () => {
            this.sprites.playerJet.downArrowKeyReleased();
        };

        this.left.press = () => {
            this.sprites.playerJet.checkForVerticalMovement();

            this.up.release = () => {
                this.sprites.playerJet.upArrowKeyReleased();
            };

            this.down.release = () => {
                this.sprites.playerJet.downArrowKeyReleased();
            };

            this.sprites.playerJet.moveLeft();
        };

        this.left.release = () => {
            this.sprites.playerJet.leftArrowKeyReleased();
        };

        this.right.press = () => {
            this.sprites.playerJet.checkForVerticalMovement();

            this.up.release = () => {
                this.sprites.playerJet.upArrowKeyReleased();
            };

            this.down.release = () => {
                this.sprites.playerJet.downArrowKeyReleased();
            };

            this.sprites.playerJet.moveRight();
        };

        this.right.release = () => {
            this.sprites.playerJet.rightArrowKeyReleased();
        };

        this.space.press = () => {
            let missile = this.sprites.playerJet.shootRocket();
            missiles.push(missile);
            this.app.stage.addChild(missile);
        };
    }

    addAssetsToLoader(assets) {
        for (let asset of assets) {
            let name = asset.match(/(?<=\/)(.*?)(?=\.)/g)[0];
            this.app.loader.add(name, asset);
        }
    }

    createGameElements() {
        this.app.loader.load((loader, resources) => {
            this.tiles.farBackground = this.createBackgroundTile(resources.farBackground.texture);
            this.app.stage.addChild(this.tiles.farBackground);

            this.tiles.farSun = this.createBackgroundTile(resources.farSun.texture);
            this.app.stage.addChild(this.tiles.farSun);

            this.tiles.middleBackgroundShadow = this.createBackgroundTile(resources.middleBackgroundShadow.texture);
            this.app.stage.addChild(this.tiles.middleBackgroundShadow);

            this.tiles.middleBackground = this.createBackgroundTile(resources.middleBackground.texture);
            this.app.stage.addChild(this.tiles.middleBackground);

            this.tiles.middleCityShadow = this.createBackgroundTile(resources.middleCityShadow.texture);
            this.app.stage.addChild(this.tiles.middleCityShadow);

            this.tiles.middleCity = this.createBackgroundTile(resources.middleCity.texture);
            this.app.stage.addChild(this.tiles.middleCity);

            this.tiles.frontTrees = this.createBackgroundTile(resources.frontTrees.texture);
            this.app.stage.addChild(this.tiles.frontTrees);

            this.sprites.playerJet = this.createPlayer(resources.playerJet.texture);
            this.app.stage.addChild(this.sprites.playerJet);
        });
    }

    createPlayer(texture) {
        return new Player({
            texture: texture,
            width: WorldDetail.getModelSize,
            height: WorldDetail.getModelSize,
            x: 0,
            y: WorldDetail.getHalfPositionOnY,
            moveSpeed: 5,
            vx: 0,
            vy: 0,
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right
        });
    }

    createBackgroundTile(texture) {
        let tile = new PIXI.TilingSprite(texture, WorldDetail.getGameWidth, WorldDetail.getGameHeight);
        tile.position.set(0, 0);

        return tile;
    }

    initTicker() {
        this.ticker = PIXI.Ticker.shared;
        this.ticker.autoStart = false;
    }

    setTickerEvents() {
        this.ticker.add(() => {
            this.sprites.playerJet.limitMovement();
        });
    }

    startGame() {
        this.ticker.start();
    }
}