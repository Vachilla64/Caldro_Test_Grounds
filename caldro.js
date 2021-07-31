

const REPOSITORY = "github.com/Vachilla64/Caldro";const CONTAINERS = [];// errors
const INVALID_VECTOR = (msg = "Please provide an appropriate vector's type") => new CustomError("NOT_A_VECTOR", msg);const INVALID_SCENE = (msg = "Please provide an appropriate Scene/HTMLElement type") => new CustomError("NOT_A_SCENE", msg);


window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000/60);
    }
})();


Object.defineProperties(HTMLElement.prototype, {
   
    css: {
		value: function(styles) {
			if(!styles instanceof Object) 
				throw new Error(`CSS Styling data must be an instanceof an Object`)
			let res = "";
			for(const key in styles) {
				this.style[key] = styles[key];
			}
		},
        configurable: true
	},

	attr: {
		value: function(attrs) {
			if(!attrs instanceof Object) 
				throw new Error(`ATTR data must be an instanceof an Object`)
			for(const key in attrs) {
				this[key] = attrs[key];
			}
		},
        configurable: true
	},

	setFullScreen: {
		value: function(eventListener) {
			let _this = this;
			this.addEventListener(eventListener, () => {
				if (_this.requestFullscreen) 
					_this.requestFullscreen();
				else if (_this.mozRequestFullScreen) 
					_this.mozRequestFullScreen();
				else if (_this.webkitRequestFullscreen) 
					_this.webkitRequestFullscreen();
				else if (_this.msRequestFullscreen) 
					_this.msRequestFullscreen();
			});
		},
		configurable: false,
		writable: false
	}
    
});



Object.defineProperties(Math, {

	degToRad: {
		value:function(number) {
			return number * this.PI / 180;
		},
        configurable: true,
	},

	radToDeg: {
		value: function(number) {
			return number * 180 / this.PI;
		},
        configurable: true,
	},

	randRange: {
		value: function(min, max) {
			return this.random() * (max - min + 1) + min;
		},
        configurable: true,
	},

	clamp: {
		value: function(min, max, val) {
			return this.min(this.max(min, +val), max);
		},
        configurable: true,
	}
    
});



class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }

};


/**
 * Draw Polygon
 * Draw filled Shape
 */
CanvasRenderingContext2D.prototype.__proto__ = {

	colorStyle: undefined,

	set fillStyle(val) {
		let color;
		if(val instanceof Color)
			color = val.toString();
		else color = val;
		this.colorStyle = color;
		this.fillStyle = this.colorStyle;
	},

	set strokeStyle(val) {
		let color;
		if(val instanceof Color)
			color = val.toString();
		else color = val;
		this.colorStyle = color;
		this.strokeStyle = this.colorStyle;
	}

};
/**
 * Vector Mixin class:
 * Contains common operations for each vector's type [2d, 3d]
 * 
 * export classes [
 * Vector2, 
 * Vector3
 * ]
 * 
 * private classes and functions [
 * VectorMixin
 * ]
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

    get angle() {
        return Math.atan2(this.y, this.x);
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

};
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
class Color {
    constructor(h=0, s=0, l=0, a=255) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    add(color) {
        let res = new Color();
        res.h = this.h + color.h;
        res.s = this.s + color.s;
        res.l = this.l + color.l;
        res.a = this.a + color.a;
        return res;
    }

    sub(color) {
        let res = new Color();
        res.h = this.h - color.h;
        res.s = this.s - color.s;
        res.l = this.l - color.l;
        res.a = this.a - color.a;
        return res;
    }

    toString() {
        return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }

};


Object.assign(Color, {
    Red: new Color(0, 100, 50),
    Green: new Color(120, 100, 50),
    Blue: new Color(250, 100, 50),
    Purple: new Color(270, 100, 50),
    Black: new Color(0, 0, 0, 0),
    White: new Color(360, 100, 100)
});
class Preloader {
    /**
     * @description loads a single image file
     * @param {String} src location of the image
     * @returns {Promise}
     */
    static loadImage(src) {
        let img;
        if(src instanceof HTMLImageElement)
            img = src;
        else {
            img = new Image();
            img.src = src;
        };
        console.log("ggg");
        let promise =  new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                resolve(img);
            });
            img.addEventListener("error", () => {
                reject();
            });
        });
        return promise;
    }

    // const loadFiles = (data, _this) => {
    //     let req = new XMLHttpRequest();
    //     req.onreadystatechange = function() {
    //         if(req.readyState === XMLHttpRequest.DONE) {
    //             if(req.status === 200) {
    //                 _this._preloadedAssetsCounter++;
    //                 data.res = req.responseText;
    //                 _this.loadingFunction();
    //             } else {
    //                 this.error = `Bad Internet Connection`;
    //                 _this.status = "failed";
    //             }
    //         }
    //     };
    //     req.open("GET", data.src);
    //     req.send();
    // }


    /**
     * @description load multiple images
     * @param  {...any} args Data for the images
     * @returns 
     * arg = {src, id}
     */
     static loadImage(...args) {
        
    }

    static loadDocument() {
        
    }

    static loadAudio() {
        
    }

    static loadURL() {
        
    }

    constructor() {

    }

    async start() {

    }

};
/**
 * FireBase
 * local storage
 * JSON
 */

