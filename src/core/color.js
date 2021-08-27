// needed for Math.clamp
import "../core/util.js";


/**
 * An intuitive class to manipulate rgba color value
 * @class
 * @property {Color} Red - An opaque red
 * @property {Color} Orange - An opaque orange
 * @property {Color} Yellow - An opaque yellow
 * @property {Color} Indigo - An opaque indigo
 * @property {Color} Blue - An opaque blue
 * @property {Color} Violet - An opaque violet
 * @property {Color} Black - An opaque black
 * @property {Color} White - An opaque white
 * @property {Color} Transparent - An opaque transparent
 * 
 * @todo define other color property
 */
export class Color {

    /**
     * @constructor
     * @default r 0
     * @default g 0
     * @default b 0
     * @default a 1
     * @param {number} r red ranges from 0 - 255
     * @param {number} g green ranges from 0 - 255
     * @param {number} b blue from 0 - 255
     * @param {number} a alpha ranges from 0 -1
     * creates an instance of a color. 
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
     * @description mix two colors together using the subtractive method
     * @param {Color} color color to be mixed
     * @returns {Color} subtractive mixins of two color
     */
    mix(color) {
        if(!(color instanceof Color) && !(color._hasImplementInterface())) {
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

    /**
     * 
     * @returns {string} color in rgba string
     */
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

};


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