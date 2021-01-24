import * as PIXI from 'pixi.js';
import { WorldDetail } from './WorldDetail.js';
import { Sprite } from './Sprite.js';
import { Player } from './Player.js';

export class Game {
    app;

    sprites;

    up;
    down;
    left;
    right;
    space;

    isRunning = false;

    constructor(gameplayElements) {
        this.app = new PIXI.Application({ width: 800, height: 600 });
        this.sprites = {};
        this.setup(gameplayElements);
    }

    setup(gameplayElements) {
        this.initKeyCapture();
        this.keyboardCapture();

        this.addAssetsToLoader(gameplayElements);

        this.addSpritesToLoader();
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

    addSpritesToLoader() {
        this.app.loader.load((loader, resources) => {
            this.sprites.playerJet = this.createPlayer(resources["playerJet"].texture);
            this.app.stage.addChild(this.sprites.playerJet);

            this.app.ticker.add(() => {
                this.sprites.playerJet.limitMovement();
            });
        });
    }

    createPlayer(texture) {
        return new Player({
            texture: texture,
            width: WorldDetail.modelSize,
            height: WorldDetail.modelSize,
            x: 0,
            y: WorldDetail.halfPositionOnY,
            moveSpeed: 5,
            vx: 0,
            vy: 0,
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right
        });
    }

}