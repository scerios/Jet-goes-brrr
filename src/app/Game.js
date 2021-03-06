import * as PIXI from 'pixi.js';
import { WorldDetail } from './WorldDetail.js';
import { GameElement } from './GameElement.js';
import { Player } from './Player.js';
import { Explosion } from './Explosion.js';
import { TextHandler } from './TextHandler.js';
import { CollisionDetector } from './CollisionDetector.js';

export class Game {
    app;
    resources;
    ticker;
    tiles;
    TextHandler;

    playerJet;
    explosionTextures = []
    enemies = [];
    missiles = [];

    spawnEnemies;

    up;
    down;
    left;
    right;
    space;
    pause;

    backgroundPositionX = 0;
    killedEnemies = 0;
    isRunning = false;
    frequency;

    constructor(gameplayElements) {
        this.app = new PIXI.Application({ width: WorldDetail.getGameWidth, height: WorldDetail.getGameHeight });
        this.tiles = {};

        this.setup(gameplayElements);
    }

    setup(gameplayElements) {
        this.TextHandler = new TextHandler();
        this.initKeyCapture();
        this.keyboardCapture();

        this.addAssetsToLoader(gameplayElements);
        this.createGameElements();
        this.addGameElementsToStage();

        this.initTicker();
        this.setTickerEvents();
    }

    initKeyCapture() {
        this.up = this.keyboard('ArrowUp');
        this.down = this.keyboard('ArrowDown');
        this.left = this.keyboard('ArrowLeft');
        this.right = this.keyboard('ArrowRight');
        this.space = this.keyboard(' ');
        this.pause = this.keyboard('p');
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
            'keydown', downListener, false
        );
        window.addEventListener(
            'keyup', upListener, false
        );

        key.unsubscribe = () => {
            window.removeEventListener('keydown', downListener);
            window.removeEventListener('keyup', upListener);
        };

        return key;
    }

    keyboardCapture() {
        this.up.press = () => {
            this.playerJet.checkForHorizontalMovement();

            this.left.release = () => {
                this.playerJet.leftArrowKeyReleased();
            };

            this.right.release = () => {
                this.playerJet.rightArrowKeyReleased();
            };

            this.playerJet.moveUp();
        };

        this.up.release = () => {
            this.playerJet.upArrowKeyReleased();
        };

        this.down.press = () => {
            this.playerJet.checkForHorizontalMovement();

            this.left.release = () => {
                this.playerJet.leftArrowKeyReleased();
            };

            this.right.release = () => {
                this.playerJet.rightArrowKeyReleased();
            };

            this.playerJet.moveDown();
        };

        this.down.release = () => {
            this.playerJet.downArrowKeyReleased();
        };

        this.left.press = () => {
            this.playerJet.checkForVerticalMovement();

            this.up.release = () => {
                this.playerJet.upArrowKeyReleased();
            };

            this.down.release = () => {
                this.playerJet.downArrowKeyReleased();
            };

            this.playerJet.moveLeft();
        };

        this.left.release = () => {
            this.playerJet.leftArrowKeyReleased();
        };

        this.right.press = () => {
            this.playerJet.checkForVerticalMovement();

            this.up.release = () => {
                this.playerJet.upArrowKeyReleased();
            };

            this.down.release = () => {
                this.playerJet.downArrowKeyReleased();
            };

            this.playerJet.moveRight();
        };

        this.right.release = () => {
            this.playerJet.rightArrowKeyReleased();
        };

        this.space.press = () => {
            let missile = this.playerJet.shootMissile(this.resources.missile.texture);

            this.missiles.push(missile);
            this.app.stage.addChild(missile);
        };

        this.pause.press = () => {
            if (this.isRunning) {
                this.pauseGame();
            } else {
                this.continueGame();
            }
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

            this.loadExplosionTextures();
        });
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
            this.app.stage.addChild(this.playerJet);
        });
    }

    loadExplosionTextures() {
        for (let i = 0; i < 48; i++) {
            let texture = PIXI.Texture.from(`exp_${i + 1}.png`);
            this.explosionTextures.push(texture);
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

            this.playerJet = this.createPlayer();
        });
    }

    createPlayer() {
        return new Player({
            texture: this.resources.playerJet.texture,
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

    createEnemy() {
        return new GameElement({
            texture: this.resources.enemyJet.texture,
            width: WorldDetail.getModelSize,
            height: WorldDetail.getModelSize,
            x: WorldDetail.getGameWidth + WorldDetail.getModelSize,
            y: (WorldDetail.getGameHeight - WorldDetail.getModelSize) - Math.floor(Math.random() * 501),
            moveSpeed: WorldDetail.getMoveSpeed,
            vx: 0,
            vy: 0
        });
    }

    createBackgroundTile(texture) {
        let tile = new PIXI.TilingSprite(texture, WorldDetail.getGameWidth, WorldDetail.getGameHeight);
        tile.position.set(0, 0);

        return tile;
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

            this.playerJet.limitMovement();

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

                if (CollisionDetector.isDetected(this.playerJet, enemy)) {
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
                        if (CollisionDetector.isDetected(missile, enemy)) {
                            this.killedEnemies++;
                            this.TextHandler.setPointsValue(this.killedEnemies);
                            this.explodeEnemy(enemy);
                            this.removeMissile(missile);

                            break;
                        }
                    }
                }
            }
        }
    }

    explodeEnemy(enemy) {
        let enemyExplosion = new Explosion(this.explosionTextures, enemy.x, enemy.y);
        this.app.stage.addChild(enemyExplosion);

        enemyExplosion.play();

        this.removeEnemy(enemy);
    }

    explodePlayer() {
        let playerExplosion = new Explosion(this.explosionTextures, this.playerJet.x, this.playerJet.y);
        this.app.stage.addChild(playerExplosion);

        playerExplosion.play();

        this.app.stage.removeChild(this.playerJet);
    }

    removeMissile(missile) {
        this.app.stage.removeChild(missile);
        this.missiles.splice(this.missiles.indexOf(missile), 1);
    }

    removeEnemy(enemy) {
        this.app.stage.removeChild(enemy);
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    startGame(frequency) {
        this.frequency = frequency;
        this.continueGame();
    }

    startEnemySpawn() {
        this.spawnEnemies = setInterval(() => {
            let enemyJet = this.createEnemy();

            enemyJet.randomMovement();

            this.enemies.push(enemyJet);
            this.app.stage.addChild(enemyJet);
        }, parseInt(this.frequency));
    }

    pauseGame() {
        this.ticker.stop();
        this.isRunning = false;

        clearInterval(this.spawnEnemies);
    }

    continueGame() {
        let texts = this.TextHandler.getStartingTexts();
        this.TextHandler.setPointsTexts();
        let indexer = 0;

        let texter = setInterval(() => {
            if (indexer == 0) {
                this.app.stage.addChild(texts[indexer]);
            } else if (indexer < 2) {
                this.app.stage.removeChild(texts[indexer - 1]);
                this.app.stage.addChild(texts[indexer]);
            } else if (indexer == 2) {
                this.app.stage.addChild(texts[indexer]);
                this.app.stage.removeChild(texts[indexer - 1]);
                this.ticker.start();
                this.isRunning = true;
                this.startEnemySpawn(this.frequency);
            } else {
                this.app.stage.removeChild(texts[indexer - 1]);
                this.app.stage.addChild(this.TextHandler.getPointsText());
                this.app.stage.addChild(this.TextHandler.getPointsValue());
                clearInterval(texter);
            }

            indexer++;
        }, 1000);
    }

    stopGame() {
        this.pauseGame();

        clearInterval(this.spawnEnemies);
    }
}