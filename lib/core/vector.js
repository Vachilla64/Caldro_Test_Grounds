/**
 * Vector Mixin class:
 * Contains common operations for each vector's type [2d, 3d]
 */
class VectorMixin {


    /**
     * @description create a copy of a reference vector
     * @param {VectorMixin} vec a reference VectorMixin object
     * @returns VectorMixin
     */
    static clone(vec) {
        if(!(vec instanceof VectorMixin))
            throw new Error("Cannot clone Vector from a non-Vector Object");
        let res = vec.createVector();
        for(let i of vec.components) res[i] = vec[i];
        return res;
    }


    /**
     * @description general constructor
     * @param {String} type type of th vector object: [2d, 3d]
     * @param  {...any} args initialiser for the vector
     */
    constructor(type, ...args) {
        this.type = type;
        this.components = type == "2d" ? ["x", "y"] : ["x", "y", "z"];
        const _length = type === "2d" ? 2 : 3;
        for(let i=0; i < _length; i++) 
            this[this.components[i]] = args[i];
    }

    createVector() {
        return this.type === "2d" ? new Vector2() : new Vector3();
    }

    add(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] + vec[i];
        return res;
    }

    sub(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] - vec[i];
        return res;
    }

    scale(s) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * s;
        return res;
    }

    mult(v) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * v[i];
        return res;
    }
    
    dot(vec) {
        let sum = 0;
        for(let i of this.components)
            sum += this[i] * vec[i];
        return sum;
    }

    normalise() {
        if(this.magnitude != 0) {
            for(let i of this.components)
                this[i] /= this.magnitude;
        }
    }

    toArray() {
        return Array.from({length: this.components.length}, (v, i) => {
            return this[this.components[i]];
        });
    }


};



export class Vector2 extends VectorMixin {

    /**
     * @description base constructor for 2d vector
     * @param {Number} x x-value, defaults to 0
     * @param {Number} y y-value, defaults to 0
     * @param {Number} w w-value, defaults to 1
     */
    constructor(x=0, y=0, w=1) {
        super("2d", x, y)
        this.w = w;
    }

    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    get normalVector() {
        let res = this.createVector();
        res.x = -this.y;
        res.y = this.x;
        return res;
    }

};



export class Vector3 extends VectorMixin {

    /**
     * @description base constructor for 3d vector
     * @param {Number} x x-value, defaults to 0
     * @param {Number} y y-value, defaults to 0
     * @param {Number} z z-value, defaults to 0
     * @param {Number} w w-value, defaults to 1
     */
    constructor(x=0, y=0, z=0, w=1) {
        super("3d", x, y, z)
        this.w = w;
    }

    get magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
    
    cross(vec) {
        let res = this.createVector();
        res.x = this.y * vec.z - this.z * vec.y;
        res.y = this.z * vec.x - this.z * vec.z;
        res.z = this.x * vec.y - this.y * vec.x;
        return res;
    }

};