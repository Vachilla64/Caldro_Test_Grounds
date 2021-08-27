const Mat = (length => {

    if(length !== 3 && length !== 4)
        throw TypeError("Only a 3x3 and 4x4 matrix supported");

    const mat = {};

    mat.create = (...args) => {
        const buffer = new ArrayBuffer(4 * length * length);
        const arr = new Float32Array(buffer).map((val, i) => args[i] || 0);
        return arr;
    };

    mat.add = (m1, m2) => {
        return m1.map((val, i) => val + m2[i]);
    }

    mat.sub = (m1, m2) => {
        return m1.map((val, i) => val - m2[i]);
    }

    mat.multiplyScalar = (m1, s) => {
        return m1.map(val => val * s);
    }

    /**
     * A diagonal matrix has zero anywhere not on the main diagonal
     * 
     * @param  {...any} arg Value of each item in diagonal
     * @returns {Array} a diagonal matrix
     */
    mat.diagonal = (...arg) => {
        let m = mat.create();
        for(let i=0; i < length; i++) 
            m[i * length + i] = arg[i] || 0;
        return m;
    };


    /**
     * An identity matrix has zero anywhere and 1 on it's main diagonal
     * @returns {Float32Array} an identity matrix
     */
    mat.identity = () => mat.diagonal(1, 1, 1);


    mat.translate = (...args) => {
        let m = mat.identity();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                if(j + 1 == length) 
                    m[i * length + j] = args[i] || 1;
            }
        }
        return m;
    }


    mat.transpose = m => {
        const size = m.length / length;
        const copy = mat.clone(m);
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                m[i * length + j] = copy[j * length + i];
            }
        };
        return m;
    };


    mat.rotate = (m, clockwise = true) => {
        const size = m.length / length;
        const copy = mat.clone(m);
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                let y = clockwise ? length - 1 - j : j;
                let x = clockwise ? i : length - 1 - i;
                m[i * length + j] = copy[y * length + x];
            }
        };
        return m;
    }


    mat.multiplyVector = (m, v) => {
        const column = m.length / 3;
        const row = v.length;
        if(column != row) {
            throw TypeError("Left hand column must be equal to right hand row");
        };
        let sum = 0;
        let res = [];
        for(let i=0; i < row; i++) {
            sum = 0;
            for(let j=0; j < column; j++) {
                sum += m[i * length + j] * v[j];
            };
            res[i] = sum;
        };
        return res;
    };


    mat.multiplyMatrix = (m1, m2) => {
        const column = m1.length / length;
        const row = m2.length / length;
        const size = column;
        if(column != row) {
            throw TypeError("Left hand column must be equal to right hand row");
        };
        const copy = mat.create();
        let sum;
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                sum = 0;
                for(let k=0; k < size; k++) {
                    let a = m1[i * length + k];
                    let b = m2[k * length + j];
                    sum += a * b;
                };
                copy[i * length + j] = sum;
            }
        };
        return copy;
    };

    /**
     * Create a copy of a matrix
     * @param {Mat} m - A matrix to be cloned
     * @returns {Float32Array} a replica of it's argument
     */
    mat.clone = m => mat.create(...m);

    return mat;

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


Object.assign(Mat3x3, Mat(3));
Object.assign(Mat4x4, Mat(4));