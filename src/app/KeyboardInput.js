export class KeyboardInput {
    playerJet;
    missileTexture;

    up;
    down;
    left;
    right;
    space;

    constructor(playerJet, missileTexture) {
        this.playerJet = playerJet;
        this.missileTexture = missileTexture;

        this.initKeyCapture();
        this.keyboardCapture();
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
            let missile = this.playerJet.shootMissile(this.missileTexture);

            this.missiles.push(missile);
            this.app.stage.addChild(missile);
        };
    }
}