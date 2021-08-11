/**
 * This function houses basic utility functions
 * 
 * Exports = [
 * defaultExport 	(var)
 * createVector  	(func)
 * DEBUG_LOG		(func)
 * deviceName		(func)
 * ]
 * 
 *
 * Extensions
 * - window.requestAnimationFrame
 * - HTML Object (css, attr, setFullScreen)
 * - Math Object (degToRad, radToDeg, iRange, eRange, clamp)
 * - CanvasRenderingContext2D (fillStyle, strokeStyle, polygon...)
*/





const createVector = type => {	if(typeof type === "string")
		return type === "3d" ? new Vector3() : new Vector2();
	else if(typeof type === "object") {
		if(type.hasOwnProperty("z"))
			return new Vector3(type.x, type.y, type.z);
		else return new Vector2(type.x, type.y);
	}
};


/**
 * Define interface of a type
 * An interface is what a given object is expected to have, for example 
 * Vector2 must have [x, y]
 * Vector3 must have [x, y, z]
 * Color must have [r, g, b and/or a]
 * 
 * Vector3 is a proper interface to vector2 
 * Vector2 cannot be an interface to vector3
 */
function _defineInterface(...args) {	const res = {};
	args.forEach(i => res[i] = null);
	return Object.freeze(res);
}


/**
 * Check if obj is a proper interface to interface
 */
function _hasImplementInterface(obj, _interface){	return Object.keys(_interface).every(i => obj.hasOwnProperty(i));
};


function decorate(obj, decorator) {	Object.assign(obj, decorator);
};


const DEBUG_LOG = (type, msg) => {	if(DEBUG)
		window.console[type](msg);
};


const stringToCssFormat = (string) => {	let res = "";
	for(let i=0; i < string.length; i++) {
		if(string[i].codePointAt() >= 65 && string[i].codePointAt() <=90) {
			res += "-";
			res += string[i].toLowerCase();
			res += string[++i];
		} else
			res += string[i];
	};
	return res;
};

const splitCSSValue = val => {	let res = ["", ""];
	let i = 0;
	let sVal = String(val);
	while(i < sVal.length) {
		let current = sVal[i];
		if(isNaN(current))
			res[1] += current;
		else if(!isNaN(current))
			res[0] += current;
		i++;
	};
	return res;
};


/**
 * @todo
 * Fix for android check
 */
const deviceName = () => {	const devices = [];
	const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf('OPR/') >= 0;
	devices.push(isOpera);
	const isFirefox = typeof InstallTrigger !== 'undefined';
	devices.push(isFirefox);
	const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	devices.push(isSafari);
	const isIE = /*@cc_on!@*/false || !!document.documentMode;
	devices.push(isIE);
	const isEdge = !isIE && !!window.StyleMedia;
	devices.push(isEdge);
	const isChrome = !!window.chrome && !!window.chrome.webstore;
	devices.push(isChrome);
	const isBlink = (isChrome || isOpera) && !!window.CSS;
	devices.push(isBlink);
	const isIos = false;
	devices.push(isIos);
	let names = [
		"opera",
		"firefox",
		"safari",
		"ie",
		"edge",
		"chrome",
		"blink",
		"ios"
	];
	let res = "android";
	devices.forEach((d, i) => {
		if(d) res = names[i];
	});
	return res;
};


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
			for(const key in styles) {
				let res = stringToCssFormat(key);
				if(styles[key] instanceof Color) {
					this.style.setProperty(res, styles[key].toString())
				} else {
					this.style.setProperty(res, styles[key]);
				}	
			}
		},
        configurable: true
	},

	getCss: {
		value: function(val) {
			return this.style.getPropertyValue(val);
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

	/**
	 * Exclusive interval range [min, max]
	 * Returns a number between min and max [Max included]
	 */
	eRange: {
		value: function(min, max) {
			return this.random() * (max - min + 1) + min;
		},
        configurable: true,
	},

	/**
	 * Inclusive interval range [min, max)
	 * Returns a number between min and max [Max excluded]
	 */
	iRange: {
		value: function(min, max) {
			return this.random() * (max - min) + min;
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


/**
 * Custom Error, this class is bound to be modified later in the future
 */
class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }

};



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
	},

	polygonShape(arg) {
		if(arg instanceof Shape.Polygon) {
			if(arg.fillStyle) {
				this.fillStyle = arg.fillStyle;
			} 
			if(arg.strokeStyle) {
				this.strokeStyle = arg.strokeStyle;
			}
			this.beginPath();
			this.moveTo(arg.vertices[0].x, arg.vertices[0].y)
			for(let i=1; i < arg.vertices.length; i++) 
				this.lineTo(arg.vertices[i].x, arg.vertices[i].y);
			this.closePath();
			if(arg.fillStyle) this.fill();
			if(arg.strokeStyle) {
				this.stroke();
			}
		} else {
			console.warn("Argument to polygonShape must be an instance of ShapeMixin");
		}
	},


	circleShape(arg) {
		if(arg instanceof Shape.Circle) {
			if(arg.fillStyle) {
				this.fillStyle = arg.fillStyle;
			} 
			if(arg.strokeStyle) {
				this.strokeStyle = arg.strokeStyle;
			}
			this.beginPath();
			this.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
			this.closePath();
			if(arg.fillStyle) this.fill();
			if(arg.strokeStyle) {
				this.stroke();
			}
		} else {
			console.warn("Argument to polygonShape must be an instance of ShapeMixin");
		}
	}

};


