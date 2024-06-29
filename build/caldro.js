/**
 * @abstract
 * @class 
 * Base class for Vector Object
 */
class Vector {

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
class Vector2 extends Vector {

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
class Vector3 extends Vector {

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


    mat.multiplyVector = (m, vec) => {

        if(!(vec instanceof Vector2) && !(vec instanceof Vector3))
            throw TypeError("Vector must be an instance of `Vector2` or `Vector3` when multiplying matrices by a vector");

        const column = m.length / length;
        const row = vec.components.length + 1;
        if(column != row) 
            throw TypeError("Left hand column must be equal to right hand row");
        
        let sum = 0;
        let v = vec.toArray();
        let res = [];
        for(let i=0; i < row; i++) {
            sum = 0;
            for(let j=0; j < column; j++) {
                sum += m[i * length + j] * v[j];
            };
            res[i] = sum;
        };
        v = row === 4 ? new Vector3(res[0], res[1], res[2], res[3]) 
            : new Vector2(res[0], res[1], res[2]);
        return v;
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
        m[0] = 1;
        m[5] = Math.cos(a);
        m[6] = -Math.sin(a);
        m[9] = Math.sin(a);
        m[10] = Math.cos(a);
        m[15] = 1;
        return m;
    }

    static yawRotation(a) {
        let m = this.create();
        m[0] = Math.cos(a);
        m[6] = -Math.sin(a);
        m[5] = 1;
        m[8] = Math.sin(a);
        m[10] = Math.cos(a);
        m[15] = 1;
        return m;
    }

    static rollRotation(a) {
        let m = this.create();
        m[0] = Math.cos(a);
        m[1] = -Math.sin(a);
        m[4] = Math.sin(a);
        m[5] = Math.cos(a);
        m[10] = 1;
        m[15] = 1;
        return m;
    }

