import {
    Trait
} from '../Entity.js';
import {
    Vector2
} from '../math.js';

export default class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vector2(0, 0);
        this.player = null;
        this.time = 300;
        this.score = 0;
        this.listen('stomp', () => {
            this.score += 100;
        });
    }
    setPlayer(entity) {
        this.player = entity;
    }
    update(entity, {
        deltaTime
    }, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.copy(this.checkpoint);
            level.entities.add(this.player);
        } else {
            this.time -= deltaTime * 2;
        }
    }
}