const DEBUG = false;
const Interface = Object.freeze({
    point: _defineInterface("x", "y"),
    circle: _defineInterface("pos", "radius"),
    wedge: _defineInterface("pos", "radius", "startAngle", "endAngle"),
    arc: _defineInterface("pos", "radius", "startAngle", "endAngle", "innerRadius", "outerRadius"),
    rect: _defineInterface("pos", "size")

});

const COLOR_I = _defineInterface("r", "g", "b", "a");const VECTOR2_I = _defineInterface("x", "y");const VECTOR3_I = _defineInterface("x", "y", "z");
const CIRCLE_I = _defineInterface("pos", "radius");


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
 * inverse, determinant
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

    const isEqual = (m1, m2) => {
        if (m1.length === m2.length && m2[0].length === m1[0].length)
            return 0;
        else
            throw TypeError("Invalid Matrix Operation: Matrix must be of equal length");
    };


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


    mixins.transpose = (mat) => {
        let m = mixins.create();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                m[j][i] = mat[i][j];
            }
        };
        return m;
    };


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


/**
 * @description A simple color class
 * Color exists as a rgba component where 
 * R(red), G(green), B(blue) and A(alpha)
 * 
 * export class = [
 * Color
 * ]
 */
class Color {
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
        if(!(color instanceof Color) && !(color._)) {
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
/**
 * Singleton Preloader class 
 * Able to 
 * -Load images, audios and open link
 * 
 * How it works
 * - This program provides 4 public functions
 * (addImages, addAudios, addUrls, sync)
 * 
 * function starting with "add" creates their respected object from the parameter provided
 *  and push the objects into their  respected buffering array (images, audios, urls) 
 * inside the preloader class.
 * 
 * whenever the sync method is called, this program programmatically loads the current
 * media from the buffer (images, audios, urls) respectively and push the loaded media
 * inside their respected array (loadedImages, ...) and reset their respected buffer to 
 * an empty array
 * 
 * sync method returns a promise of a function (getImage, getAudio, getUrls) to retrieve
 * items from the loaded media array
 * 
 * @author github.com/RuntimeTerror418
 */
const Preloader = (() => {
    let images = [], 
        audios = [], 
        urls = [];

    const loadedImages = [], 
          loadedAudios = [], 
          loadedUrls = [];

    const preloader = {

        _state: "idle",
        _activeFile: "none",

        set state(val) {
            this._state = val;  // idle, interactive, complete
        },

        get state() { return this._state; },

        set currentLoadingFile(val) {
            this._activeFile = val;
        },

        get currentLoadingFile() { return this._activeFile },

    };

    const printables = ["-"];
    for(let i=65, j=0; i <= 122; i++, j++) {
        printables.push(String.fromCodePoint(i));
        printables.push(String(j));
    };

    /**
     * @description This function extract a supposed name from it's argument
     * // input: https://google.com
     * // output: google
     * @param {String} source destination source
     * @returns {String} name of the link
     */
    const getId = (source) => {
        let start = source.lastIndexOf(".");
        let name = "";
        while(printables.includes(source[start - 1])) {
            start--;
            let currentChar = source[start];
            name += currentChar;
        };
        return name.split("").reverse().join("");
    };


    /**
     * @description loads a single image file
     * @param {any} param location of the image
     * @returns {Promise}
     * 
     * param1 = "....jpg"  // string
     * param2 = {src, id}  // object
     */
    const loadImage = param => {
        const img = new Image();
        if(typeof param === "string") {
            img.src = param;
            img.id = getId(param);
        }else if(typeof param === "object") {
            img.src = param.src;
            img.id = param.id || getId(param.src);
        };
        const promise = new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                loadedImages.push(img);
                resolve(1);
            });
            img.addEventListener("error", () => {
                reject("Something went wrong :( while loading " + img.src);
            })
        });
        return promise;
    };


    /**
     * @description loads a single audio file
     * @param {String} src location of the audio
     * @returns {Promise}
     */
     const loadAudio = param => {
         let src = typeof param === "string" ? param : param.src;
        const audio = new Audio(src);
        audio.load();
        audio.loop = param.loop || true;
        let promise = new Promise((resolve, reject) => {
            audio.addEventListener("canplaythrough", function() {
                loadedAudios.push(audio);
                resolve(1);
            });
            audio.addEventListener("error", () => {
                reject("Something went wrong ;( while loading " + audio.src);
            });
        });
        return promise;
    };


    /**
     * @description loads a single url link
     * @param {String} src location of the link
     * @returns {Promise}
     */
     const loadUrl = param => {
        if(typeof param === "object") {
            param.res = "";
        } else if(typeof param === "string") {
            let old = param;
            param = {src: old, id: getId(old), res:""}
        };
        let promise = fetch(param.src).then(
            e => e.text()).then(e => {
                param.res = e;
                loadedUrls.push(param);
                return 1;
            });
        return promise;
    };


    preloader.addImages = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                images.push(arg);
        });
    };

    preloader.addAudios = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                audios.push(arg);
        }); 
    };

    preloader.addUrls = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                urls.push(arg);
        });
    };


    preloader.sync = async function(){
        let pImages = [];
        let pAudios = [];
        let pUrls = [];
        preloader.state = "interactive";
        images.forEach(src =>{
            preloader.currentLoadingFile = src;
            pImages.push(loadImage(src));
        });
        images = [];
        audios.forEach(src => {
            preloader.currentLoadingFile = src;
            pAudios.push(loadAudio(src));
        });
        audios = [];
        urls.forEach(src => {
            preloader.currentLoadingFile = src;
            pUrls.push(loadUrl(src));
        });
        urls = [];
        return await Promise.all([...pImages, ...pAudios, ...pUrls])
        .then(e => {
            preloader.state = "complete";
            let res = {
                getImage(id) {
                    if(typeof id === "number")
                        return loadedImages[id];
                    return loadedImages.filter(i => i.id === id)[0];
                },
                getAudio(id) {
                    if(typeof id === "number")
                        return loadedAudios[id];
                    return loadedAudios.filter(i => i.id === id)[0];
                },
                getUrl(id) {
                    if(typeof id === "number")
                        return loadedUrls[id];
                    return loadedUrls.filter(i => i.id === id)[0];
                }
            };
            return res;
        });
    };

    return preloader;

})();
class IndexDB {
};
class Firebase {
    

};