    // https://en.wikipedia.org/wiki/Orthographic_projection
    static orthographicProjection(left, right, bottom, top, near, far) {
        let m = this.create();
        m[0] = 2 / (right - left);
        m[3] = -(right + left) / (right - left);
        m[5] = 2 / (top - bottom);
        m[7] = -(top + bottom) / (top - bottom);
        m[10] = -2 / (far - near);
        m[11] = -(far + near) / (far - near);
        m[15] = 1;
        return m;
    };

};


Object.assign(Mat3x3, Mat(3));
Object.assign(Mat4x4, Mat(4));

// converts object data format to css 
// {backgroundColor: red}	#input 
// background-color: red	#result
const stringToCssFormat = (string) => {
	let res = "";
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

const splitCSSValue = val => {
	let res = ["", ""];
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
const deviceName = () => {
	const devices = [];
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
				// if(styles[key] instanceof Color) {
				// 	this.style.setProperty(res, styles[key].toString())
				// } else {
				// 	this.style.setProperty(res, styles[key]);
				// }	
				this.style.setProperty(res, styles[key]);
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
 * 
 * update(time)
 */

class Canvas {

    constructor(w = 300, h = 150, dynamic = false) {

        if(this.constructor === Canvas) 
            throw new Error("You cannot create an instance of the abstract class `Canvas`");

        if(!(typeof this.update == "function"))
            throw new Error("Abstracted class must define an `update` method");

        this.element = document.createElement("canvas");
        this.element.width = w;
        this.element.height = h;
        this.element.style.backgroundColor = "#000";
        this.context2d = this.element.getContext("2d");
        this.dynamic = dynamic;
        this.clearColor = undefined;
        this.time = {}; // cycles, deltaTime, fps, elapsedTime -> passed into update function
        this.touch = {active: false};  // x, y, activ
        this.pointer = {active: false};

        if(typeof this.onMouseSwipe === "function") this.swipe("mouse", this.onMouseSwipe);
    }

    swipe(type, cb)
    {
        const _type = type === "touch" ? type : "mouse";
        const eventStart = _type === "touch" ? "touchstart" : "mousedown";
        const eventMove = _type === "touch" ? "touchmove" : "mousemove";
        const eventEnd = _type === "touch" ? "touchend" : "mouseup";

        this.element.addEventListener(eventStart, e => {
            let boundingRect = this.element.getBoundingClientRect();
            this.pointer.x = (_type === "touch" ? e.touches[0].pageX 
                    : e.clientX) - boundingRect.left;
                this.pointer.y = (_type === "touch" ? e.touches[0].pageY 
                    : e.clientY) - boundingRect.top;
                this.pointer.active = true;
                this.pointer.direction = "STATIC";
            if(typeof cb().onSwipeStart === "function") {
                cb().onSwipeStart({evt: e, pointerPos: {x: this.pointer.x, y: this.pointer.y}});
            }
        });

        this.element.addEventListener(eventMove, e => {
            let boundingRect = this.element.getBoundingClientRect();
            if(typeof cb().onSwipeMove === "function") {
                if(this.pointer.active) {
                    let x = this.pointer.x;
                    let y = this.pointer.y;
                    this.pointer.x = (_type === "touch" ? e.touches[0].pageX 
                    : e.clientX) - boundingRect.left;
                    this.pointer.y = (_type === "touch" ? e.touches[0].pageY 
                        : e.clientY) - boundingRect.top;
                    let diffX = this.pointer.x - x;
                    let diffY = this.pointer.y - y;
                    let angle = Math.atan2(diffY, diffX);
                    let direction;
                    if(Math.abs(diffX) > Math.abs(diffY)) {
                        if(diffX < 0) direction = "left";
                        else direction = "right";
                    } else {
                        if(diffY < 0) direction = "up";
                        else direction = "down";
                    }
                    cb().onSwipeMove({evt: e, direction, angle, 
                        pointerPos: {x: this.pointer.x, y: this.pointer.y}, 
                        pointerOld: { x, y}
                    });
                }
            }
        });

        this.element.addEventListener(eventEnd, e => {
            let boundingRect = this.element.getBoundingClientRect();
            this.pointer.active = false;
            if(typeof cb().onSwipeEnd === "function") {
                this.pointer.x = (_type === "touch" ? e.touches[0].pageX 
                : e.clientX) - boundingRect.left;
                this.pointer.y = (_type === "touch" ? e.touches[0].pageY 
                    : e.clientY) - boundingRect.top;
                cb().onSwipeEnd({evt: e, pointerPos: {x: this.pointer.x, y: this.pointer.y}, });
            }
        });

    }


    set width(w) {
        if(typeof w === "number") {
            this.element.width = w;
            this.element.css({width: `${w}px`});
        } else 
            console.error(`Canvas width must be an integer`);
    }

    set height(h) {
        if(typeof h === "number") {
            this.element.height = h;
            this.element.css({height: `${h}px`});
        } else 
            console.error(`Canvas height must be an integer`);
    }

    get width() { return parseFloat(this.element.width); }

    get height() { return parseFloat(this.element.height); }

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

    mainLoop() {

        if(this.dynamic) {
            
            let cycles = 0;
            let elapsedTimeStarted = new Date().getTime();
            let fpsTimeStarted = new Date().getTime();
            let deltaTimeStarted = new Date().getTime();

            const animate = () => {
                // time = {} [cycles, currentTime, elapsedTime, deltaTime, fps]
                // passed into the update function
                this.time.cycles = ++cycles;
                this.time.current = new Date().getTime();
                this.time.elapsedTime = this.time.current - elapsedTimeStarted;
                this.time.fps = 1000 / (performance.now() - fpsTimeStarted);
                fpsTimeStarted = performance.now();
                this.time.delta = Math.abs(this.time.current - deltaTimeStarted) * 0.001;
                deltaTimeStarted = this.time.current;

                if(this.time.delta > 0.2) this.time.delta = 0;

                this.update(this.time);
                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);

        } else {
            this.update({});
        }
        
    }

};

class Sprite {

    constructor(...args) {

        if(this.constructor === Sprite) 
            throw "abstractError";
        
        if(!(typeof this.update === "function"))
            throw "abstractError";

        if(args.length < 2)
            throw "Length Error";

        this.animationFrames = args.splice(0, args.length - 1); 
        this.delayInterval = args[0];
        this.delayCounter = 0;
        this.frameCounter = 0;
        this.repeat = true;
        this.done = false;
    }


    update(dt = 1) {
        this.delayCounter += dt;
        if(this.delayCounter >= this.delayInterval) {
            this.delayCounter = 0;
            this.frameCounter++;
            if(this.frameCounter >= this.animationFrames.length) {
                this.frameCounter = this.repeat ? 0 : this.animationFrames.length - 1;
                this.done = true;
                if(typeof this.onComplete === "function")
                    this.onComplete();
            } else {
                this.done = this.frameCounter >= this.animationFrames.length - 1;
            }
        }
        return this.animationFrames[this.frameCounter];
    }

}



class PositionalSwapSprite extends Sprite {

    constructor(...pos) {
        super(...pos);
    }

};



class ImageSwapSprite extends Sprite {

    /**
     * @description Animates image sprites
     * @param  {...any} frames list of images
     * The last value of frames must be a number indicating the interval 
     * per each sprite's frame
     * @note 
     * May take an optional method "onComplete"
     * 
     * @todo
     * Create better "onComplete" calling state
     */
    constructor(...frames) {
        super(...frames)
    }

    /**
     * @description returns the current image
     * @param {Number} dt speed runs before the next interal
     * @returns {Any} the current image
     * it's always good to have "dt" value as a deltatime
     */
    update(dt = 1) {
        this.delayCounter += dt;
        if(this.delayCounter >= this.delayInterval) {
            this.delayCounter = 0;
            this.frameCounter++;
            if(this.frameCounter >= this.animationFrames.length) {
                this.frameCounter = this.repeat ? 0 : this.animationFrames.length - 1;
                this.done = true;
                if(typeof this.onComplete === "function")
                    this.onComplete();
            } else {
                this.done = this.frameCounter >= this.animationFrames.length - 1;
            }
        }
        return this.animationFrames[this.frameCounter];
    }
};
