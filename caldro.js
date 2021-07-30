const REPOSITORY = "github.com/Vachilla64/Caldro";function implementInterface(target, ...arg) {

};/**
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



class Vector2 extends VectorMixin {
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



class Vector3 extends VectorMixin {
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

};/**
 * @description contains general matrix operations
 * Valid matrices are the squarely 3x3 annd 4x4 represented 
 * as a homogeneous coordinate
 * 
 * @param {Number} length length of the matrix
 * length 3 = Mat3x3
 * @returns {Object} general matrix operation
 * 
 * 
 * @todo
 * Transpose, inverse, determinant
 * 
 * Types of matrix
 * https://www.mathsisfun.com/algebra/matrix-types.html
 * 
 */
const MatrixMixin = ((length) => {
    
    const mixins = {};

    mixins.type = length;

    // check if two matrices are equal by comparing 
    // their roow and column length
    const isEqual = (m1, m2) => {
        if (m1.length === m2.length && m2[0].length === m1[0].length)
            return 0;
        else
            throw TypeError("Invalid Matrix Operation: Matrix must be of equal length");
    };


    // initialise a length matrix
    mixins.create = (...arg) => {
        let res = [];
        for(let i=0; i < length; i++) {
            res.push([]);
            for(let j=0; j < length; j++)
                res[i][j] = arg[i * length + j] || 0;
        };
        return res;
    };

    
    mixins.add = (mat1, mat2) => {
        isEqual(mat1, mat2);
        let res = mixins.create();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                res[i][j] = mat1[i][j] + mat2[i][j];
            }
        };
        return res;
    };


    mixins.sub = (mat1, mat2) => {
        isEqual(mat1, mat2);
        let res = mixins.create();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                res[i][j] = mat1[i][j] - mat2[i][j];
            }
        };
        return res;
    };


    // multiply a matrix by a number
    mixins.multiplyScalar = (mat, s) => {
        let res = mixins.create();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                res[i][j] = mat[i][j] * s;
            }
        };
        return res;
    };


    /**
     * @description multiply a vector by a matrix
     * input format
     * vec = {x, y, w} || {x, y, z, w};
     * mat = new Array(vec.length)
     * 
     * @param {Array} mat a length matrix
     * @param {Object} vec a vector having the property x/y/w || x/y/z/w
     * @returns {Array} the product of vec and mat
     */
    mixins.multiplyVector = (mat, vec) => {
        let v = [vec.x, vec.y];
        if (vec.z !== undefined)
            v.push(vec.z);
        v.push(vec.w || 1);

        if(v.length !== mat.length)
            throw TypeError("Invalid Column Major Operation: Vector must be the size of a matrix row");

        let sum;
        let resArr = [];
        for(let i=0; i < length; i++) {
            sum = 0;
            for(let j=0; j < length; j++) {
                sum += v[j] * mat[j][i];
            }
            resArr.push(sum);
        };
        return resArr;
    };


    // multiply a matrix by a matrix
    mixins.multiplyMatrix = (mat1, mat2) => {
        isEqual(mat1, mat2);
        let m = mixins.create();
        let res = [];
        let sum;
        for(let i=0; i < length; i++) {
            res.push([]);
            for(let j=0; j < 4; j++) {
                sum = 0;
                for(let k=0; k < 4; k++) {
                    let dot = mat1[k][i] * mat2[j][k];
                    sum += dot;
                }
                m[i][j] = sum;
            }
        };
        return m;
    };


    // A Transpose is where we swap entries across the main diagonal (rows become columns)
    mixins.transpose = () => {

    };


    // An Identity Matrix has 1s on the main diagonal and 0s everywhere else
    mixins.identity = () => {
        let m = mixins.create();
        for(let i=0; i < length; i++) 
            m[i][i] = 1;
        return m;
    };

    
    /**
     * @description A scalar matrix has all main diagonal entries the same, with zero everywhere else
     * 
     * @param {Number} n The value of the diagonals
     * @returns {Array} A scalar matrix
     */
    mixins.scalar = n => {
        let m = mixins.create();
        for(let i=0; i < length; i++) 
            m[i][i] = n;
        return m;
    };


    /**
     * @description A diagonal matrix has zero anywhere not on the main diagonal
     * 
     * @param  {...any} arg Value of each item in diagonal
     * @returns {Array} a scalar matrix
     */
    mixins.diagonal = (...arg) => {
        let m = mixins.create();
        for(let i=0; i < length; i++) 
            m[i][i] = arg[i] || 0;
        return m;
    };

    return mixins;

});



class Mat3x3 {
    static rotation(a) {
        let m = this.create();
        m[0][0] = Math.cos(a);
        m[0][1] = -Math.sin(a);
        m[1][0] = Math.sin(a);
        m[1][1] = Math.cos(a);
        m[2][2] = 1;
        return m;
    }

};


class Mat4x4 {
    static pitchRotation(a) {
        let m = this.create();
        m[0][0] = 1;
        m[1][1] = Math.cos(a);
        m[1][2] = -Math.sin(a);
        m[2][1] = Math.sin(a);
        m[2][2] = Math.cos(a);
        m[3][3] = 1;
        return m;
    }

    static yawRotation(a) {
        let m = this.create();
        m[0][0] = Math.cos(a);
        m[0][2] = -Math.sin(a);
        m[1][1] = 1;
        m[2][0] = Math.sin(a);
        m[2][2] = Math.cos(a);
        m[3][3] = 1;
        return m;
    }

    static rollRotation(a) {
        let m = this.create();
        m[0][0] = Math.cos(a);
        m[0][1] = -Math.sin(a);
        m[1][0] = Math.sin(a);
        m[1][1] = Math.cos(a);
        m[2][2] = 1;
        m[3][3] = 1;
        return m;
    }

};

Object.assign(Mat3x3, MatrixMixin(3));
Object.assign(Mat4x4, MatrixMixin(4));