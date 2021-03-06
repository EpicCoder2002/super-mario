import {
    SIDES
} from '../Entity.js';
import Trait from "../Trait.js";

export default class Jump extends Trait {
    constructor() {
        super();
        this.ready = 0;
        this.duration = 0.3;
        this.velocity = 200;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.engagedTime = 0;
        this.speedBoost = 0.3;
    }
    get falling() {
        return this.ready < 0;
    }
    start() {
        this.requestTime = this.gracePeriod;
    }
    cancel() {
        this.engagedTime = 0;
        this.requestTime = 0;
    }
    obstruct(entity, side) {
        if (side === SIDES.BOTTOM) {
            this.ready = 1;
        } else if (side == SIDES.TOP) {
            this.cancel();
        }
    }
    update(entity, {
        deltaTime
    }, level) {
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                entity.sounds.add('jump');
                this.engagedTime = this.duration;
                this.requestTime = 0;
            }
            this.requestTime -= deltaTime;
        }
        if (this.engagedTime > 0) {
            entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
            this.engagedTime -= deltaTime;
        }
        this.ready--;
    }
}