/**
 * @exports 
 * Scene
 * DOMElement
 */

/**
 * Scene is a container type and the base for all the 
 * game area... Every other html tag/element should 
 * be added directly or indirectly to this tag
 * 
 * scene is always appended to the body tag by default
 * 
 * Sample 
 * let a = new Scene("100px", "200px");
 * a.orientation = Scene.LandScape;
 * a.add(some component)
 * 
 * [NOTE] scene can only add components which are valid HTMLElement 
 * or an instance of DOMElement
 * 
 * @todo
 *  - Able to append scene to other tag
 *  - Make orientation switch perfect everyWhere
 */
class Scene {
    constructor(w, h) {
        this.element = document.createElement("section");
        this.element.className = "caldro-dom-scene";
        this.element.id = `caldro-scene-${Scene.id}`;
        this.element.style.backgroundColor = "#000";
        this._rotation = 0;     // use when switching orientation modes
        this.width = w || "100vw";
        this.height = h || "100vh";

        if(document.readyState === "complete") {
            document.body.appendChild(this.element);
        } else {
            window.addEventListener("load", () => {
                document.body.appendChild(this.element);
            });
        };
        Scene.id++;
    }

    set width(w) { this.element.css({width: w}); }

    set height(h) { this.element.css({height: h}); }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }

    set orientation(type) {
        this._orientation = type;
        let oldPositionCSS = this.element.getCss("position");
        let oldHeightCSS = this.element.getCss("height");
        let oldWidthCSS = this.element.getCss("width");
        let oldHeight = splitCSSValue(oldHeightCSS);
        let oldWidth = splitCSSValue(oldWidthCSS);
        if(this._orientation === Scene.LandScape && this._rotation === 0) {
            this._rotation = 90;
            this.element.css({
                width: oldHeightCSS,
                height: oldWidthCSS,
                transformOrigin: "0 0",
                transform: `rotate(90deg)`,
                position: Boolean(oldPositionCSS) ? oldPositionCSS : "absolute",
                left: `${oldWidth[0] + oldWidth[1]}`,
            });
        } else if(this._orientation === Scene.Portrait && this._rotation === 90) {
            this._rotation = 0;
            this.element.css({
                width: oldHeightCSS,
                height: oldWidthCSS,
                transformOrigin: "0 0",
                transform: `rotate(0deg)`,
                position: "absolute",
                left: "0px"
            });
        } else if(this._orientation !== Scene.Portrait && this._orientation != Scene.LandScape){
            DEBUG_LOG("log", 
            `Cannot set orientation to an unknown and/or unrotated scene: ${this._orientation}`);
            DEBUG_LOG("table", {
                "Scene.Portrait": Scene.Portrait,
                "Scene.LandScape": Scene.LandScape,
            });
        }
    }

    add(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement");
        let child;
        if(element instanceof DOMElement) {
            child = element.element;
        } else {
            child = element;
        };
        element.scene = this;
        if(element.parentElement === null) 
            element.parentElement = this.element;
        else
            this.element.appendChild(child);
    }

    setFullScreen(eventListener = "click") {
        let _this = this.element;
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
        DEBUG_LOG("log", "setFullScreen expects an event listener type as argument: onclick...");
    }
};


