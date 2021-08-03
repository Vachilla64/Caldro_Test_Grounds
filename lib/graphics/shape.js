import {Vector2} from "../core/vector.js";
import {Color} from "../core/color.js";


/**
 * Load texture and draw Texture
 * bounding client
 * draw rotated
 */
export class ShapeMixin {

    constructor(pos) {
        if(!(pos instanceof Vector2))
            throw TypeError("Position on a shape was expected to be an instance of Vector2");
        this.pos = pos;
        this._color0 = undefined;
        this._color1 = undefined;
        this._rotation = 0;
    }

    set fillStyle(v)  { this._color1 = v; }

    get fillStyle() {
        if(this._color1 instanceof Color)
            return this._color1.toString();
        return this._color1;
    }

    set strokeStyle(v)  { this._color0 = v; }

    get strokeStyle() {
        if(this._color0 instanceof Color)
            return this._color0.toString();
        return this._color0;
    }

    get rotation() { this._rotation; }

};




export class Polygon extends ShapeMixin {

    constructor(pos, vertices, color=undefined) {
        super(pos);
        if(vertices.some(i => !(i instanceof Vector2)))
            throw TypeError("Vertices of a polygon must be an instance of Vector2");
        this.vertices = [];
        vertices.forEach(v => this.vertices.push(v));
        this.fillStyle = color;
    }

    set rotation(v) { 
        this._rotation = v;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo()
        ctx.closePath();
    }

};





export class Rectangle extends Polygon {

    constructor(pos, size, color="red") {
        super(pos, [], color);
        if(!(size instanceof Vector2))
            throw TypeError("Size of a rectangle must be an instance of vector2");
        this.size = size;
        this.vertices = [
            new Vector2(this.pos.x, this.pos.y),
            new Vector2(this.pos.x + this.size.x, this.pos.y),
            new Vector2(this.pos.x + this.size.x, this.pos.y + this.size.y),
            new Vector2(this.pos.x, this.pos.y + this.size.y),
        ];
    }

};



export class Circle extends ShapeMixin {

    constructor(pos, radius = 0, color = undefined) {
        super(pos);
        this.radius = radius;
        this.fillStyle = color;
    }

};