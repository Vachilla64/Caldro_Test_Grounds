/**
 * @abstract
 * @class 
 * Base class for Vector Object
 */
export class Vector {

    /**
     * @function clone
     * @memberof Vector
     * @static
     * @param {Vector} vec - A vector's instance to clone from
     * @returns {Vector} A cloned version of vec
     * Creates a seperate clone of another vector
     */
    static clone(vec) {
        if(!(vec instanceof Vector))
            throw new Error("Cannot clone Vector from a non-Vector Object");
        let res = vec.createVector();
        for(let i of vec.components) 
            res[i] = vec[i];
        return res;
    }

    /**
     * @hideconstructor
     * @constructor
     * @param {string} type - string indicating the type of the vector
     * @param  {...any} args - other arguments 
     * creates a vector type
     */
    constructor(type, ...args) {
        if(this.constructor === Vector)
            throw new Error("Abstract Class `Vector` cannot be Instantiated");
        this.type = type;
        this.components = type == "2d" ? ["x", "y"] : ["x", "y", "z"];
        const _length = type === "2d" ? 2 : 3;
        for(let i=0; i < _length; i++) 
            this[this.components[i]] = args[i] || 0;
    }

    /**
     * @private
     * @returns {Vector} a vector of this type
     */
    createVector() {
        return this.type === "2d" ? new Vector2() : new Vector3();
    }

    /**
     * Carry out addition operation on two vectors. The returned function has
     * the same type as the vector that calls this function
     * @param {Vector} vec - Vector to be added
     * @returns {Vector} a new vector indicating the addition of other two vectors
     */
    add(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] + vec[i];
        return res;
    }

    /**
     * Carry out minus operation on two vectors. The returned function has
     * the same type as the vector that calls this function
     * @param {Vector} vec - Vector to be subtracted
     * @returns {Vector} a new vector indicating the subtraction of other two vectors
     */
    sub(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] - vec[i];
        return res;
    }

    /**
     * Increase or decrease the magnitude of a vector
     * @param {number} s - Amount that scales the vector
     * @returns {Vector} a scaled vector 
     */
    scale(s) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * s;
        return res;
    }

    /**
     * Multiply a vector by a vector. There's no real mathematical
     * formula for this but it could be intuitive in our game design
     * @param {Vector} v - A vector to be multiplied by
     * @returns {Vector} a product of two vectors
     */
    mult(v) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * v[i];
        return res;
    }
    
    /**
     * calculate the dot product of two vectors
     * @param {Vector} vec - A vector to be multiplied by
     * @returns {number} how much two vectors a projected on one another
     */
    dot(vec) {
        let sum = 0;
        for(let i of this.components)
            sum += this[i] * vec[i];
        return sum;
    }

    /**Converts a vector to a unit vector */
    normalise() {
        if(this.magnitude != 0) {
            for(let i of this.components)
                this[i] /= this.magnitude;
        }
    }

    /**
     * Converts a vector to an array
     * @returns {Array.<number>} An array having the values of each components in the vector respectively
     * plus the w component
     */
    toArray() {
        const arr = Array.from({length: this.components.length}, (v, i) => {
            return this[this.components[i]];
        });
        arr.push(this.w);
        return arr;
    }


};


/**
 * @module
 * @augments Vector
 * @see Vector 
 * A 2-dimensional homogenous vector
 */
export class Vector2 extends Vector {

    /**
     * Create a 2-dimensional vector. Each components are default to zero
     * except the w-component default to 1
     * @constructor
     * @param {number} x - value for the x-component
     * @param {number} y - value for the y-component
     * @param {number} w - value for the w-component1
     */
    constructor(x=0, y=0, w=1) {
        super("2d", x, y)
        this.w = w;
    }

    /**
     * get the magnitude oof a vector
     * @returns {number} the magnitude of the vector
     */
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * get the orthogonal or the normal vector. Do not mistook 
     * this method as { @link Vector#normalise }
     * @returns {Vector2} the orthogonal vector
     */
    get normal() {
        let res = this.createVector();
        res.x = -this.y;
        res.y = this.x;
        return res;
    }

    /**
     * @returns {number} the facing direction of the vector
     */
    get angle() {
        return Math.atan2(this.y, this.x);
    }

};


/**
 * @module
 * @augments Vector
 * @see Vector 
 * A 3-dimensional homogenous vector
 */
export class Vector3 extends Vector {

    /**
    * Create a 3-dimensional vector. Each components are default to zero
     * except the w-component default to 1
     * @constructor
     * @param {number} x - value for the x-component
     * @param {number} y - value for the y-component
     * @param {number} z - value for the z-component
     * @param {number} w - value for the w-component
     */
    constructor(x=0, y=0, z=0, w=1) {
        super("3d", x, y, z)
        this.w = w;
    }

    /**
     * get the magnitude of a vector
     * @returns {number} the magnitude of the vector
    */
    get magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
  
    /**
     * Calculate the cross product of two vectors. This method is good
     * in 3d graphics to get the face normal of a polygon
     * @param {Vector3} vec - A vector object
     * @returns {Vector3} a vector orthogonal to both other vectors/
     */
    cross(vec) {
        let res = this.createVector();
        res.x = this.y * vec.z - this.z * vec.y;
        res.y = this.z * vec.x - this.z * vec.z;
        res.z = this.x * vec.y - this.y * vec.x;
        return res;
    }

};