Object.defineProperties(Scene, {
    id: {
        value: 1, 
        writable: true,
        readable: true, 
        configurable: true
    },
    LandScape: {
        value: "Rotate this Scene by 90deg",
        configurable: false,
    }, 
    Portrait: {
        value: "No rotation applied",
        configurable: false
    }
});



/**
 * DOMElement creates an HTML Tag...
 * By default it will not append the created tag to anything 
 * untill you explicity give the "add" instruction... or add it to a scene
 * 
 * let a = new DOMElement("section");
 * Scene.add(a);   /// 
 * a.add(children)...
 */
class DOMElement {
    constructor(type) {
        this.type = type;
        this.element = document.createElement(this.type);
        this.scene = null;
        this.id = "cladro-element-" + parseInt(Math.random()* 5000);
        this.className = "caldro-dom-element";
    }

    set id(s) {
        this._id = s;
        this.element.id = this._id;
    }

    get id() { return this._id }

    set className(s) {
        this._className = s;
        this.element.className += " " + this._className;
    }

    get className() { return this.element.className; }

    set width(w) { this.element.css({width: w}); }

    set height(h) { this.element.css({height: h}); }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }


    set parentElement(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement)
            && !(element instanceof Scene))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement | Scene");
        this.scene = element instanceof Scene ? element : element.scene;
        let par = element instanceof DOMElement || element instanceof Scene ? 
            element.element : element;
        this._parentElement = par;
        par.appendChild(this.element);
    }


    get parentElement() {
        return this._parentElement;
    }

    add(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement | Scene");
        let par = element instanceof DOMElement ?  element.element : element;
        this.element.appendChild(par);
    }

    css(styles) { this.element.css(styles); }

    getStyle(props) { return this.element.style.getPropertyValue(props); }

};

/**
 * @todo 
 * customize icon color
 */
