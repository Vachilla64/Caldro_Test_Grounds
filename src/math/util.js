class Point2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Point3D {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

"use strict";
function degToRad(degree) {
	return degree * (Math.PI / 180);
}

function radToDeg(radians) {
	return (radians * 180) / Math.PI;
}

function tan(angle){
	if(angle == 180){
		return 0;
	} else if(angle == 360){
		return 0;
	} else if(angle == 90 || angle == 270){
		return "Invalid Input :(";
	} else {
		return (Math.tan(degToRad(angle)))
	}
}

function tanInverse(ratio){
	return radToDeg(Math.atan((ratio)))
}

function sine(angle){
	return (Math.sin(degToRad(angle)))
}

function cosine(angle){
	return (Math.cos(degToRad(angle)))
}



function scaleTo(number = 5, numberMin = 0, numberMax = 10, scaleMin = 0, scaleMax = 1){
	let percentage = (number - numberMin) / (numberMax - numberMin)
	return interpolate(percentage, scaleMin, scaleMax)
}

function approach(number = 10, destination = 0, speed = 0.2, deltatime = Caldro.time.deltatime, margin = 0.001) {
	let arrived = false
	// margin = Math.abs(destination - number) * margin
	if (Math.abs(destination - number) < margin) {
		arrived = true;
		number = destination
	} else {
		speed = 1 / (1 + (deltatime * speed))
		number = destination + (number - destination) * speed;
	}
	return { value: number, arrived: arrived };
}

function interpolate(percentage = 50, minNumber = 0, maxNumber = 1){
	return minNumber + (maxNumber - minNumber) *(percentage);
}

function angleBetweenPoints(referencePoint, point2){
	if(referencePoint.x == point2.x){
		if(referencePoint.y > point2.y){
			return 0;
		} else {
			return 180;
		}
	}
	if(referencePoint.x < point2.x){
		if(referencePoint.y == point2.y){
			return 90;
		} else if(referencePoint.y > point2.y){
			return tanInverse(((point2.x - referencePoint.x)/(referencePoint.y - point2.y)))
		} else if(referencePoint.y <  point2.y){
			return tanInverse(((referencePoint.y - point2.y)/(referencePoint.x - point2.x))) + 90
		}
	} else {
		if(referencePoint.y == point2.y){
			return 270;
		} else if(referencePoint.y > point2.y){
			return -tanInverse(((point2.y - referencePoint.y)/(referencePoint.x - point2.x))) + 270
		} else if(referencePoint.y <  point2.y){
			return tanInverse(((point2.x - referencePoint.x)/(referencePoint.y - point2.y))) + 180
		}
	}if(referencePoint.x == point2.x && referencePoint.y == point2.y){
		return 0;
	}
	return (Math.atan2(point2.y - referencePoint.y , point2.x, - referencePoint.x));
	// return radToDeg(Math.atan2(point2.y - referencePoint.y , point2.x, - referencePoint.x) );
}



function collided(a, b, type = 'aabb') {
	if (type == 'aabb') {
		let ax = a.x - a.width / 2;
		let ay = a.y - a.height / 2;
		let bx = b.x - b.width / 2;
		let by = b.y - b.height / 2;
		return ax <= bx + b.width &&
			ax + a.width >= bx &&
			ay <= by + b.height &&
			ay + a.height >= by;
	} else if (type == 'aabbN') {
		return a.x <= b.x + b.width &&
			a.x + a.width >= b.x &&
			a.y <= b.y + b.height &&
			a.y + a.height >= b.y;
	}
}

function pointIsIn(point, object, typeOfObject = "box") {
	if (typeOfObject.includes("box")) {
		return (
			point.x >= object.x - object.width / 2 &&
			point.x <= object.x + object.width / 2 &&
			point.y >= object.y - object.height / 2 &&
			point.y <= object.y + object.height / 2
		)
	}
};


function pointIsInCirle(point, circle) {
	return dist2D(point, circle) < circle.radius;
}

function contain(who, type = 'box') {
	if (tyoe = 'box') {

	} else if (type = 'circle') {

	}
}




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