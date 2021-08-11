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

import { Color } from "../core/color.js";

import * as Shape from "../graphics/shape.js";

import { Vector2, Vector3 } from "../core/vector.js";
import {DEBUG} from "../core/constants.js";


export const createVector = type => {
	if(typeof type === "string")
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
export function _defineInterface(...args) {
	const res = {};
	args.forEach(i => res[i] = null);
	return Object.freeze(res);
}


/**
 * Check if obj is a proper interface to interface
 */
export function _hasImplementInterface(obj, _interface){
	return Object.keys(_interface).every(i => obj.hasOwnProperty(i));
};


export function decorate(obj, decorator) {
	Object.assign(obj, decorator);
};


export const DEBUG_LOG = (type, msg) => {
	if(DEBUG)
		window.console[type](msg);
};


// converts object data format to css 
// {backgroundColor: red}	#input 
// background-color: red	#result
export const stringToCssFormat = (string) => {
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

export const splitCSSValue = val => {
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
export const deviceName = () => {
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
export class CustomError extends Error {

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