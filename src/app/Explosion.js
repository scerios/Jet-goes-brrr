import { AnimatedSprite } from '@pixi/sprite-animated';
import { WorldDetail } from './WorldDetail.js';

export class Explosion extends AnimatedSprite {

    constructor(textures, x, y) {
        super(textures)
        this.x = x;
        this.y = y;
        this.width = WorldDetail.getModelSize;
        this.height = WorldDetail.getModelSize;
        this.animationSpeed = 1;
        this.loop = false;
    }
}