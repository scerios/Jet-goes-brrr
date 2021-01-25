import * as PIXI from 'pixi.js';
import { WorldDetail } from './WorldDetail.js';
import { GameElement } from './GameElement.js';
import { Player } from './Player.js';

export class Game {
    app;
    ticker;
    sprites;
    tiles;

    enemies = [];
    missiles = [];

    spawnEnemies;

    up;
    down;
    left;
    right;
    space;

    backgroundPositionX = 0;
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
        this.addGameElementsToStage();

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
            this.tiles.farSun = this.createBackgroundTile(resources.farSun.texture);
            this.tiles.middleBackgroundShadow = this.createBackgroundTile(resources.middleBackgroundShadow.texture);
            this.tiles.middleBackground = this.createBackgroundTile(resources.middleBackground.texture);
            this.tiles.middleCityShadow = this.createBackgroundTile(resources.middleCityShadow.texture);
            this.tiles.middleCity = this.createBackgroundTile(resources.middleCity.texture);
            this.tiles.frontTrees = this.createBackgroundTile(resources.frontTrees.texture);

            this.sprites.playerJet = this.createPlayer(resources.playerJet.texture);
        });
    }

    createPlayer(texture) {
        return new Player({
            texture: texture,
            width: WorldDetail.getModelSize,
            height: WorldDetail.getModelSize,
            x: 0,
            y: WorldDetail.getHalfPositionOnY,
            moveSpeed: WorldDetail.getMoveSpeed,
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

    addGameElementsToStage() {
        this.app.loader.load((loader, resources) => {
            this.app.stage.addChild(this.tiles.farBackground);
            this.app.stage.addChild(this.tiles.farSun);
            this.app.stage.addChild(this.tiles.middleBackgroundShadow);
            this.app.stage.addChild(this.tiles.middleBackground);
            this.app.stage.addChild(this.tiles.middleCityShadow);
            this.app.stage.addChild(this.tiles.middleCity);
            this.app.stage.addChild(this.tiles.frontTrees);
            this.app.stage.addChild(this.sprites.playerJet);
        });
    }

    scrollBackground() {
        this.backgroundPositionX = this.backgroundPositionX - WorldDetail.getScrollSpeed;
        this.tiles.frontTrees.tilePosition.x = this.backgroundPositionX;
        this.tiles.middleCity.tilePosition.x = this.backgroundPositionX / 2;
        this.tiles.middleCityShadow.tilePosition.x = this.backgroundPositionX / 2 + 0.25;
        this.tiles.middleBackground.tilePosition.x = this.backgroundPositionX / 3;
        this.tiles.middleBackgroundShadow.tilePosition.x = this.backgroundPositionX / 3 + 0.25;
    }

    initTicker() {
        this.ticker = PIXI.Ticker.shared;
        this.ticker.autoStart = false;
    }

    setTickerEvents() {
        this.ticker.add(() => {
            this.scrollBackground();

            this.sprites.playerJet.limitMovement();

            if (this.enemies.length > 0) {
                for (let enemy of this.enemies) {
                    enemy.limitMovement();
                    enemy.x -= enemy.moveSpeed;
                }
            }
        });
    }

    startGame() {
        this.ticker.start();

        this.spawnEnemies = setInterval(() => {
            this.app.loader.load((loader, resources) => {
                let enemyJet = new GameElement({
                    texture: resources.enemyJet.texture,
                    width: WorldDetail.getModelSize,
                    height: WorldDetail.getModelSize,
                    x: WorldDetail.getGameWidth + WorldDetail.getModelSize,
                    y: (WorldDetail.getGameHeight - WorldDetail.getModelSize) - Math.floor(Math.random() * 501),
                    moveSpeed: WorldDetail.getMoveSpeed,
                    vx: 0,
                    vy: 0
                });

                enemyJet.randomMovement();

                this.enemies.push(enemyJet);
                this.app.stage.addChild(enemyJet);
            });
        }, 2000);
    }
}