const Loader = (() => {
    const section = document.createElement("section");
    const div = document.createElement("div");
    const style = document.createElement("style");

    div.id = "caldro-loader-icon";
    section.id = "caldro-loader";
    section.className = "caldro-loader";

    const api = {

        set color1(v) { 
            section.style.backgroundColor = v instanceof Color ? v.toString() : v;
        },
        set color2(v) { 
        }

    };

    api.color1 = "rgba(0, 0, 0, .5)";
    api.color2 = "teal";

    style.innerHTML = `
    #caldro-loader-icon {
        width: 100px;
        height: 25px;
        border-top: 10px dotted teal;
        position: absolute;
        left: calc(50vw - 50px);
        top: calc(50vh - 12px);
        animation: spin 2s linear infinite
    }
    @keyframes spin {
        from {
            border-top: 10px dotted teal;
        } 
        to {
            border-top: 5px dotted teal;
        }
    }`;

    function init() {
        section.css({
            width: "100vw",
            height: "100vh",
            backgroundColor: api.color1,
            position: "absolute",
            zIndex: "9999999"
        });
        document.body.appendChild(style);
        section.appendChild(div);
        document.body.appendChild(section);
    };

    api.css = function(styles) {
        section.css(styles);
    };

    api.hide = function() {
        section.style.display = "none";
    };

    api.show = function() {
        section.style.display = "block";
    };

    if(document.readyState === "complete")
        init();
    else {
        window.addEventListener("load", function() {
            init();
        });
    }

    api.hide();

    return api;
})();

/**
 * Inherited from DOMElement 
 * - Creates a canvas element 
 * width / height must be an integer cos they're represented in pixels
 * Any modification to use css styling on the width and height may 
 * result into a distorted canvas 
 * 
 * @static Dynamic -> says canvas should run on RAF
 * @static Static -> opposite to Dynamic
 * 
 * Sample
 * const a = new GameArea();
 * a.width = innerWidth;
 * a.height = innerHeight;
 * a.update = function(t) {
 *      this.clear(x, y, w, h);
 *      this.context2d.fillStyle = new Color();
 *      this.context2d.fillRect(0, 0, 100, 100);
 * };
 * a.mainLoop(GameArea.Static);
 */
class GameArea extends DOMElement {
    constructor(w = 300, h = 150) {
        super("canvas");
        this.width = w;
        this.height = h;
        this.context2d = this.element.getContext("2d");
        this.time = {}; // cycles, deltaTime, fps, elapsedTime -> passed into update function
    }

    set width(w) {
        if(typeof w === "number") {
            this.element.width = w;
            this.element.css({width: `${w}px`});
        } else 
            console.error("GameArea width must be an integer represented per pixels");
    }

    set height(h) {
        if(typeof h === "number") {
            this.element.height = h;
            this.element.css({height: `${h}px`});
        } else 
            console.error("GameArea height must be an integer represented per pixels");
    }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }

    set clearColor(col) { this._clearColor = col }

    get clearColor() { return this._clearColor; }

    clear(x1, y1, x2, y2) {
        let x = x1 || 0;
        let y = y1 || 0;
        let w = x2 || this.element.width;
        let h = y2 || this.element.height;
        if(this.clearColor === undefined) {
            this.context2d.clearRect(x, y, w, h);
        } else {
            this.context2d.fillStyle = this.clearColor;
            this.context2d.fillRect(x, y, w, h);
        }
    }


    mainLoop(dynamic = GameArea.Static) {
        if(!(typeof this.update === "function"))
            throw new Error("Canvas Must define an update method before calling mainloop");

        if(dynamic === GameArea.Dynamic) {
            DEBUG_LOG("log", "GameArea starts with a gameLoop");

            let cycles = 0;
            let elapsedTimeStarted = new Date().getTime();
            let fpsTimeStarted = new Date().getTime();
            let deltaTimeStarted = new Date().getTime();

            const animate = () => {
                this.time.cycles = ++cycles;
                this.time.currentTime = new Date().getTime();
                this.time.elapsedTime = this.time.currentTime - elapsedTimeStarted;
                this.time.fps = 1000 / (performance.now() - fpsTimeStarted);
                fpsTimeStarted = performance.now();
                this.time.deltaTime = Math.abs(this.time.currentTime - deltaTimeStarted) * 0.001;
                deltaTimeStarted = this.time.currentTime;

                if(this.time.deltaTime > 0.2) this.time.deltaTime = 0;

                this.update(this.time);
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        } else if(dynamic === GameArea.Static) {
            DEBUG_LOG("log", "GameArea starts with no gameLoop");
            this.update({});
        }
        else {
            console.warn(`MainLoop starting in a static mode because "mode: ${dynamic}" is unknown`);
            this.update({});
            DEBUG_LOG("table", {
                "GameArea.Static": GameArea.Static,
                "GameArea.Dynamic": GameArea.Dynamic
            });
        }
        
    }
};


Object.defineProperties(GameArea, {
    Static: {
        value: "Run update function without RAF",
        configurable: false,
    },
    Dynamic: {
        value: "Run update function with RAF",
        configurable: false,
    }
});


class Collision {

