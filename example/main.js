/**
 * Create splashscreen
 * toast
 * controls
 */
import * as caldro from "../caldrodev.js";

const { Vector2, Color, util:{createVector}, Mat3x3 } = caldro;

const {sin, cos, max, random} = Math;

const Entity = {

    init(origin, direction, color) {
        this.direction = direction;
        this.origin = origin;
        this.size = 5;
        this.color = color;
        this.speed = 0;
        this.delete = false;
        this.mTranslate = Mat3x3.identity();
    },

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    },

    update(ctx, dt) {
        this.speed += 3;
        this.direction -= 2;
        this.mTranslate[2][0] = cos(this.direction) * this.speed;
        this.mTranslate[2][1] = sin(this.direction) * this.speed;
        let mult = Mat3x3.multiplyVector(this.mTranslate, this.origin);
        this.pos = new Vector2(mult[0], mult[1]);
        let dist = this.pos.sub(this.origin).magnitude;
        if(dist > app.radius) this.delete = true;
        if(!this.delete) this.draw(ctx);
    }
};


class SpiralTunnel extends caldro.GameArea {

    constructor(w, h) {
        super(document.body, w, h);
        this.clearColor = new Color(0,  0,  0, 0);
        this.origin = new Vector2(this.width/2, this.height/2);
        this.radius = max(this.width, this.height) * 0.5;
        this.entities = [];
        this.rotation = 0;
        this.origin = new Vector2();
        this.respawnIntervalCount = 0;
        this.respawnInterval = 0.5;
        this.clearPreviousFrame = false;
        this.css({backgroundColor: Color.Black});
    }

    spawnEntities(pos) {
        let color = new Color(random() * 255, random() * 255, random() * 255);
        for(let i=0; i < 360; i+=10) {
            let a = Math.degToRad(i);
            let {...newEntity} = Entity;
            newEntity.init(pos, a, color);
            this.entities.push(newEntity);
        }
    }

    update() {
        let dt = this.getDeltaTime();
        this.respawnIntervalCount += dt;
        if(this.respawnIntervalCount >= this.respawnInterval) {
            this.spawnEntities(this.origin);
            this.respawnIntervalCount = 0;
        }
        this.rotation ++;
        this.entities = this.entities.filter(i => !i.delete);
        this.context2d.save();
        this.context2d.globalCompositeOperation = "xor";
        this.context2d.translate(this.width / 2, this.height/2);
        this.context2d.rotate(Math.degToRad(this.rotation));
        [...this.entities].forEach(entity => {
            entity.origin = this.origin;
            entity.update(this.context2d, dt);
        });
        this.context2d.restore();
    }

};

const app = new SpiralTunnel(innerWidth, innerHeight);
app.mainLoop(caldro.GameArea.Dynamic);