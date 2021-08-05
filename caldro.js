const DEBUG = false;
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







const defaultExport = "This file has been included";
const createVector = type => {	if(typeof type === "string")
		return type === "3d" ? new Vector3() : new Vector2();
	else if(typeof type === "object") {
		if(type.hasOwnProperty("z"))
			return new Vector3(type.x, type.y, type.z);
		else return new Vector2(type.x, type.y);
	}
};

const DEBUG_LOG = (type, msg) => {	if(DEBUG)
		window.console[type](msg);
};


// converts object data format to css 
// {backgroundColor: red}	#input 
// background-color: red	#result
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


/**
 * @todo
 * Fix for android check
 */
const deviceName = () => {	const devices = [];
	// Opera 8.0+
	const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf('OPR/') >= 0;
	devices.push(isOpera);
	// Firefox 1.0+
	const isFirefox = typeof InstallTrigger !== 'undefined';
	devices.push(isFirefox);
	// At least Safari 3+: "[object HTMLElementConstructor]"
	const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	devices.push(isSafari);
	// Internet Explorer 6-11
	const isIE = /*@cc_on!@*/false || !!document.documentMode;
	devices.push(isIE);
	// Edge 20+
	const isEdge = !isIE && !!window.StyleMedia;
	devices.push(isEdge);
	// Chrome 1+
	const isChrome = !!window.chrome && !!window.chrome.webstore;
	devices.push(isChrome);
	// Blink engine detection
	const isBlink = (isChrome || isOpera) && !!window.CSS;
	devices.push(isBlink);
	// ios
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


// Cross-Platform request Animation Frame
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000/60);
    }
})();


// HTML Element's extension
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



// Math Object Extension
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



// Canvas 2d rendering context extension
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
    mixins.transpose = (mat) => {
        let m = mixins.create();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                m[j][i] = mat[i][j];
            }
        };
        return m;
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
// needed to access Math.clamp


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
    // current media added to buffer
    let images = [], 
        audios = [], 
        urls = [];

    // all loaded medias
    const loadedImages = [], 
          loadedAudios = [], 
          loadedUrls = [];

    // preloader object API
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

    // {src, id}
    preloader.addUrls = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                urls.push(arg);
        });
    };


    // call this function to start preloading every objects in 
    // their respected buffer
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
 * @todo
 * Add orientation mode for landscape and offset fixin
 */

/**
 * @description append scene element to parent element
 * @param {HTMLElement | Scene} scene Element
 * @param {HTMLElement | Scene} parent Element
 */
const appendSceneToParent = (scene, parent) => {
    if(parent instanceof HTMLElement) {
        parent.appendChild(scene);
    }
    else if(parent instanceof Scene) {
        parent.element.appendChild(scene);
    }
};


/**
 * Scene class is suitable for creating HTML Element
 * If parent element is specified, the scene silently 
 * wait for DOM to be loaded and append it's element to the parent element
 */
class Scene {
    /**
     * 
     * @param {String} type type of the element to be created by tag
     * @param {HTMLElement | String | null} parent reference to the parent element
     * @param {String} w width of the element in css format 
     * @param {String} h height of the element in css format
     */
    constructor(type, parent, w = "300px", h = "300px") {
        this.type = type;
        this.element = document.createElement(this.type);
        this._parentElement = parent;
        this.parentElement = parent;
        this._width = w;
        this._height = h;
        this._parentElementInitialised = 0;
        this._orientation = "potrait";
        this._id = "scene@"+Math.random() * parseInt(Math.random() * 5000);
        this._className = undefined;
        this.css({width:w, height: h});
        if(document.readyState === "complete") {
            appendSceneToParent(this.element, this.parentElement);
        } else {
            window.addEventListener("load", () => {
                appendSceneToParent(this.element, this.parentElement);
            });
        }
    }

    set parentElement(parent) {
        if(!this._parentElementInitialised) {
            this._parentElement = parent;
            this._parentElementInitialised++;
        } else {
            if(!(parent instanceof HTMLElement) && !(parent instanceof Scene))
                throw TypeError("Parent Element must be an instance of Scene | HTMLElement");
            this._parentElement = parent instanceof Scene ? parent.element : parent;
            this._parentElement.append(this.element);
        }
    }

    get parentElement() { 
        if(this._parentElement instanceof HTMLElement)
            return this._parentElement;
        else if(this._parentElement instanceof Scene)
            return this._parentElement.element;
    }

    set className(val) { this._className = val; }

    get className() { return this._className; }

    set id(val) {this._id = val; }

    get id() { return this.id; }

    set orientation(val) {
        this._orientation = val;
        if(this._orientation === Scene.Portrait) {
            DEBUG_LOG("log", Scene.Portrait);
            DEBUG_LOG("log", "Portait Method is not implemented yet");
        } else if(this._orientation === Scene.LandScape) {
            DEBUG_LOG("log", Scene.LandScape);
            this.css({
                transformOrigin: "0 0",
                transform: "rotate(90deg)",
                position: this.getStyle("position") === "<empty string>" ? 
                    "absolute" : this.getStyle("position"),
                left: `${this.getStyle("height")}`
            });
        } else {
            console.warn(`Cannot set orientation to an unknown type: ${val}`);
            DEBUG_LOG("table", {
                "Scene.Portrait": Scene.Portrait,
                "Scene.LandScape": Scene.LandScape,
            });
        }
    }

    getStyle(props) {
        return this.element.style.getPropertyValue(props);
    }

    get orientation() { return this._orientation; };

    set width(w) {
        this._width = w;
        this.element.style.width = this._width;
    }

