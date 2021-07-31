/**
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
 * 
 * containing export classes [
 * Mat3x3
 * Mat4x4
 * ]
 * 
 * private classes and functions [
 * MatrixMixin
 * ]
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



export class Mat3x3 {

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


export class Mat4x4 {

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