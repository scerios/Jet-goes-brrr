import * as PIXI from 'pixi.js';
import { WorldDetail } from './WorldDetail.js';
import { GameElement } from './GameElement.js';
import { Player } from './Player.js';
import { Explosion } from './Explosion.js';

export class Game {
    app;
    resources;
    ticker;
    sprites;
    tiles;

    explosionTextures = []
    enemies = [];
    missiles = [];

    spawnEnemies;

    up;
    down;
    left;
    right;
    space;

    backgroundPositionX = 0;

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
            let missile = this.sprites.playerJet.shootMissile(this.resources.missile.texture);

            this.missiles.push(missile);
            this.app.stage.addChild(missile);
        };
    }

    addAssetsToLoader(assets) {
        for (let asset of assets) {
            let name = asset.match(/(?<=\/)(.*?)(?=\.)/g)[0];
            this.app.loader.add(name, asset);
        }

        this.app.loader.add('./images/explosion.json');

        this.app.loader.onComplete.add(() => {
            this.resources = this.app.loader.resources;

            for (let i = 0; i < 48; i++) {
                let texture = PIXI.Texture.from(`exp_${i + 1}.png`);
                this.explosionTextures.push(texture);
            }
        });
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

            this.moveEnemies();

            this.moveRockets();
        });
    }

    moveEnemies() {
        if (this.enemies.length > 0) {
            for (let enemy of this.enemies) {
                enemy.limitMovement();
                enemy.x -= enemy.moveSpeed;

                if (enemy.x < -enemy.width) {
                    this.removeEnemy(enemy);
                    continue;
                }

                if (this.checkForCollision(this.sprites.playerJet, enemy)) {
                    this.explodeEnemy(enemy);
                    this.explodePlayer();
                    clearInterval(this.spawnEnemies);

                    setInterval(() => {
                        this.stopGame();
                    }, 1000);
                }
            }
        }
    }

    moveRockets() {
        if (this.missiles.length > 0) {
            for (let missile of this.missiles) {
                missile.x += missile.moveSpeed;

                if (missile.x > WorldDetail.getGameWidth) {
                    this.removeMissile(missile);

                    continue;
                }

                if (this.enemies.length > 0) {
                    for (let enemy of this.enemies) {
                        if (this.checkForCollision(missile, enemy)) {
                            this.explodeEnemy(enemy);
                            this.removeMissile(missile);

                            break;
                        }
                    }
                }
            }
        }
    }

    checkForCollision(elementA, elementB) {
        let isHit = false;

        if (elementA != undefined && elementB != undefined) {

            if (elementA.x + elementA.width >= elementB.x && elementA.x <= elementB.x + elementB.width) {

                if (elementA.y == elementB.y) {
                    isHit = true;

                } else if (elementA.y < elementB.y && elementA.y + elementA.height >= elementB.y) {
                    isHit = true;

                } else if (elementB.y < elementA.y && elementB.y + elementB.height >= elementA.y) {
                    isHit = true;
                }
            }
        }

        return isHit;
    };

    explodeEnemy(enemy) {
        let enemyExplosion = new Explosion(this.explosionTextures, enemy.x, enemy.y);
        this.app.stage.addChild(enemyExplosion);

        enemyExplosion.play();

        this.removeEnemy(enemy);
    }

    explodePlayer() {
        let playerExplosion = new Explosion(this.explosionTextures, this.sprites.playerJet.x, this.sprites.playerJet.y);
        this.app.stage.addChild(playerExplosion);

        playerExplosion.play();

        this.app.stage.removeChild(this.sprites.playerJet);
    }

    removeMissile(missile) {
        this.app.stage.removeChild(missile);
        this.missiles.splice(this.missiles.indexOf(missile), 1);
    }

    removeEnemy(enemy) {
        this.app.stage.removeChild(enemy);
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    startGame() {
        this.ticker.start();

        this.spawnEnemies = setInterval(() => {
            let enemyJet = new GameElement({
                texture: this.resources.enemyJet.texture,
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
        }, 2000);
    }

    stopGame() {
        this.ticker.stop();

        clearInterval(this.spawnEnemies);
    }
}