import { Color } from "../core/color.js";
import * as Shape from "../graphics/shape.js";
import {DEBUG} from "../core/constants.js";

export const defaultExport = "This file has been included";

export const DEBUG_LOG = (type, msg) => {
	if(DEBUG)
		window.console[type](msg);
};

export const detectDevice = () => {
	// const device = window.navigator.match(/ios/ipod/i);
	// Opera 8.0+
// var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf('
// OPR/') >= 0;
// // Firefox 1.0+
// var isFirefox = typeof InstallTrigger !== 'undefined';
// // At least Safari 3+: "[object HTMLElementConstructor]"
// var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// // Internet Explorer 6-11
// var isIE = /*@cc_on!@*/false || !!document.documentMode;
// // Edge 20+
// var isEdge = !isIE && !!window.StyleMedia;
// // Chrome 1+
// var isChrome = !!window.chrome && !!window.chrome.webstore;
// // Blink engine detection
// var isBlink = (isChrome || isOpera) && !!window.CSS;
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