class DataBase {


};
class WebScraper extends DOMParser {


};
function appendSceneToParent(type, scene, parent, w, h) {
    if(parent instanceof HTMLElement)
        parent.appendChild(scene);
    else if(parent instanceof Scene)
        parent.element.appendChild(scene);

    if(!(type.toLowerCase() === "canvas")) {
        scene.style.width = w;
        scene.style.height = h;
    }
};


/**
 * 
 */
class Scene {
    constructor(type, parent, w=300, h=300) {
        if(!(parent instanceof HTMLElement) && !(parent instanceof Scene));
            // throw 
        this.type = type;
        this.element = document.createElement(this.type);
        this.parentElement = parent;

        if(document.readyState === "complete") {
            appendSceneToParent(this.type, this.element, parent);
        }
        else {
            window.addEventListener("load", () => {
                appendSceneToParent(this.type, this.element, parent);
            });
        }
    }

    set parentElement(ele) {
        if(ele instanceof HTMLElement)
            ele.appendChild(this.element);
        else if(ele instanceof Scene)
            ele.element.appendChild(this.element);
    }

    css(styles) {
        this.element.css(styles);
    }

    attr(_attrib) {
        this.element.attr(_attrib);
    }

    setFullScreen(eventListener) {
        this.element.setFullScreen(eventListener)
    }

};


const Canvas = (() => {
    let width, height, clearColor;
    let isDynamic;

    let deltaTimeStarted, 
        deltaTime,
        fpsTimeStarted,
        fps,
        elapsedTimeStarted;

    class Canvas extends Scene {

        constructor(parent, w = 300, h = 150, animate = false) {
            super("canvas", parent);
            this.width = w;
            this.height = h;
            this.context2d = this.element.getContext("2d");
            this.requestAnimationFrame = animate;
        }
    
        set width(v) {
            width = v;
            this.element.width = width;
        }
    
        set height(v) {
            height = v;
            this.element.height = height;
        }

        set clearColor(val) {
            clearColor = val;
        }

        set requestAnimationFrame(val) {
            isDynamic = val;
        }

        get clearColor() {
            return clearColor;
        }

        get elapsedTime() {
            return new Date().getTime() - elapsedTimeStarted;
        }

        get fps() {
            fps = 1000 / (this.currentTime - fpsTimeStarted);
            fpsTimeStarted = this.currentTime;
            return fps;            
        }

        get deltaTime() {
            deltaTime = Math.abs(this.currentTime - deltaTimeStarted) * 0.001;
            deltaTimeStarted = this.currentTime;
            if(deltaTime > 0.2)
                deltaTime = 0;
            return deltaTime;
        }

        clear(x1, y1, x2, y2) {
            let x = x1 || 0;
            let y = y1 || 0;
            let w = x2 || this.element.width;
            let h = y2 || this.element.height;
            if(clearColor === undefined) {
                this.context2d.clearRect(x, y, w, h);
            } else {
                this.context2d.fillStyle = clearColor;
                this.context2d.fillRect(x, y, w, h);
            }
        }
    
        mainLoop() {
            if(!(typeof this.update === "function"))
                throw new Error("Canvas Must define a virtual update method before calling mainloop");
            fpsTimeStarted = new Date().getTime();
            deltaTimeStarted = new Date().getTime();
            elapsedTimeStarted = new Date().getTime();
            if(isDynamic) {
                const animate = () => {
                    this.currentTime = new Date().getTime();
                    this.clear();
                    this.update();
                    requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            } else this.update();
        }
    
    };

    return Canvas;

})();


class GameEngine extends Scene {
    constructor(w, h) {
        super("section", document.body, w, h);
        this.element.css({
            position: "absolute",
            top: "0px",
            left: "0px",
            width: w + "px",
            height: h + "px",
            zIndex: 9000
        });
        this.scenes = [];
    }

    addScene(scene) {
        this.element.appendChild()
    }

    update() {

    }

    start() {

    }

};
class Collision {
    static AABB() {

    }

    static SAT() {
        
    }

};


const INVALID_POS_TYPE = "Shape position must be a vector2 or vector3 type";
const INVALID_RECTANGLE_SIZE = "Rectangle size must be a vector2 or vector3 type";
const INVALID_POLYGON_DATA = "All Polygon data must be a vector2 or vector3 type";


class ShapeMixin {
    constructor(type, ...args) {
        this.type = type; // [circle, rectangle, polygon]

        if(!(args[0] instanceof e.Vector2) && !(args[0] instanceof e.Vector3))
            throw INVALID_VECTOR(INVALID_POS_TYPE);

        this.pos = args[0];
        if(this.type === "circle") 
            this.radius = args[1];
        else if(this.type === "rectangle") {
            if(!(args[1] instanceof e.Vector2) && !(args[1] instanceof e.Vector3))
                throw INVALID_VECTOR(INVALID_RECTANGLE_SIZE);
            this.size = args[1];
        } else if(this.type === "polygon") {
            if(args.some(i => !(i instanceof e.Vector2) && !(i instanceof e.Vector3)))
                throw INVALID_VECTOR(INVALID_POLYGON_DATA);
            this.vertices = [];
            for(let i=1; i < args.length; i++) 
                this.vertices.push(args[i]);
        }          
    }

    setRotation() {

    }


    move() {

    }

};

/**
 * Get bounding rect
 * get bounding circle
 * set image fill and make ctx draw them
 */

class CircleShape extends ShapeMixin {
    constructor(pos, radius = 0) {
        super("circle", pos, radius);
    }

};


