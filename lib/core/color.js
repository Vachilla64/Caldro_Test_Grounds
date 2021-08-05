// needed to access Math.clamp
import "../core/util.js";


/**
 * @description A simple color class
 * Color exists as a rgba component where 
 * R(red), G(green), B(blue) and A(alpha)
 * 
 * export class = [
 * Color
 * ]
 */
export class Color {

    /**
     * @description RGBA Constructor
     * @param {Number} r red ranges from 0 - 255
     * @param {Number} g green ranges from 0 - 255
     * @param {Number} b blue from 0 - 255
     * @param {Number} a alpha ranges from 0 -1
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    set r(v) { this._r =  Math.clamp(0.001, 255, v); }

    set g(v) { this._g = Math.clamp(0.001, 255, v); }

    set b(v) { this._b = Math.clamp(0.001, 255, v); }

    set a(v) { this._a =  Math.clamp(0.001, 1, v); }

    get r() { return this._r; }

    get g() { return this._g; }

    get b() { return this._b; }

    get a() { return this._a; }


    /**
     * @description mix two colors together but subtractively
     * @param {Color} color color to be mixed
     * @returns {Color} subtractive mixins of two color
     */
    mix(color) {
        if(!(color instanceof Color)) {
            console.error("Color mix expects an instance of Color Object")
            return;
        }
        let res = new Color();
        res.r = (this.r * color.r) / 255;
        res.g = (this.g * color.g) / 255;
        res.b = (this.b * color.b) / 255;
        res.a = (this.a * color.a) / 1;
        return res;
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

};


/** ROYGBIV */
Object.defineProperties(Color, {
    Red: { value: new Color(255, 0, 0) },
    Orange: {value: new Color(255, 0, 0) },
    Yellow: {value: new Color(255, 0, 0) },
    Green: {value: new Color(0, 255, 0) },
    Indigo: {value: new Color(255, 0, 0) },
    Blue: {value: new Color(0, 0, 255) },
    Violet: {value: new Color(255, 0, 0) },
    Black: {value: new Color(0, 0, 0) },
    Transparent: {value: new Color(0, 0, 0, 0)},
});