    get width() { return this._width; }

    set height(h) {
        this.height = h;
        this.element.style.height = this._height;
    }

    get height() { return this._height; }

    css(styles) { this.element.css(styles); }

    attr(_attrib) { this.element.attr(_attrib); }

    addEventListener(type, func) { this.element.addEventListener(type, func); }

    setFullScreen(eventListener) {
        this.element.setFullScreen(eventListener);
        DEBUG_LOG("log", "setFullScreen expects an event listener type as argument: onclick...");
    }

};


Object.defineProperties(Scene, {
    LandScape: {
        value: "Rotate the scene by 90deg",
        configurable: false,
    }, 
    Portrait: {
        value: "Rotate the scene by either 0deg or 90deg",
        configurable: false
    }
});


/**
 * GameArea is like an extension to HTMLCanvasElement 
 * it inherit from scene
 */
class GameArea extends Scene {
    /**
     * 
     * @param {HTMLElement | Scene | null} parent Where the element should be appended
     * @param {Number} w width of the canvas
     * @param {Number} h height of the canvas
     */
    constructor(parent, w = 300, h = 150) {
        super("canvas", parent);
        this.context2d = this.element.getContext("2d");
        this.width = w;
        this.height = h;
        this._cycles = 0;
        this._deltaTimeStarted = 0, 
        this._deltaTime = 0,
        this._fpsTimeStarted = 0,
        this._fps = 0,
        this._elapsedTimeStarted = 0;
        this.clearPreviousFrame = true;
    }

    set width(v) {
        this.element.width = v;
        this.element.style.setProperty("width", `${v}px`);
    }

    set height(v) {
        this.element.height = v;
        this.element.style.setProperty("height", `${v}px`);
    }

    get width() { return this.element.width; }

    get height() { return this.element.height; }

    set clearColor(val) { this._clearColor = val; }

    get clearColor() { return this._clearColor; }

    get elapsedTime() {
        return new Date().getTime() - this._elapsedTimeStarted;
    }

    get fps() {
        this._fps = 1000 / (this.currentTime - this._fpsTimeStarted);
        this._fpsTimeStarted = this.currentTime;
        return this._fps;            
    }

    get deltaTime() {
        this._deltaTime = Math.abs(new Date().getTime() - this._deltaTimeStarted) * 0.001;
        this._deltaTimeStarted = this.currentTime;
        if(this._deltaTime > 0.2)
            this._deltaTime = 0;
        return this._deltaTime;
    }

    getDeltaTime() {
        let dt = Math.abs(this.currentTime - this._deltaTimeStarted) * 0.001;
        this._deltaTimeStarted = this.currentTime;
        if(dt > 0.2)
            dt = 0;
        return dt;
    }

    // how many time has the update function been called
    get cycles() { return this._cycles; }

    // if the clearColor was undefined, it clears the specified region in transparency
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

    mainLoop(dynamic) {
        if(!(typeof this.update === "function"))
            throw new Error("Canvas Must define a virtual update method before calling mainloop");
        this._fpsTimeStarted = new Date().getTime();
        this._deltaTimeStarted = new Date().getTime();
        this._elapsedTimeStarted = new Date().getTime();
        if(dynamic === GameArea.Dynamic) {
            DEBUG_LOG("log", "GameArea starts with a gameLoop");
            const animate = () => {
                this._cycles++;
                this.currentTime = new Date().getTime();
                if(this.clearPreviousFrame) {
                    this.clear();
                }
                this.update();
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        } else if(dynamic === GameArea.Static) {
            DEBUG_LOG("log", "GameArea starts with no gameLoop");
            this.update();
        }
        else {
            console.warn(`MainLoop starting in a static mode because "mode: ${dynamic}" is unknown`);
            this.update();
            DEBUG_LOG("table", {
                "GameArea.Static": GameArea.Static,
                "GameArea.Dynamic": GameArea.Dynamic
            });
        }
    }

};



Object.defineProperties(GameArea, {
    LandScape: {
        value: "Rotate the scene by 90deg",
        configurable: false,
    }, 
    Portrait: {
        value: "Rotate the scene by either 0deg or 90deg",
        configurable: false
    },
    Static: {
        value: "Run update function without RAF",
        configurable: false,
    },
    Dynamic: {
        value: "Run update function with RAF",
        configurable: false,
    }
});


class Loader extends Scene {
    constructor(parent = document.body, bgColor="#fff", color="teal") {
        super("div", parent, `${window.innerWidth}px`, `${window.innerHeight}px`);
        this.id = "caldro@loader";
        this.hasLoaded = Symbol("Single loader");
        if(!(Loader.loaded === this.hasLoaded.toString())) 
            Loader.loaded = this.hasLoaded.toString();
        else 
            throw new Error("You can only make a single instance of this class");
        
        let color1 = bgColor instanceof Color ? bgColor.toString() : bgColor;
        let color2 = color instanceof Color ? color.toString() : color;
        this.css({backgroundColor: color1});
        let div = document.createElement("div");
        div.id = "caldro_loader";
        this.element.appendChild(div);
        let style = document.createElement("style");
        style.innerHTML = `
        #caldro_loader {
            width: 100px;
            height: 25px;
            border-top: 10px dotted ${color2};
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
        document.body.appendChild(style);
    }

    hide() {
        this.element.display = "none";
    }

    show() {
        this.element.display = "block";
    }

};

Object.defineProperties(Loader, {
    loaded: {
        value: false,
        configurable: false,
        writable: true
    }
});
class Collision {
    static AABB() {

    }

    static SAT() {
        
    }

    static Tiled() {
        
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