    static circTocirc(c1, c2) {
        if(!(_hasImplementInterface(c1, Interface.circle)) || 
            !(_hasImplementInterface(c2, Interface.circle)))
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = c2.pos.x - c1.pos.x;
        let diffY = c2.pos.y - c1.pos.y;
        let diffZ = c2.pos.z - c1.pos.z || 0;
        return Math.hypot(diffX, diffY, diffZ) < (c1.radius + c2.radius);
    }

    static rectTorect(r1, r2) {
        if(!(_hasImplementInterface(r1, Interface.rect)) || 
            !(_hasImplementInterface(r2, Interface.rect)))
            throw TypeError("Rectangle Object Must define the properties [pos, size]");
        return r1.pos.x < r2.pos.x + r2.size.x  && r1.pos.x + r1.size.x > r2.pos.x && 
        r1.pos.y < r2.pos.y + r2.size.y  && r1.pos.y + r1.size.y > r2.pos.y
    }

    static circToRect(circle, rect) {
        if(!(_hasImplementInterface(rect, Interface.rect)))
            throw TypeError("Rectangle Object Must define the properties [pos, size");
        if(!(_hasImplementInterface(circle, Interface.circle)))
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = Math.abs(circle.pos.x - ( rect.pos.x + rect.size.x/2 ) );
        let diffY = Math.abs( circle.pos.y - ( rect.pos.y + rect.size.y/2 ) );
        if( diffX > circle.radius + rect.size.x / 2 ) return false;
        if( diffY > circle.radius + rect.size.y / 2 ) return false; 
        if( diffX <= rect.size.x ) return true;
        if( diffY <= rect.size.y ) return true;
        diffX = diffX - rect.size.x;
        diffY = diffY - rect.size.y;
        return diffX * diffX + diffY * diffY <= circle.radius * circle.radius;
    }

    static isPointInWedge(point, wedge) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(wedge, Interface.wedge))) 
            throw TypeError("Wedge Object Must define the properties [pos, radius, startAngle, endAngle]");
        const PI2 = Math.PI * 2;
        let diffX = point.x - wedge.pos.x;
        let diffY = point.y - wedge.pos.y;
        let r2 = wedge.radius * wedge.radius;
        if( diffX * diffX + diffY * diffY > r2 ) return(false);
        let angle = ( Math.atan2( diffY, diffX) + PI2) % PI2;
        return angle >= wedge.startAngle && angle <= wedge.endAngle;
    }

    static isPointInCirc(point, circle) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(circle, Interface.circle))) 
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = point.x - circle.pos.x;
        let diffY = point.y - circle.pos.y;
        return diffX * diffX + diffY * diffY < circle.radius * circle.radius;
    }

    static isPointInRect(point, rect) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(rect, Interface.rect))) 
            throw TypeError("Rectangle Object Must define the properties [pos, size]");
        return point.x > rect.pos.x && point.x < rect.pos.x + rect.size.x && 
        point.y > rect.size.y && point.y < rect.pos.y + rect.size.y;
    }

    static isPointInArc(point, arc) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(arc, Interface.wedge))) 
            throw TypeError("Arc Object Must define the properties [pos, radius, innerRadius, outerRadius, startAngle, endAngle]");
        let diffX = point.x - arc.pos.x;
        let diffY = point.y - arc.pos.y;
        let dxy = diffX * diffX + diffY * diffY;
        let rrOuter = arc.outerRadius * arc.outerRadius;
        let rrInner = arc.innerRadius * arc.innerRadius;
        if ( dxy < rrInner || dxy > rrOuter) return(false);
        let angle = (Math.atan2(diffY, diffX) + PI2) % PI2;
        return angle >= arc.startAngle && angle <= arc.endAngle;
    }

    static lineSegmentIntercept(l1, l2) {

    }

    static lineSegmentInterceptPoint(l1, l2) {

    }

    static lineSegmentToCirc(l, c) {

    }

    static lineSegmentToRect(l, r) {

    }


    static convexPolygon(p1, p2) {

    }


    static polygon(p1, p2) {

    }

};


/**
 * Load texture and draw Texture
 * bounding client
 * draw rotated
 */
class ShapeMixin {
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




class Polygon extends ShapeMixin {
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





class Rectangle extends Polygon {
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



class Circle extends ShapeMixin {
    constructor(pos, radius = 0, color = undefined) {
        super(pos);
        this.radius = radius;
        this.fillStyle = color;
    }

};
