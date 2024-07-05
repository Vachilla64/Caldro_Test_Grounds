"CALDRO VERSION 0.2.0 {Partial Rendering and Partial Physics update}" 
 "FLAGS: "
   "Backwards Incompatible Update [BIU]"
   "!  UNSTABLE` !"
""

"Main updates: >>> "
"Rendering: now drawing operations are set to be done with Caldro's current rendering context"
"Caldro: setting up a very basic error buffer"
"added file opening and closing tags in CaldroMain"
"Local Storage: Creation of the class 'localStorageDataCapsule' [NF]"
"Physics: Setting up the 'verletPhysicsEngine' Class [NF]"
"[TAGS}: introduced a Caldro-wide tag system (also in source code except .min files) for info about classes)"
  "[BIU]: Backwards Incompatible Update"
  "[SID]: Still In Development"
  "[NF]:  Non-Final (this is usable but should be used version-specific as it is prone to changes in later updates. mostly used for really unstable classes)"
  "[NU}:  Not-usable"
  "[CO]:  Currently Outdated"
  "[I/D}: Irrelevant / Discardable"


"sub updates: >>"
"Editing Caldro object: Caldro -> info -> debugging logs"
"Editing Caldro object: Caldro -> renderer -> setRenderingCanvas"
"Editing Caldro object: Caldro -> reportError"
"Rendering: adding edge selection parameter to the 'curvedRect' and 'stCurvedRedt' drawing operations"
"'gen' utility function has been updated to 'randomNumber'"
"Utility: added 'typeof' based utility functions 'matchType' and  'typeMatch'"
"Caldro: added function 'forceMapPointerEventToWindow': Caldro-> events"
""

// const CALDRO_UPDATE_JSON = {}



"use strict";

document.body.style.margin = 0;
document.body.style.userSelect = "none";

//Gets an Element by its Id
function get(id) {
	return document.getElementById(id);
};

function fullscreen(id) {
	var elem = get(id)
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		/* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE/Edge */
		elem.msRequestFullscreen();
	}
}

function createCanvas(addToDOM = false, id = undefined) {
	let canv = document.createElement('canvas');
	if (id) {
		canv.id = id;
	}
	if (addToDOM) {
		let container = document.createElement("div")
		container.id = "Main_Canvas_Container";
		// console.log(container)
		container.appendChild(canv)
		document.body.appendChild(container);
	}
	return canv;
};


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

//Define Bodies
class rectBody {
	constructor(x = 0, y = 0, width = 0.5, height = 0.5) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.angle = 0;
		this.bodyType = "rectangle";
	}
	render(color = Caldro.rendering.defaultColor) {
		Rect(this.x, this.y, this.width, this.height, color, this.angle)
	}
}

function drawBody(body, color = Caldro.rendering.defaultColor) {
	Rect(body.x, body.y, body.width, body.height, color)
}


// [SID] [NU]
class ClassicPhysicsEngine {
	constructor() {
		this.bodies = new Array();
		this.universalForce = [0, 0]
		this.simulationSpeed = 1;
	}
	addBodes(bodies = []) {
		if (typeof bodies == "object") {
			for (let b = 0; b < bodies.length; ++b) {
				this.bodies.push(bodies[b])
			}
		}
	}
	update(deltatime = Caldro.time.deltatime, epochs = 1) {
		if (isWithinRange(epochs, 1, 1000)) {
			console.error("Amount of epochs passed to " + getConstructorName(this) + " is lower than the range[1 -> 1000]. Anount of epochs was " + epochs);
		} else {
			deltatime = (deltatime * this.simulationSpeed) / epochs;
			for (let e = 0; e < epochs; ++e) {
				for (let b = 0; b < this.bodies.length; ++b) {
					this.updateBody(this.bodies[b], deltatime)
				}
			}
		}
	}
	body(x, y, size, mass) {
		this.x = x;
		this.y = y;
		this.lastX = this.x;
		this.lastY = this.y
		this.size = size
		this.angle = 0;
		this.friction = 0;
		this.mass = mass
		this.density = 100;
		this.xv = 0;
		this.yv = 0;
		this.type = "box"
	}
	
	collided(body1, body2) {
		
	}
}

class rigidBody{
	constructor(){

	}
}

//[SIDQ]
class BoxRigidBody2D extends rigidBody{
	constructor(x = 0, y = 0, width = 100, height = 100){
		super()
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	showBody(){
		let color = "grey"
		stRect(this.x, this.y, this.width, this.height, color, 3) 
		line(this.x-this.width/2, this.y-this.height/2, this.x+this.width/2, this.y+this.height/2, color, 3)
	}
}

// [SID] [NF]
class verletPhysicsEngine {
	constructor() {
		this.bodies = new Array();
		this.points = new Array();
		this.constraints = new Array();
		this.forms = new Array();
		this.active = false;
		this.defaultPointRadius = 1
		this.showingForceMagnitude = false;
		this.breakableJoints = true;
		this.renderingJoints = true;
		this.renderingPoints = true;
		let verletEnginePointer = this;
		
		this.shapePoint = class {
			constructor(x = 0, y = 0, isStatic = false) {
				this.x = x;
				this.y = y;
				this.oldX = this.x;
				this.oldY = this.y;
				this.mass = 1
				this.radius = verletEnginePointer.defaultPointRadius;
				this.static = isStatic;
				this.simTimeRemaining = 0;
			}
			setXV(value = 0) {
				this.oldX = this.x - value;
			}
			setYV(value = 0) {
				this.oldY = this.y - value;
			}
			addXV(value = 0) {
				this.oldX += this.x - value;
			}
			addYV(value = 0) {
				this.oldY += this.y - value;
			}
		}
		
		this.shapeStick = class {
			constructor(point1 = new shapePoint(), point2 = new shapePoint(), length = "auto", stiffness = 1, breakingPoint = 1000) {
				this.point1 = point1;
				this.point2 = point2;
				this.broken = false;
				this.breakingPoint = breakingPoint;
				if (!(stiffness <= 1)) {
					console.error(`A shapeStick has been given a stiffness outside the range of [0, 1]Stiffness given was ${stiffness}`)
				}
				this.stiffness = stiffness
				this.length = length == "auto" ? dist2D(this.point1, this.point2) : length;
			}
			setStiffness(value = 1) {
				this.stiffness = value;
			}
		}
		
		this.shapeObject = class {
			constructor(shapePoints = new Array(), stickPointsIndices = new Array(), stiffness = 1, breakingPoint = 100) {
				this.points = shapePoints;
				this.constraints = new Array()
				for (let p of this.points) {
					verletEnginePointer.points.push(p)
				}
				for (let p = 0; p < stickPointsIndices.length; ++p) {
					let pointsArray = stickPointsIndices[p]
					let point1 = this.points[pointsArray[0]]
					let point2 = this.points[pointsArray[1]]
					let length = pointsArray[2];
					if (length == null) {
						length = dist2D(point1, point2);
					}

					if (pointsArray[3] != null) {
						stiffness = pointsArray[3]
					} else if (stiffness == null) {
						stiffness = 1
					}
					
					let breakingPointInArray = pointsArray[4];
					if (breakingPointInArray == null) {
						breakingPointInArray = breakingPoint
					}
					
					let newStick = new verletEnginePointer.shapeStick(point1, point2, length, stiffness, breakingPointInArray);
					this.constraints.push(newStick)
					verletEnginePointer.constraints.push(newStick)
				}
			}
			setStatic(value = true) {
				for (let point of this.points) {
					point.static = value;
				}
			}
			setXV(speed = 0) {
				for (let point of this.points) {
					point.setXV(speed)
				}
			}
			setYV(speed = 0) {
				for (let point of this.points) {
					point.setYV(speed)
				}
			}
			addXV(speed = 0) {
				for (let point of this.points) {
					point.addXV(speed)
				}
			}
			addYV(speed = 0) {
				for (let point of this.points) {
					point.addYV(speed)
				}
			}
			setStiffness(value = 1) {
				for (let stick of this.constraints) {
					stick.setStiffness(value)
				}
			}
			getCenterPoint(){
				let totalX = 0;
				let totalY = 0;
				for(let point of this.points){
					totalX += point.x;
					totalY += point.y;
				}
				return new Point2D(totalX/this.points.length, totalY/this.points.length);
			}
		}
		
		
	}
	
	addConstraint(constraint){
		this.constraints.push(constraint)
	}
	
	updatePoints(deltatime = 1) {
		for (let i = 0; i < this.points.length; ++i) {
			let point = this.points[i]
			let vx = (point.x - point.oldX) * friction;
			let vy = (point.y - point.oldY) * friction;
			point.oldX = point.x;
			point.oldY = point.y;
			if (!point.static) {
				point.x += vx * point.mass * deltatime;
				point.y += vy * point.mass * deltatime;
				point.y += (gravity * deltatime)
			};
		}
	}
	updateSticks() {
		for (let s = this.constraints.length - 1; s >= 0; --s) {
			let stick = this.constraints[s];
			let vx = stick.point2.x - stick.point1.x
			let vy = stick.point2.y - stick.point1.y
			let distance = dist2D(stick.point1, stick.point2);
			let difference = stick.length - distance;
			
			if (difference > stick.breakingPoint && this.breakableJoints) {
				this.constraints.splice(s, 1);
			} else {
				let percent = (difference / distance) / 2;
				percent = typeof percent != "number" ? 0 : percent;
				let offsetX = vx * percent;
				let offsetY = vy * percent;
				
				if (!stick.point1.static) {
					stick.point1.x -= offsetX * stick.stiffness;
					stick.point1.y -= offsetY * stick.stiffness;
				}
				if (!stick.point2.static) {
					stick.point2.x += offsetX * stick.stiffness;
					stick.point2.y += offsetY * stick.stiffness;
				}
			}
		}
	}
	renderBodies(structure = this){
		this.renderSticks(structure);
		this.renderPoints(structure);
	}
	renderPoints(structure = this) {
		if (this.renderingPoints) {
			for (let point of structure.points) {
				alpha(point.hidden ? 0.1 : 1)
				let color = point.static ? "red" : "white";
				circle(point.x, point.y, point.radius, color)
				alpha(1)
			}
		}
	}
	renderSticks(structure = this) {
		if (!this.renderingJoints) return;
		for (let stick of structure.constraints) {
			if (!stick.hidden) {
				let color = "white"
				if (this.showingForceMagnitude) {
					let vel = Math.abs(stick.point1.x - stick.point1.oldX) + Math.abs(stick.point2.x - stick.point2.oldX)
					color = colorObjectToString({
						r: vel * 30,
						g: 150 - vel * 2,
						b: 255 - vel * 1.3,
						a: 1
					})
				}
				let lineWidth = stick.thickness ? stick.thickness : 2;
				line(stick.point1.x, stick.point1.y, stick.point2.x, stick.point2.y, color, lineWidth);
			}
		}
	}
	renderForms() {
		if (!this.renderingForms) return;
		for (let form of this.forms) {
			cc.beginPath();
			cc.moveTo(form.path[0].x, form.path[0].y)
			for (let point of form.path) {
				cc.lineTo(point.x, point.y);
			}
			cc.closePath();
			fillColor(form.color ? form.color : "white")
			cc.fill()
		}
	}
	constrainPoints() {
		for (let i = 0; i < this.points.length; ++i) {
			let point = this.points[i]
			if (point.static) continue;
			let vx = (point.x - point.oldX) * friction;
			let vy = (point.y - point.oldY) * friction;
			let radius = point.radius
			if (point.x > c.w - radius) {
				point.x = c.width - radius;
				point.oldX = point.x + vx * bounce;
				point.oldY = point.y
			} else if (point.x < radius) {
				point.x = radius;
				point.oldX = point.x + vx * bounce;
				point.oldY = point.y
			}
			if (point.y > c.h - radius) {
				point.y = c.h - radius;
				point.oldY = point.y - vy * bounce;
				point.oldX = point.x
			} else if (point.y < radius) {
				point.y = radius;
				point.oldY = point.y + vy * bounce;
				point.oldX = point.x
			}
		}
	}
	
	update(deltatime = 1) {
		let epochs = 16;
		if (!Editor.active) {
			this.updatePoints(1);
		}
		for (let e = 0; e < epochs; ++e) {
			this.updateSticks(Caldro.time.deltatime / epochs);
			// this.constrainPoints(Caldro.time.deltatime / epochs);
		}
	}
	render() {
		renderSticks();
		renderPoints();
		renderForms();
	}
}


// [SID] [NU]
class polygonPoint2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.angle = angleBetweenTwoPoints(ORIGIN, this);
		this.distance = dist2D(ORIGIN, this)
	}
}

// [SID] [NU]
class polygon {
	constructor(x = 0, y = 0, angle = 0, model = new Array()) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.model = model;
		this.points = new Array();
		this.overlap = false;
	}
}













//OBJECT MOTIOIN
function addFriction(who, friction, deltatime) {
	let fric = [];
	fric[0] = 1 / (1 + (deltatime * friction[0]));
	fric[1] = 1 / (1 + (deltatime * friction[1]));
	who.xv *= fric[0];
	who.yv *= fric[1];
	fric = null;
}

function getBounds(what) {
	let bounds = {
		x: what.x,
		y: what.y,
		xv: what.xv,
		yv: what.yv,
		width: what.width,
		height: what.height1,
		hw: what.width / 2,
		hh: what.height / 2,
		top: what.y - what.height / 2,
		bottom: what.y + what.height / 2,
		left: what.x - what.width / 2,
		right: what.x + what.width / 2
	};
	return bounds;
}

function platformize(player, platform) {
	if (collided(player, platform, 'aabb')) {
		let a = getBounds(player);
		let b = getBounds(platform);
		let margin = 0.1

		let penetrationX = (platform.width + player.width) / 2 - Math.abs(platform.x - player.x);
		let penetrationY = (platform.height + player.height) / 2 - Math.abs(platform.y - player.y);

		if (penetrationY < penetrationX) {
			player.yv = 0
			if (a.top < b.y || player.y - player.yv - a.hh < b.y) {
				player.y = b.top - a.hh - margin;
				if (player.fallilng != undefined) {
					player.falling = false;
				}
				if (player.jumps != undefined) {
					player.jumps = 0;
				}
			} else if (a.bottom > b.y && player.y - player.yv - a.hh > b.y) {
				player.y = b.bottom + a.hh + margin
			}
		} else {
			if (a.left < b.x && player.x - player.xv - a.hw < b.x) {
				player.xv = 0
				player.x = b.left - a.hw - margin
			} else if (a.right > b.x && player.x - player.xv - a.hw > b.x) {
				player.xv = 0
				player.x = b.right + a.hw + margin
			}
		}
	} else {
		player.falling = true
	}
	return player.falling;
}

function lineToLineCollidsion(point1, point2, point3, point4) {
	let h = dist2D({ s: point1, y: point2 }, { x: point3, y: point4 })

}

function limitBoxWithinBox(box, area) {
    if (box.x - box.width / 2 < area.x - area.width/2) {
        box.x = box.width / 2 + area.x - area.width/2
    } else if (box.x + box.width / 2 > area.x + area.width/2) {
        box.x = area.x + area.width/2 - box.width / 2
    }
    if (box.y - box.height / 2 < area.y - area.height/2) {
        box.y = area.y - area.height/2 * 0.1 + box.width / 2
    } else if (box.y + box.height / 2 > area.y + area.height/2) {
        box.y = area.y + area.height/2 - box.height/2
    }
}


const CALDGRAY = "rgba(20, 20, 20, 1)"
const CALDRED = "rgba(80, 10, 20, 1)"
const CALDBLUE = "rgba(20, 20, 40, 1)"
const CALDGREEN = "rgba(20, 60, 20, 1)"

const ORIGIN = new Point2D(0, 0);
const INFINITY = Infinity;


const NULLFUNCTION = function(){};



"use strict";

const doings = {
	ids : [],
	tasks : [],
};
function doTask(id, what=function(){}, onlyIf = true, maxCallCount = 1,  frequency = 1){
	if(onlyIf){
	let newTask = doings.ids.includes(id);
	let condition = !newTask;
	if(condition){
		what();
		doings.ids.push(id);
		doings.tasks[id] = {
			calls : 1,
			performed : 1,
			frequency : frequency,
			id : id,
		  maxCallCount : maxCallCount,
		};
	} else {
		++doings.tasks[id].calls;
		let task = doings.tasks[id];
		if((task.calls % task.frequency == 0) && task.performed < task.maxCallCount){
			what();
			++doings.tasks[id].performed;
		};
	}
		return condition;
	}
	   return onlyIf;
}

function generateRandomId(){
	return (new Date().getTime())
}

function clearDoTask(id='Vachila64'){
	for(let i in doings.ids){
		if(doings.ids[i] == id){
			doings.ids.splice(i, 1)
			doings.tasks[id] == undefined;
			return true;
		}
	}
	return false;
}

function clearAllTasks(){
	doings.ids.length = doings.tasks.length = 0;
}

function getConstructorName(object){
	return object.__proto__.constructor.name;
}

function checkNaN(value = 0, setToIfNaN = true, logMessage = null){
	if(typeof value != "number"){
		if(logMessage != null){
			console.log(logMessage);
		}
		return setToIfNaN;
	}
	return false
}


/*function taskManager(){
	
}
taskManager.prototype = {
	
	chainTasks: function(taskArray){
		let lastTime = 0
		for(let t = 0; t < taskArray.length; t+=2){
			let task = taskArray[t];
			let timer = lastTime + taskArray[t+1];
			log(task + " is a task?")
			log(timer + " is a number?")
			// setTimeout(task, lastTime)
			lastTime += timer
		}
		lastTime = null;
	},
}

let ts = new taskManager();
ts.chainTasks([
	log(0), 2000,
	log, 2000,
	log(2), 2000,
	])*/
//==========//


//==========//
function animateButton(button, change = 0.2, delay = 100) {
	let Cwidth = button.width * change
	let Cheight = button.height * change
	button.width -= Cwidth
	button.height -= Cheight
	setTimeout(function () {
		button.width += Cwidth;
		button.height += Cheight;
	}, delay)
}


function timeTask(task = NULLFUNCTION){
	if(typeof task != "function") return false;
	let startTime = performance.now(); 
	task();
	return performance.now() - startTime;
}


// primitve utilities
function typeMatch(primitive, arrayOfTypes){
	return arrayOfTypes.includes(typeof primitive)
}

function matchType(primitiveType, arrayOfPrimitives){
	for(let primitive of arrayOfPrimitives){
		if(typeof primitive == primitiveType) {
			return true;
		}
	}
	return false;
}

function randomNumber(minimumNumber = 0, maximumNumber = 1, float = true) {
    let number = minimumNumber + (Math.random() * (maximumNumber - minimumNumber))
    if(!float) number = Math.round(number);
    return number;
}

function limit(what, lowThreshold, highThreshold, setToIfLow = null, setToIfHigh = null) {
	if (what < lowThreshold && lowThreshold != null) {
		what = setToIfLow != null ? setToIfLow : lowThreshold;
	} else if (what > highThreshold && highThreshold != null) {
		what = setToIfHigh != null ? setToIfHigh : highThreshold;
	}
	return what;
}

function withinRange(number = 0, mininmumNumber = 0, maximumNumber = 1){
	if(number >= mininmumNumber && number <= maximumNumber) return true;
	return false;
}

function dist(ax, ay, bx, by){
	return Math.sqrt(Math.abs(ax - bx) ** 2 + Math.abs(ay - by) ** 2)
}

function dist2D(a, b){
	return Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2)
}

function place(who, where) {
	if(who!=undefined && where!= undefined){
		who.x = where.x
		who.y = where.y
	} else {
		console.error("A variable passed to the function 'place' is udefinded\nWho:"+who+"\n"+"Where: "+where)
	}
}

function getRandomPointIn(x, y, width, height, precise = true){
	return {
		x: x + randomNumber(-width/2, width/2, precise),
		y: y + randomNumber(-height/2, height/2, precise)
	}
}

function closest(who, array) {
	let closest = array[0]
	if(closest != undefined){
	for (let l = 0; l < array.length; ++l) {
		if (dist2D(who, array[l]) < dist2D(who, closest)) {
			closest = array[l]
		}
	}
		return closest;
	} else {
		return undefined;
	}
}




// Array Utilities
function arraySum(array){
    let sum = 0;
    for(let i = 0; i < array.length; ++i){
        sum += array[i]
    }
    return sum;
}

function arrayMax(array){
    let max = -INFINITY
    for(let i = 0; i < array.length; ++i){
        max = Math.max(max, array[i])
    }
    return max
}

function choose(array) {
	return array[randomNumber(0, array.length - 1, false)]
}



"use strict";

// [SID]
class localStorageDataCapsule{
	constructor(localStorageID = generateRandomId()){
		this.localStorageID = localStorageID
		this.data = new Array();
		localStorage.setItem(this.localStorageID, this.data)
	}
	addData(dataID, data){
		if(typeMatch(data, ["string", "object"])){
			this.data[dataID] = data;
		}
	}
	getData(dataID){
		return this.data[dataID]
	}
	delete(dataID){
		delete this.data[dataID]
	}

	saveToLocalStorage(){
		localStorage.setItem(this.localStorageID, JSON.stringify(this.data))
	}
	loadFromLocalStorage(){
		this.data = JSOM.parse(localStorage.getItem(this.localStorageID))
	}
}


function saveToLocalStorage(name, value) {
	localStorage.setItem(name, value);
}

function loadFromLocalStorage(name) {
	let data = localStorage.getItem(name);
	if (data == null) {
		return null;
	} else {
		return data;
	}
}

function deleteFromLocalStorage(name) {
	localStorage.removeItem(name);
	let data = localStorage.getItem(name);
	if (data != null) {}
}


class vector2D{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    normalize(sourceVector = originVector){
        let mag = dist2D(this, sourceVector);
        mag = mag>2? mag : 1;
        return new vector2D(this.x /= mag, this.y /= mag)
    }
    magnitude(sourceVector = originVector){
        return dist2D(this, sourceVector)
    }
    subtract(vector = originVector){
        return  new vector2D(this.x - vector.x, this.y - vector.y)
    }
    add(vector = originVector){
        return new vector(this.x)
    }
    multiply(number = 1){
        return new vector2D(this.x *= number, this.y *= number)
    }
    normal(){
        return new vector2D(-this.y, this.x);
    }
}

const originVector = new vector2D(0, 0)

function normalize(vector = originVector, sourceVector = ORIGIN){
    let mag = dist2D(vector, sourceVector);
    vector.x /= mag; 
    vector.y /= mag;
}

function magnitude(vector = originVector, sourceVector = ORIGIN){
    return dist2D(vector, sourceVector)
}

function dotProduct(vector1, vector2){
    return vector1.x * vector2.x + vector1.y * vector2.y;
}


// [NU]
class matrix{
    constructor(rows = 2, columns = 2, initialValues = 0){
        this.mat = new Array();
        for(let r = 0; r < rows; ++r){
            let Row = new Array();
            let value = initialValues
            for(let c = 0; c < columns; ++c){
                if(typeof initialValues == "array"){
                    value = gen(initialValues[0], initialValues[1], initialValues[2])
                }
                Row.push(value)
            }
            this.mat.push(Row)
        }
    }
}



"use stricy";


// [SID]
class canvasImageManager {
	constructor(imageCanvas = document.createElement('canvas')) {
        this.canvas = imageCanvas;
		this.maxWidth = 10000; this.maxHeight = 10000;
		this.context = this.canvas.getContext("2d");
		this.backupCanvas = document.createElement('canvas');
		this.backupContext = this.backupCanvas.getContext("2d");
		this.resetCanvas = document.createElement('canvas');
		this.resetContext = this.resetCanvas.getContext("2d");
		this.drawingIds = [];
		this.drawings = [];
		this.spacing = 10;
		this.positioning = {
            x: this.spacing,
			y: this.spacing,
		};
	}
	createDrawingObject(id, x, y, width, height, drawing, ImageData) {
        return {
			id: id,
			x: x,
			y: y,
			width: width,
			height: height,
			ImageData: ImageData,
		}
	};
	addDrawing(canvas, id = 'drawing', x = 0, y = 0, drawingWidth = -1, drawingHeight = -1) {
        if (!this.drawingIds.includes(id)) {
            /*let src = context.getImageData(x, y, drawingWidth, drawingHeight);
			let copy = context.createImageData(src.width, src.height)
			for (let i = 0; i < src.data.length; ++i) {
                copy.data[i] = src.data[i]
			}
			this.context.putImageData(src, x, y)
			context.restore();
			*/
			let copy;
			if (this.positioning.x + drawingWidth > this.canvas.width) {
                this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.width = (this.positioning.x + drawingWidth + this.spacing)
				this.context.drawImage(this.backupCanvas, 0, 0);
			}
            
			if (this.positioning.y + drawingHeight > this.canvas.height) {
                this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.height = (this.positioning.y + drawingHeight + this.spacing)
				this.context.drawImage(this.backupCanvas, 0, 0);
			}
            
			this.context.drawImage(canvas, x, y, drawingWidth, drawingHeight, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight)
			this.drawings.push(this.createDrawingObject(id, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight, copy));
			this.positioning.y += drawingHeight + this.spacing;
			this.drawingIds.push(id);
		};
	};
	draw(context, drawingId = 'Vachila64', x = 0, y = 0, width = "original", height = "original", centralizeImage = false, angle = 0) {
        if (this.drawingIds.includes(drawingId)) {
            let drawing;
			let drawingNotFound = true;
			this.drawings.find(function (Drawing) {
                let sameDrawing = Drawing.id == drawingId;
				if (sameDrawing) {
                    drawing = Drawing;
					drawingNotFound = false;
				}
				return sameDrawing;
			});
			/*for(let i = 0; i < this.drawings.length; ++i){
                if(this.drawings[i].id == drawingId){
                    drawing = this.drawings[i];
					drawingNotFound = false;
					drawingNotFound = false;
					break;
				}
			}
			*/
			if (width == "original") {
                width = drawing.width
			}
			if (height == "original") {
                height = drawing.height
			}
			if (!centralizeImage) {
                context.drawImage(this.canvas, drawing.x, drawing.y, drawing.width, drawing.height, x, y, width, height)
			} else {
                context.save();
				context.translate(x, y);
				context.rotate(degToRad(angle));
				context.drawImage(this.canvas, drawing.x, drawing.y, drawing.width, drawing.height, -width / 2, -height / 2, width, height);
				context.restore();
			}
		} else {
            console.error("Drawing not found, No drawing with and Id of '" + drawingId + "' was found")
		}
	};
    
	updateDrawings() {
    };
}

var CaldroCIM = new canvasImageManager()

"use strict";

var c = createCanvas(true, "Caldro_Canvas");
var cc = c.getContext("2d")
c.style.position = 'fixed';
c.onresize = NULLFUNCTION;


function adjustCanvas(canvas = c, width = window.innerWidth, height = window.innerHeight, aspectRatio = Caldro.display.aspectRatio) {
    canvas.formerWidth = canvas.width;
	canvas.formerHeight = canvas.height;
	canvas.width = width
	canvas.height = height
	if (canvas.formerWidth != canvas.width || canvas.formerHeight != canvas.height) {
        if (canvas.onresize) {
            canvas.onresize();
		} else {
			canvas.onresize = NULLFUNCTION;
		}
	}
	canvas.w = canvas.width;
	canvas.h = canvas.height;
	canvas.hw = canvas.w / 2;
	canvas.hh = canvas.h / 2;
	canvas.min = canvas.w < canvas.h ? canvas.w : canvas.h;
	canvas.max = canvas.w > canvas.h ? canvas.w : canvas.h;
	canvas.vmin = canvas.min / 100;
	canvas.vmax = canvas.max / 100
	canvas.vw = canvas.w / 100;
	canvas.vh = canvas.h / 100;
	canvas.xc = canvas.width / 2;
	canvas.yc = canvas.height / 2;
	canvas.center = { x: canvas.xc, y: canvas.yc };
	canvas.font = '10px Arial';
	canvas.orientation = (canvas.w == canvas.max ? 'landscape' : 'potrait')
	Caldro.rendering.context.imageSmoothingEnabled = Caldro.rendering.imageSmoothing;
};

function clear(x = 0, y = 0, w = c.width, h = c.height) {
	Caldro.rendering.context.clearRect(x, y, w, h)
}

function fillColor(color = "skyblue", context = Caldro.rendering.context) {
	if (context.fillStyle != color) {
		context.fillStyle = color
	}
}

function strokeColor(color = "skyblue", context = Caldro.rendering.context) {
	if (context.strokeStyle != color) {
		context.strokeStyle = color
	}
}

function rect(x = 0, y = 0, w = c.width, h = c.height, color = 'black') {
	fillColor(color)
	// Caldro.rendering.context.fillRect(x, y, w, h);
	Caldro.rendering.context.fillRect(x, y, Math.round(w), Math.round(h));
}

function strect(x, y, w, h, color, lineWidth) {
	strokeColor(color);
	Caldro.rendering.context.lineWidth = lineWidth
	Caldro.rendering.context.strokeRect(x, y, w, h);
}

function circle(x, y, r, fill) {
	Caldro.rendering.context.fillStyle = fill
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, 0, 2 * Math.PI);
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.fill();
}

function stCircle(x, y, r, fill, lw) {
	Caldro.rendering.context.strokeStyle = fill
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, 0, 2 * Math.PI);
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.lineWidth = lw;
	Caldro.rendering.context.stroke();
}

function line(a, b, c, d, col, lw) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.strokeStyle = col;
	Caldro.rendering.context.moveTo(a, b);
	Caldro.rendering.context.lineTo(c, d);
	Caldro.rendering.context.closePath();
	strokeColor(col)
	Caldro.rendering.context.lineWidth = lw
	Caldro.rendering.context.stroke();
}

function drawLine(startX, startY, length = 100, angle = 0, color = "skyblue", lineWidth = 2) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(startX, startY);
	let rad = degToRad(angle);
	Caldro.rendering.context.lineTo(startX + (length * Math.sin(rad)), (startY - (length * Math.cos(rad))))
	Caldro.rendering.context.closePath();
	strokeColor(color);
	Caldro.rendering.context.lineWidth = lineWidth
	Caldro.rendering.context.stroke();
}

function drawRegularPolygon(x = 0, y = 0, radius = 1, numberOfVertuces = 3, color = "skyblue") {
	let TWO_PI = Math.PI * 2;
	Caldro.rendering.context.beginPath()
	for (let angle = 0; angle < TWO_PI; angle += TWO_PI / numberOfVertuces) {
		let px = x + radius * Math.sin(angle);
		let py = y + radius * Math.cos(angle)
		if (angle == 0) {
			Caldro.rendering.context.moveTo(px, py)
		} else {
			Caldro.rendering.context.lineTo(px, py)
		}
	}
	Caldro.rendering.context.closePath()
	Caldro.rendering.context.fillStyle = color
	Caldro.rendering.context.fill()
}

function font(size = 30, font = 'Arial', thickness = "500") {
	let fnt = "" + thickness + " " + size + "px " + font;
	Caldro.rendering.context.font = fnt;
	return fnt;
}

function txt(text, x, y, font = '30px Arial', fill = 'skyblue', alignment = "center") {
	Caldro.rendering.context.fillStyle = fill;
	Caldro.rendering.context.font = font
	Caldro.rendering.context.textAlign = alignment
	Caldro.rendering.context.textBaseline = "middle"
	fillText(text, x, y)
}

function fillText(text, x, y) {
	Caldro.rendering.context.save()
	if (Caldro.rendering.textOutlineThickness > 0) {
		Caldro.rendering.context.lineWidth = Caldro.rendering.textOutlineThickness
		strokeColor(Caldro.rendering.textOutlineColor)
		Caldro.rendering.context.strokeText(text, x, y)
	}
	glow(0)
	Caldro.rendering.context.fillText(text, x, y)
	Caldro.rendering.context.restore();
}

function textOutline(thickness = 0, style = "black") {
	if (thickness >= 0) {
		Caldro.rendering.textOutlineThickness = thickness;
	}
	Caldro.rendering.textOutlineColor = style
}

function wrapText(text, x, y, maxWidth, lineHeight, color = "green", font = "50px Arial") {
	Caldro.rendering.context.save()
	Caldro.rendering.context.textAlign = 'center'
	Caldro.rendering.context.textBaseline = 'middle'
	Caldro.rendering.context.font = font;
	Caldro.rendering.context.lineWidth = 5
	Caldro.rendering.context.lineCap = "round";
	Caldro.rendering.context.lineJoin = "round";
	let unCutWords = text.split(' ');
	let words = new Array()
	for (let unCutWord of unCutWords) {
		let cutWords = unCutWord.split('\n');
		for (let word of cutWords) {
			if (word != "") {
				words.push(word);
			} else {
				words.push(null)
			}
		}
	}
	/* doTask("kk", function(){
		console.log(unCutWords)
		console.log(words)
	}) */
	let line = '';
	let height = lineHeight
	let width = 0

	fillColor(color)
	strokeColor("black")
	for (let n = 0; n < words.length; ++n) {
		if (words[n] == null) {
			fillText(line, x, y);
			width = Math.max(width, Caldro.rendering.context.measureText(line).width)
			y += lineHeight * 2;
			height += lineHeight;
			line = ''
			/* doTask("sjd", function(){
				console.log("I did a line break\nfor: "+words[n]+"")
			}) */
			continue;
		}
		let testLine = line + words[n] + ' ';
		let metrics = Caldro.rendering.context.measureText(testLine);
		let testWidth = metrics.width;
		// width = Math.max(width, testWidth)
		if (testWidth > maxWidth && n > 0) {
			fillText(line, x, y);
			width = Math.max(width, Caldro.rendering.context.measureText(line).width)
			line = words[n] + ' ';
			y += lineHeight;
			height += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	fillText(line, x, y);

	// return {x: x, y: y, width: width, height: height};
	/* alpha(0.4)
	rect(x- width/2, y-height, width, height, "black")
	alpha(1) */
	Caldro.rendering.context.restore();
}

function edge(x, y, col, blur, w, h) {
	Caldro.rendering.context.shadowColor = col
	Caldro.rendering.context.shadowBlur = blur
	rect(x, y, w, h, col)
}

function edges(w, h, blur, color) {
	Caldro.rendering.context.save();
	edge(c.w, 0, color, blur, w, h)
	edge(-w, 0, color, blur, w, h)
	edge(c.w, c.h - h, color, blur, w, h)
	edge(-w, c.h - h, color, blur, w, h)
	edge(0, -h, color, blur, w, h)
	edge(c.w - w, -h, color, blur, w, h)
	edge(0, c.h, color, blur, w, h)
	edge(c.w - w, c.h, color, blur, w, h)
	Caldro.rendering.context.restore();
}

function glow(amount = 10, color = 'white') {
	if (Caldro.rendering.glow) {
		Caldro.rendering.context.shadowBlur = amount;
		Caldro.rendering.context.shadowColor = color;
	}
}

function alpha(value) {
	Caldro.rendering.context.globalAlpha = value;
}

function Rect(x, y, w, h, fill, angle = 0) {
	if (Caldro.rendering.shapeClipping) {
		let cam = Caldro.rendering.shapeClippingCamera;
		if (cam.capturing) {
			if (!collided(cam, { x: x, y: y, width: w, height: h })) return;
		}
	}
	Caldro.rendering.context.save();
	Caldro.rendering.context.translate(x, y);
	Caldro.rendering.context.rotate(degToRad(angle));
	x = -w / 2;
	y = -h / 2;
	rect(x, y, w, h, fill);
	Caldro.rendering.context.restore();
}

function stRect(x, y, w, h, fill, lineWidth = 20, angle = 0) {
	Caldro.rendering.context.save();
	Caldro.rendering.context.translate(x, y);
	Caldro.rendering.context.rotate(degToRad(angle));
	x = -w / 2;
	y = -h / 2;
	strect(x, y, w, h, fill, lineWidth);;
	Caldro.rendering.context.restore();
}

function curvedRect(x, y, width, height, fill, angle = 0, dotBorderRadius = 10) {
	let hw = width / 2;
	let hh = height / 2;
	Caldro.rendering.context.save();
	Caldro.rendering.context.translate(x, y);
	Caldro.rendering.context.rotate(degToRad(angle));
	Caldro.rendering.context.beginPath();

	if (typeof dotBorderRadius == "number") {
		let borderRadius = dotBorderRadius
		Caldro.rendering.context.moveTo(hw + borderRadius, - hh);
		Caldro.rendering.context.lineTo(hw - borderRadius, - hh);
		Caldro.rendering.context.arc(hw - borderRadius, - hh + borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);

		Caldro.rendering.context.lineTo(hw, hh - borderRadius);
		Caldro.rendering.context.arc(hw - borderRadius, hh - borderRadius, borderRadius, 0, Math.PI / 2);

		Caldro.rendering.context.lineTo(- hw + borderRadius, hh);
		Caldro.rendering.context.arc(- hw + borderRadius, hh - borderRadius, borderRadius, Math.PI / 2, Math.PI);

		Caldro.rendering.context.lineTo(- hw, - hh + borderRadius);
		Caldro.rendering.context.arc(- hw + borderRadius, - hh + borderRadius, borderRadius, Math.PI, Math.PI * 1.5);

	} else if (typeof dotBorderRadius == "object") {
		let borderRadius = dotBorderRadius[1]
		Caldro.rendering.context.moveTo(hw + borderRadius, - hh);
		Caldro.rendering.context.lineTo(hw - borderRadius, - hh);
		Caldro.rendering.context.arc(hw - borderRadius, - hh + borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);

		borderRadius = dotBorderRadius[2]
		Caldro.rendering.context.lineTo(hw, hh - borderRadius);
		Caldro.rendering.context.arc(hw - borderRadius, hh - borderRadius, borderRadius, 0, Math.PI / 2);

		borderRadius = dotBorderRadius[3]
		Caldro.rendering.context.lineTo(- hw + borderRadius, hh);
		Caldro.rendering.context.arc(- hw + borderRadius, hh - borderRadius, borderRadius, Math.PI / 2, Math.PI);

		borderRadius = dotBorderRadius[0]
		Caldro.rendering.context.lineTo(- hw, - hh + borderRadius);
		Caldro.rendering.context.arc(- hw + borderRadius, - hh + borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
	}
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.fillStyle = fill;
	Caldro.rendering.context.fill();
	Caldro.rendering.context.restore();
	hw = hh = null;
	/*circle(this.x-this.hw,this.y,this.hh,this.color)
	circle(this.x+this.hw,this.y,this.hh,this.color)*/
};

function stCurvedRect(x, y, width, height, fill, dotBorderRadius = 10, lw = 5) {
	let hw = width / 2;
	let hh = height / 2;
	Caldro.rendering.context.lineWidth = lw;
	Caldro.rendering.context.beginPath();
	if (typeof dotBorderRadius == "number") {
		let borderRadius = dotBorderRadius
		Caldro.rendering.context.moveTo(x - hw + borderRadius, y - hh);
		Caldro.rendering.context.lineTo(x + hw - borderRadius, y - hh);
		Caldro.rendering.context.arc(x + hw - borderRadius, y - hh + borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);

		Caldro.rendering.context.lineTo(x + hw, y + hh - borderRadius);
		Caldro.rendering.context.arc(x + hw - borderRadius, y + hh - borderRadius, borderRadius, 0, Math.PI / 2);

		Caldro.rendering.context.lineTo(x - hw + borderRadius, y + hh);
		Caldro.rendering.context.arc(x - hw + borderRadius, y + hh - borderRadius, borderRadius, Math.PI / 2, Math.PI);

		Caldro.rendering.context.lineTo(x - hw, y - hh + borderRadius);
		Caldro.rendering.context.arc(x - hw + borderRadius, y - hh + borderRadius, borderRadius, Math.PI, Math.PI * 1.5);

	} else if (typeof dotBorderRadius == "object") {
		let borderRadius = dotBorderRadius[1]
		Caldro.rendering.context.moveTo(x - hw + borderRadius, y - hh);
		Caldro.rendering.context.lineTo(x + hw - borderRadius, y - hh);
		Caldro.rendering.context.arc(x + hw - borderRadius, y - hh + borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);

		borderRadius = dotBorderRadius[2]
		Caldro.rendering.context.lineTo(x + hw, y + hh - borderRadius);
		Caldro.rendering.context.arc(x + hw - borderRadius, y + hh - borderRadius, borderRadius, 0, Math.PI / 2);

		borderRadius = dotBorderRadius[3]
		Caldro.rendering.context.lineTo(x - hw + borderRadius, y + hh);
		Caldro.rendering.context.arc(x - hw + borderRadius, y + hh - borderRadius, borderRadius, Math.PI / 2, Math.PI);

		borderRadius = dotBorderRadius[0]
		Caldro.rendering.context.lineTo(x - hw, y - hh + borderRadius);
		Caldro.rendering.context.arc(x - hw + borderRadius, y - hh + borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
	}
	Caldro.rendering.context.closePath();
	strokeColor(fill)
	Caldro.rendering.context.stroke();
	/*circle(this.x-this.hw,this.y,this.hh,this.color)
	circle(this.x+this.hw,this.y,this.hh,this.color)*/
};


function triangle(x, y, length, color, angle = 0, direction = 'up') {
	let sqrt3 = 1.7321;
	let height = length * (sqrt3 / 2)
	// length = height
	let a;
	let b;
	let c;
	if (direction == 'up') {
		a = new Point2D(0, -height / 2);
		b = new Point2D(-length / 2, +height / 2);
		c = new Point2D(length / 2, +height / 2);
	} else if (direction == 'down') {
		a = new Point2D(0, +height / 2);
		b = new Point2D(-length / 2, -height / 2);
		c = new Point2D(+length / 2, -height / 2);
	} else if (direction == 'right') {
		a = new Point2D(+length / 2, 0);
		b = new Point2D(-height / 2, -length / 2);
		c = new Point2D(-height / 2, +length / 2);
	} else if (direction == 'left') {
		a = new Point2D(-length / 2, 0);
		b = new Point2D(+height / 2, -length / 2);
		c = new Point2D(+height / 2, +length / 2);
	}
	// Rect(x-length, y, 50, height, 'white')
	// angle = 10
	// Game.device.controls.active = false
	/*a.x +=Math.sin(degToRad(angle))*height/2
	a.y -=Math.cos(degToRad(angle))*height/2
	b.x +=Math.sin(degToRad(angle))*height/2
	b.y -=Math.cos(degToRad(angle))*height/2
	c.x +=Math.sin(degToRad(angle))*height/2
	c.y -=Math.cos(degToRad(angle))*height/2
	*/
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(a.x, a.y);
	Caldro.rendering.context.lineTo(b.x, b.y);
	Caldro.rendering.context.lineTo(c.x, c.y);
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.fillStyle = color;
	Caldro.rendering.context.fill();
	Caldro.rendering.context.restore()
	// Rect(x, y, 10, 10,  'rgba(255,255,255,0.7)')
	// Caldro.rendering.context.lineWidth = 10
	// Caldro.rendering.context.stroke()
}

function stTriangle(x, y, length, color, lineWdith = 2, angle = 0, direction = 'up') {
	let sqrt3 = 1.7321;
	let height = length * (sqrt3 / 2)
	// length = height
	let a;
	let b;
	let c;
	if (direction == 'up') {
		a = new Point2D(0, -height / 2);
		b = new Point2D(-length / 2, +height / 2);
		c = new Point2D(length / 2, +height / 2);
	} else if (direction == 'down') {
		a = new Point2D(0, +height / 2);
		b = new Point2D(-length / 2, -height / 2);
		c = new Point2D(+length / 2, -height / 2);
	} else if (direction == 'right') {
		a = new Point2D(+length / 2, 0);
		b = new Point2D(-height / 2, -length / 2);
		c = new Point2D(-height / 2, +length / 2);
	} else if (direction == 'left') {
		a = new Point2D(-length / 2, 0);
		b = new Point2D(+height / 2, -length / 2);
		c = new Point2D(+height / 2, +length / 2);
	}
	// Rect(x-length, y, 50, height, 'white')
	// angle = 10
	// Game.device.controls.active = false
	/*a.x +=Math.sin(degToRad(angle))*height/2
	a.y -=Math.cos(degToRad(angle))*height/2
	b.x +=Math.sin(degToRad(angle))*height/2
	b.y -=Math.cos(degToRad(angle))*height/2
	c.x +=Math.sin(degToRad(angle))*height/2
	c.y -=Math.cos(degToRad(angle))*height/2
	*/
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(a.x, a.y);
	Caldro.rendering.context.lineTo(b.x, b.y);
	Caldro.rendering.context.lineTo(c.x, c.y);
	Caldro.rendering.context.closePath();
	strokeColor(color)
	Caldro.rendering.context.lineWidth = lineWdith
	Caldro.rendering.context.stroke();
	Caldro.rendering.context.restore()
	// Rect(x, y, 10, 10,  'rgba(255,255,255,0.7)')
	// Caldro.rendering.context.lineWidth = 10
	// Caldro.rendering.context.stroke()
}

function renderRectBody(body, color) {
	Rect(body.x, body.y, body.width, body.height, color)
}

function pickColor(r = [0, 255], g = [0, 255], b = [0, 255], a = [0, 1]) {
	let color = 'rgba(' + gen(r[0], r[1]) + ',' + gen(g[0], g[1]) + ',' + gen(b[0], b[1]) + ',' + gen(a[0], a[1], '') + ')';
	return color;
}

function getColor(x, y, context = Caldro.rendering.context) {
	let src = context.getImageData(x, y, 1, 1)
	let copy = context.createImageData(src.width, src.height)
	for (let i = 0; i < src.data.length; ++i) {
		copy.data[i] = src.data[i]
	}
	return {
		r: copy.data[0],
		g: copy.data[1],
		b: copy.data[2],
		a: copy.data[3],
	}
}



"use strict";

function cordShow(who, fill = 'green', w = 300, h = 2, showCordValue = false) {
	if (who != undefined) {
		let x = who.x;
		let y = who.y;
		Rect(x, y, w, h, fill)
		Rect(x, y, h, w, fill)
		if (showCordValue == true) {
			txt('x : ' + x + ', y : ' + y, x + 50, y - 50)
		}
	}
}

function meter(x, y, width, height, value = 50, lowest_limit = 0, highest_limit = 100, colors = ['#22ff12', 'orange', 'red'], backgroundColor = "transparent", steps = 100)
{
	let color = colors[0]
	steps = width / steps
	limit(value, lowest_limit, highest_limit);
	let percent = (value / highest_limit) * 100
	/* if (percent < 70) {
		color = colors[1]
	}
	if (percent < 30) {
		color = colors[2]
	} */
	let valueLenght = limit(steps * percent, 0, width)
	if(backgroundColor!="transparent"){
		rect(x - width / 2, y - height / 2, width, height, backgroundColor)
	}
	rect(x - width / 2, y - height / 2, valueLenght, height, color)
	stRect(x, y, width, height, 'white', 2)
}

function getColorOnjectOfColor(color = "white"){
	let canvas = document.createElement("canvas")
	let context = canvas.getContext("2d")
	context.fillStyle = color
	context.fillRect(0, 0, canvas.width, canvas.height);
	return getColor(0, 0, context)
}

function checkBoard(x, y, width, height, rows = 8, columns = 8, color1 = "white", color2 = "black"){
	// let rowWidth = width / rows;
	let rowHeight = height / rows;
	let columnWidth = width / columns;
	// let columnHeight = height / columns;
	let drawX = x;
	let drawY = y;
	let colorIndex = 0
	for(let r = 0; r < rows; ++r){
		for(let c = 0; c < columns; ++c){
			let color = colorIndex == 0? color1 : color2;
			rect(drawX, drawY, columnWidth, rowHeight, color);
			drawX += columnWidth;
			colorIndex = (colorIndex + 1) % 2
		}
		colorIndex = (colorIndex + 1) % 2
		drawX = x;
		drawY += rowHeight;
	}
}



"use strict";

// [SID]
class DOMaudioManager {
	constructor() {
		this.initState = false;
		this.loadState = false;
		this.active = true
		this.addedSounds = 0;
		this.loadedSounds = 0;
		this.masterVolume = 1;
		this.audioSrcPrefix = "";
		this.bank = [];
	}
	onInit() { };
	initialize() {
		if (!this.active) return;
		for (let s = 0; s < this.bank.length; ++s) {
			// try {
			let sound = this.bank[s]
			let former_volume = sound.volume;
			sound.load();
			sound.onload = function () {

			}
			sound.currentTime = 1;
			sound.volume = 0;
			sound.loop = true
			sound.play();
			sound.loop = false;
			setTimeout(function () {
				sound.pause();
				sound.volume = former_volume;
				// this.onInit();
			}, 1000)
			sound.currentTime = 0;
			// } catch (e) {
			/*scene.onerror = function(e){
			  return true;
			}*/
			// }
		}
		// console.log("initialized")
	};

	pauseAll() {
		if (!this.active) return;
		for (let s in this.bank) {
			if (!this.isAudioFile(s) && Caldro.info.loggingIssus()) {
				//console.log("A non audio file is present in this sound bank \n That file is of type "+typeof this.bank[s]+"\n The non audio file")
				// console.log(this.bank[s])
			}
			this.bank[s].pause();
		}
	}

	play(id, cloneNode = false) {
		if (!this.active) return;
		if (this.bank[id]) {
			if (cloneNode) {
				let sound = this.bank[id].cloneNode(true)
				sound.volume = this.bank[id].volume;
				sound.play();
			} else {
				this.bank[id].play();
			}
		}
	}

	pause(id) {
		if (!this.active) return;
		// console.log("Trying to pause Audio file tagged **"+id+"**, that file is "+this.bank[id])
		if (this.isAudioFile(id)) {
			this.bank[id].pause();
			// console.log(typeof this.bank[id])
		}
	}

	getTime(id) {
		return this.bank[id].currentTime;
	}

	isAudioFile(id) {
		if (this.initState)
			return getConstructorName(this.bank[id]) == "HTMLAudioElement"
	}

	get(id) {
		if (this.bank[id] != undefined) {
			return this.bank[id];
		} else {
			// console.log("Tried to get Audio file tagged **"+id+"**");
			return new Audio();
		}
	}

	setTime(id, value = 0) {
		this.bank[id].currentTime = value;
	}

	access() {
		this.initialize();
	};

	getLoadPercenteage() {
		return (this.loadedSounds / this.addedSounds) * 100;
	}

	updateLoadinfo() {
		++this.loadedSounds
		if (this.loadedSounds == this.addedSounds && this.loadState == false) {
			this.initState = true
			this.loadState = true;
			this.onInit();
			//console.log("All ssounds have been initialized");
			this.access = function () { };
		} else {
			// console.log(this.loadedSounds)
		}
	}

	createSoundObjec() {
		let soundObject = {
			/* audioFile: audioFile,
			volume: volume,
			pitch: 1,
			speed: 1, */
		}
	}

	add(id, src, volume = 1) {
		if (!this.active) return;
		// let aud = document.createElement("audio");
		let aud = new Audio()
		aud.src = this.audioSrcPrefix + src;
		aud.volume = volume;
		aud.psuedoVolume = volume
		aud.id = id;
		aud.preload = "auto";
		aud.controls = false;
		this.bank[id] = aud;
		++this.addedSounds;
		// document.body.appendChild(aud)
		aud.oncanplaythrough = function () {
			this.updateLoadinfo()
		}
		aud.setVolume = function (volume = 1) {
			aud.psuedoVolume = volume
			aud.volume = aud.psuedoVolume * this.masterVolume;
		}
		aud.getVolume = function (volume = 1) {
			return aud.psuedoVolume;
		}
	}

	setMasterVolume(volume = 1) {
		if (!this.active) return;
		this.masterVolume = volume
		for (let b in this.bank) {
			let sound = this.bank[b];
			sound.volume = sound.psuedoVolume * this.masterVolume
		}
	}

	update() {
		if (!this.active) return;
		for (let s in this.bank) {

		}
	}
}



"use strict";

// [CO]
function dPad(x, y, size) {
	this.x = x;
	this.y = y;
	this.width = size;
	this.height = size;
	this.size = size;
	this.margin = size / 3;
	this.value = 0;
	let value = 0;
	let innerColor = 'grey';

	let up = this.up = new button(this.x, this.y - this.margin, this.margin, this.margin, '⬆️');
	this.up.effect = function () {
		value = 2;
		up.color = 'white';
		up.dolater(10, function () {
			up.color = innerColor;
		});
	};

	let down = this.down = new button(this.x, this.y + this.margin, this.margin, this.margin, '⬇️');
	this.down.effect = function () {
		value = 8;
		down.color = 'white';
		down.dolater(10, function () {
			down.color = innerColor;
		});
	};

	let left = this.left = new button(this.x - this.margin, this.y, this.margin, this.margin, '⬅️')
	this.left.effect = function () {
		value = 4;
		left.color = 'white';
		left.dolater(10, function () {
			left.color = innerColor;
		});
	};

	let right = this.right = new button(this.x + this.margin, this.y, this.margin, this.margin, '➡️');
	this.right.effect = function () {
		value = 6;
		right.color = 'white';
		right.dolater(10, function () {
			right.color = innerColor;
		});
	};

	this.buttons = [this.up, this.down, this.left, this.right];

	this.update = function (tap = null) {
		value = this.value = 0;
		this.margin = this.size / 3;
		this.up.position(this.x, this.y - this.margin, this.margin, this.margin);
		this.down.position(this.x, this.y + this.margin, this.margin, this.margin);
		this.left.position(this.x - this.margin, this.y, this.margin, this.margin);
		this.right.position(this.x + this.margin, this.y, this.margin, this.margin);
		for (let i = 0; i < this.buttons.length; ++i) {
			this.buttons[i].fontSize = this.margin;
			if (tap != null) {
				this.buttons[i].listen(tap);
				this.value = value;
			};
		};
		return this.value;
	}

	this.render = function () {
		for (let i = 0; i < this.buttons.length; ++i) {
			glow(0);
			this.buttons[i].drawingStyle = 2;
			this.buttons[i].render();
		};
	}
}

// [SID]
class Joystick {
	constructor(x = 0, y = 0, radius = 10, knobRadius = 4, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.detectionAreaExtension = this.radius * 0.5;
		this.color = color;
		this.active = true;
		this.isBeingControlled = false;
		this.values = [0, 0]
		this.knob = {
			x: this.x,
			y: this.y,
			radius: knobRadius,
			color: color
		}
	}
	update(pointer = touchPoint, type = "idle") {
		if (!this.active) return;

		if (type == "start") {
			this.isBeingControlled = dist2D(pointer, this) < (this.radius + this.detectionAreaExtension);
			if (this.isBeingControlled) {
				place(this.knob, pointer)
			}
		}
		if (type == "move") {
			if (this.isBeingControlled) {
				place(this.knob, pointer)
				let angle = angleBetweenPoints(this, this.knob)
				if (dist2D(this.knob, this) > this.radius) {
					this.knob.x = this.x + (sine(angle) * this.radius)
					this.knob.y = this.y + (-cosine(angle) * this.radius)
				}
			}
		}
		if (type == "end") {
			this.isBeingControlled = false;
			place(this.knob, this);
		}


		this.values[0] = (this.knob.x - this.x) / (this.radius)
		this.values[1] = (this.knob.y - this.y) / this.radius;
		return this.isBeingControlled;
	}

	render() {
		if (this.isBeingControlled) {
			alpha(0.3)
			circle(this.x, this.y, this.radius + this.detectionAreaExtension, this.color);
			alpha(1)
		}
		stCircle(this.x, this.y, this.radius, this.color, 4);
		circle(this.knob.x, this.knob.y, this.knob.radius, this.knob.color)
	}
}



var pointer = new Point2D(0, 0)


function pointStartEvent(pointer, pointerType) { };
function pointMoveEvent(pointer, pointerType) { };
function pointEndEvent(pointer, pointerType) { };
function touchstartEvent() { }
get("Caldro_Canvas").addEventListener('touchstart', function (event) {
	if (Caldro.events.handleTouchEvents) {
		event.preventDefault()
		Caldro.screen.updatePointers(event, "start")
		pointer.x = event.touches[0].pageX
		pointer.y = event.touches[0].pageY
		Caldro.info.currentCamera.updatePointer(pointer)
		touchstartEvent(pointer);
		pointStartEvent(pointer, "touch")
	}
}, false)


function touchmoveEvent() { }
get('Caldro_Canvas').addEventListener('touchmove', function (event) {
	if (Caldro.events.handleTouchEvents) {
		event.preventDefault()
		Caldro.screen.updatePointers(event, "move")
		place(pointer, { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY })
		Caldro.info.currentCamera.updatePointer(pointer)
		touchmoveEvent(pointer);
		pointMoveEvent(pointer, "touch")
	}
})

function touchendEvent() { }
get('Caldro_Canvas').addEventListener('touchend', function (event) {
	if (Caldro.events.handleTouchEvents) {
		event.preventDefault()
		Caldro.screen.updatePointers(event, "end")
		place(pointer, { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY })
		Caldro.info.currentCamera.updatePointer(pointer)
		touchendEvent(pointer);
		pointEndEvent(pointer, "touch")
	}
})

function mousedownEvent() { };
get("Caldro_Canvas").addEventListener("mousedown", function (e) {
	if (Caldro.events.handleMouseEvents) {
		Caldro.screen.addPointer(e.clientX, e.clientY)
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		Caldro.info.currentCamera.updatePointer(pointer);
		mousedownEvent();
		pointStartEvent(pointer, "mouse");
	}
})

function mousemoveEvent() { };
get("Caldro_Canvas").addEventListener("mousemove", function (e) {
	if (Caldro.events.handleMouseEvents) {
		Caldro.screen.pointers.length = 0
		Caldro.screen.pointers[0] = new Point2D(e.clientX, e.clientY)
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		Caldro.info.currentCamera.updatePointer(pointer)
		mousemoveEvent();
		pointMoveEvent(pointer, "mouse");
	}
})

function mouseupEvent() { };
get("Caldro_Canvas").addEventListener("mouseup", function (e) {
	if (Caldro.events.handleMouseEvents) {
		Caldro.screen.pointers.length = 0
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		Caldro.info.currentCamera.updatePointer(pointer)
		pointEndEvent(pointer, "mouse");
		mouseupEvent();
	}
})

function mousescrollUp() { }
function mousescrollDown() { }
document.addEventListener("mousewheel", function (event) {
	if (Caldro.events.handleToudhEvents) {
		if (event.deltaY < 0) {
			mousescrollUp()
		} else {
			mousescrollDown();
		}
	}
})

function keyPressHandler() { }
document.addEventListener("keydown", function (event) {
	Caldro.info.currentKeyStateHandler.activateKeyState(event);
	keyPressHandler(event.which)
})

function keyEndHandler() { }
document.addEventListener("keyup", function (event) {
	Caldro.info.currentKeyStateHandler.deactivateKeyState(event);
	keyEndHandler(event.which)
})


// [SID]
class keyStateHandler {
	constructor() {
		this.keys = [];
		this.active = true;
		this.strictMatch = true;
		this.strictCaps = false;
	}
	addKey(keyNumber, keyName, effect = function () { }, onclick = function () { }) {
		if (typeof keyName == "object") {
			for (let n = 0; n < keyName.length; ++n) {
				this.keys.push(new this.keyListener(keyNumber, keyName[n], effect, onclick))
			}
		} else {
			this.keys.push(new this.keyListener(keyNumber, keyName, effect, onclick))
		}
	}
	bind = this.addKey;
	getKey(keyInfo) {
		let key = undefined;
		if (typeof keyInfo == "number") {
			for (let k = 0; k < this.keys.length; ++k) {
				if (this.keys[k].keyNumber == keyInfo) {
					key = this.keys[k];
					break
				}
			}
		} else if (typeof keyInfo == "string") {
			for (let k = 0; k < this.keys.length; ++k) {
				let condition = false;
				let keyToLow = this.keys[k].keyName.toLowerCase()
				let keyInfToLow = keyInfo.toLowerCase();
				if (this.strictMatch) {
					if (this.strictCaps) {
						condition = this.keys[k].keyName == keyInfo
					} else {
						condition = keyToLow == keyInfToLow;
					}
				} else {
					if (this.strictCaps) {
						condition = this.keys[k].keyName == keyInfo
					} else {
						condition = keyToLow.includes(keyInfToLow) || keyInfToLow.includes(keyToLow);
					}
				}
				if (condition) {
					key = this.keys[k];
					break;
				}
			}
		} else if (typeof keyInfo == "object") {
			for (let k = 0; k < this.keys.length; ++k) {
				let condition = false;
				let keyToLow = this.keys[k].keyName.toLowerCase()
				let keyInfToLow = keyInfo.key.toLowerCase();
				if (this.strictMatch) {
					if (this.strictCaps) {
						condition = this.keys[k].keyName == keyInfo
					} else {
						condition = keyToLow == keyInfToLow;
					}
				} else {
					if (this.strictCaps) {
						condition = this.keys[k].keyName == keyInfo
					} else {
						condition = keyToLow.includes(keyInfToLow) || keyInfToLow.includes(keyToLow);
					}
				}
				if (condition || this.keys[k].keyNumber == keyInfo.which) {
					key = this.keys[k];
					break
				}
			}
		}
		if (key == undefined) {
			if (Caldro.info.isloggingIssues()) {
				console.error("No key was found with the keyinfo '" + keyInfo + "'");
			}
		}
		return key;
	}
	keyListener(KeyNumber, keyName, effect = function () { }, onclick = function () { }) {
		this.keyNumber = KeyNumber;
		this.keyName = keyName;
		this.active = true;
		this.beingPressed = false;
		this.executeClick = true
		this.effect = effect;
		this.onclick = onclick;
	}
	updateKeys() {
		if (this.active && Caldro.events.handleKeyboardEvents) {
			for (let k = 0; k < this.keys.length; ++k) {
				let key = this.keys[k];
				if (key.active && key.beingPressed) {
					if (key.executeClick) {
						key.onclick();
						key.executeClick = false;
					}
					key.effect();
				}
			}
		}
	}
	activateKeyState(KeyInfo = 0) {
		let key = this.getKey(KeyInfo);
		if (key != undefined) {
			key.beingPressed = true;
		}
	}
	deactivateKeyState(KeyInfo = 0) {
		let key = this.getKey(KeyInfo);
		if (key != undefined) {
			key.beingPressed = false;
			key.executeClick = true;
		}
	}
}


var keyAtlas = [

]

function getKeyName(keyNumber) {

}



"use strict";

function colorObjectToString(colorObject) {
	let co = colorObject;
	if (typeof co == 'object') {
		return 'rgba(' + co.r + ',' + co.g + ',' + co.b + ',' + co.a + ')';
	} else if (typeof co == 'array') {
		return 'rgba(' + co[0] + ',' + co[1] + ',' + co[2] + ',' + co[3] + ')';
	}
}

// [SID]
class layout {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height
		this.children = new Array();
	}
	transform(x, y, width, height) {
		this.x = x * c.vw;
		this.y = y ^ c.vh;
		this.width = width * c.vw
		this.height = height * c.vh
	}
}

// [SID]
class textBox extends layout {
	constructor(x = c.xc, y = c.yc, width = c.w, height = c.h, text = "TextBox", fontSize = 19) {
		super()
		this.text = text;
		this.fontSize = fontSize;
		this.fontWeight = 500;
		this.fontStyle = "Arial";
		this.textColor = "white";
		this.alignment = "center"
		this.angle = 0
		this.scale = this.width;
	}
	render() {
		cc.font = this.fontWeight + " " + this.fontSize * this.scale + "px " + this.fontStyle
		cc.translate(this.x, this.y);
		cc.rotate(degToRad(this.angle));
		wrapText(this.text, this.x, this.y, this.width, this.fontSize, this.color, this.font, this.alignment)
		cc.restore()
		wrapText(this.text, this.x, this.y, this.width, this.fontSize, this.color, this.font, this.alignment)
	}
}

// [SID]
class draggable {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.xv = 0;
		this.yv = 0;
		this.width = width;
		this.height = height
		this.selected = false;
		this.offsetX = 0
		this.offsetY = 0;
		this.movementMultiplierX = 1
		this.movementMultiplierY = 1
		this.selector = new Point2D(0, 0);
		this.attachment = null;
		this.attached = false;
		this.color = "grey";
		this.selectedColor = "lime";
		this.deselectedColor = "darkgrey"
	}
	check(point) {
		this.selected =
			point.x > this.x - this.width / 2 &&
			point.x < this.x + this.width / 2 &&
			point.y > this.y - this.height / 2 &&
			point.y < this.y + this.height / 2;
		if (this.selected) {
			this.offsetX = this.x - point.x;
			this.offsetY = this.y - point.y;
			this.selector = point;
			this.color = this.selectedColor;
		} else {
			this.color = this.deselectedColor;
		}
		return this.selected;
	}
	update() {
		if (this.selected) {
			this.xv = (this.selector.x + this.offsetX) - this.x
			this.yv = (this.selector.y + this.offsetY) - this.y
			this.x += this.xv;
			this.y += this.yv;
			if (this.attached) {
				this.attachment.x += this.xv * this.movementMultiplierX;
				this.attachment.y += this.yv * this.movementMultiplierY;
			}
		}
	}
	render() {
		alpha(0.7)
		Rect(this.x, this.y, this.width, this.height, this.color);
		alpha(1)
	}
	deselect() {
		this.selected = false;
		this.color = this.deselectedColor;
	}
	attach(object, movementMultiplierX = 1, movementMultiplierY = 1) {
		this.attached = true;
		this.attachment = object;
		this.movementMultiplierX = movementMultiplierX;
		this.movementMultiplierY = movementMultiplierY
	}
	detach() {
		this.attached = false;
		this.attachment = null;
	}
	ondragStart() { };
	ondrag() { };
	ondragEnd() { };
}

// [SID]
class infoBox {
	constructor(title, x, y, color, fontSize = 20, fontStyle = 'Arial', fontUnit = 'px') {
		this.title = title;
		this.x = x;
		this.y = y;
		this.width = 0;
		this.heigth = 0;
		this.alpha = 0.3;
		this.color = color;
		this.textColor = "white";
		this.edgeColor = "white";
		this.info = [];
		this.margin = 30;
		this.lineSpace = 10;
		this.fontSize = fontSize;
		this.fontStyle = fontStyle;
		this.fontUnit = fontUnit;
		this.growthSpeed = 2
		this.font = this.fontSize + '' + this.fontUnit + ' ' + this.fontStyle;
	}
	add(name, value) {
		this.info.push({
			name: name,
			value: value,
			type: "message",
		});
	}
	addSetion() { }
	clearInfo() {
		this.info.length = 0;
	}
	update() {
		let context = cc;
		context.font = this.font;
		this.font = this.fontSize + '' + this.fontUnit + ' ' + this.fontStyle;
		this.lineSpace = this.fontSize + 5;
		let width = context.measureText(this.title).width;
		if (this.info.length > 0) {
			for (let text = this.info.length - 1; text > -1; --text) {
				let data = this.info[text];
				let information = data.name + " " + data.value + " ";
				let widthTxt = context.measureText(information).width * 0.7;
				if (widthTxt > width) {
					width = widthTxt
				};
			};
			this.width = approach(this.width, width, this.growthSpeed).value;
		} else {
			this.width = context.measureText(this.title).width;;
		};
		this.width += this.margin * 2;
		// this.height = ((this.fontSize * 1.3 + this.lineSpace) * this.info.length) / 2
		this.height = approach(this.height, ((this.fontSize * 1.3 + this.lineSpace) * this.info.length) / 2, this.growthSpeed).value;
		// context = null;
	}
	render() {
		let context = cc;
		context.shadowBlur = 0;
		context.fillStyle = this.color;
		context.globalAlpha = this.alpha;
		context.fillRect(this.x, this.y, this.width + this.margin * 2, this.height + this.margin * 2);
		context.globalAlpha = 1;
		context.strokeStyle = this.edgeColor;
		context.lineWidth = 5;
		context.strokeRect(this.x, this.y, this.width + this.margin * 2, this.height + this.margin * 2);

		let x = this.x + this.margin;
		let y = this.y + (this.margin * 1.2);
		context.textAlign = 'left';
		context.textBaseline = "middle";
		rect(x, this.y + this.fontSize * 1.65, this.width, 2, this.textColor)
		context.fillStyle = this.textColor;
		context.font = "600 " + this.fontSize * 1.2 + "px " + this.fontStyle
		context.fillText(this.title, x + 10, this.y + this.fontSize * 1.15);
		context.font = this.font;
		y += this.lineSpace;
		for (let text = 0; text < this.info.length; ++text) {
			let data = this.info[text];
			if (data.type == 'message') {
				let information = data.name + " " + data.value + " ";
				// context.foot = this.font;
				context.fillText(information, x, y);
			}
			y += this.lineSpace;
		}
		// this.width = this.height = 0;
		// context = null;
	}
}

// [I/D]
class oscilator {
	constructor(speed = 100, amplitude = 100) {
		this.amplitude = amplitude;
		this.speed = speed;
		this.value = 0;
		this.angle = 0;
	}
	update(deltatime) {
		this.angle += degToRad((this.speed) * deltatime);
		this.value = Math.sin(this.angle) * this.amplitude;
	}
}

// [SID]
class oscilation {
	constructor(value = 0, lowLimit = 0, highLimit = 100, speed = 10) {
		this.value = value;
		this.lowLimit = lowLimit;
		this.highLimit = highLimit;
		this.speed = speed;
		this.direction = 1
	}
	update(deltatime = Caldro.time.deltatime) {
		this.value += (this.speed * deltatime * this.direction);
		if (this.value < this.lowLimit) {
			this.value = this.lowLimit + (this.lowLimit - this.value);
			this.direction = 1;
		} else if (this.value > this.highLimit) {
			this.value = this.highLimit - (this.value - this.highLimit);
			this.direction = -1;
		}
	}
	getValue() {
		return this.value;
	}
}

// [SID]
class revolver {
	constructor(target, radius, speed, direction = 'cl') {
		this.x = target.x;
		this.y = target.y;
		this.target = target;
		this.radius = radius;
		this.speed = speed;
		this.newPos = 0;
		this.direction = direction;
		this.mode = 'rotating';
		this.update = function (deltatime) {
			this.newPos += degToRad(this.speed * deltatime);
			if (this.direction == 'cl') {
				this.x = this.target.x + (Math.cos(this.newPos)) * this.radius;
				this.y = this.target.y + (Math.sin(this.newPos)) * this.radius;
			} else if (this.direction == 'ancl') {
				this.x = this.target.x + (Math.sin(this.newPos)) * this.radius;
				this.y = this.target.y + (Math.cos(this.newPos)) * this.radius;
			}
		};
		this.show = function (fill = "orange", lineWidth = 100) {
			circle(this.target.x, this.target.y, 10, fill);
			stCircle(this.target.x, this.target.y, this.radius, fill, lineWidth);
		};
	}
}

// [SID] [NF]
class ray {
	constructor(x = c.xc, y = c.yc, angle = 90, length = 1000, color = "blue") {
		this.x = x;
		this.y = y,
			this.endPoint = new Point2D(this.x, this.y);
		this.angle = angle;
		this.length = length
		this.color = color,
			this.lineWidth = 5;
		this.data = new Array()
	}
	callback() { };
	update() {
		let rad = degToRad(this.angle);
		this.endPoint.x = this.x + this.length * Math.sin(rad);
		this.endPoint.y = this.y + this.length * -Math.cos(rad);
		this.callback();
	}
	render() {
		line(this.x, this.y, this.endPoint.x, this.endPoint.y, this.color, this.lineWidth)
	}
	/* castTo(pointX, pointY){
		this.endPoint.x = pointX
	} */
}

// [SID]
class trigger {
	constructor(x = 0, y = 0, w = 0, h = 0, target = null) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.activated = false;
		this.DeactivatedColor = 'rgba(255,100,255,0.7)';
		this.ActivatedColor = 'rgba(255,10,10,0.5)';
		this.times = 0;
		this.timer = 0;
		this.triggerer = null;
		this.attachment = null;
		this.active = true;
		this.data = [];
		this.target = target;
		this.checking = false;
		this.executeOnStart = true;
		if (this.target != null) {
			this.setTarget(this.target);
		}
	}
	sizing(a) {
		if (a.width == undefined) {
			// this.width = a.radius;
			// this.height = a.radius;
		} else {
			this.width = a.width;
			this.height = a.height;
		}
	}
	start(){}
	effect() { }
	end(){}
	callback() { }
	drawing() { }
	check(a) {
		this.activated = collided(this, a, 'aabb');
		if (this.active && this.activated) {
			if(this.executeOnStart){
				this.start()
				this.executeOnStart = false
			}
			this.triggerer = a;
			this.effect();
			++this.times;
			return this.activated;
		} else {
			this.executeOnStart = true
		}
		this.triggerer = null;
		return false;
	}
	update(offsetX = 0, offsetY = 0) {
		if (this.attached == true) {
			this.x = this.attachment.x + offsetX;
			this.y = this.attachment.y + offsetY;
		}
		if (this.checking) {
			this.check(this.target);
		}
		this.callback();
	}
	rende() {
		this.drawing();
	}
	show(fill) {
		this.color;
		glow(0);
		if (this.target != null) {
			line(this.x, this.y, this.target.x, this.target.y, 'rgha(255, 255, 255, 0.3)', 2);
		}
		if (this.active) {
			if (fill == undefined) {
				if (this.activated == true) {
					this.color = this.ActivatedColor;
				} else {
					this.color = this.DeactivatedColor;
				};
			} else {
				this.color = fill;
			}
		} else {
			this.color = 'rgba(100,100,200,0.5)';
		}
		Rect(this.x, this.y, this.width, this.height, this.color);
	}
	attach(who) {
		this.attachment = who;
		this.attached = true;
		this.target = who;
		this.x = who.x;
		this.y = who.y;
	}
	unattach() {
		this.attachment = null;
		this.attached = false;
	}
	setTarget(who) {
		this.target = who;
		this.checking = true;
	}
	removeTarget() {
		this.target = null;
		this.checking = false;
	}
}

//Timer class, Independent of Caldro's time object
// [SID]
class timer {
	constructor(name = "Caldro Timer") {
		this.name = name
		this.running = false;
		this.paused = false;
		this.startTime = 0;
		this.pauseStartTime = 0;
		this.pausedTime = 0;
		this.elapsedTime = 0;
		this.offsetingTIme = 0;
	}
	update() {

	}
	start() {
		if (!this.paused) {
			this.running = true;
			this.startTime = performance.now() / 1000;
		} else {
			console.error("An attempt has been made to start a paused timer\nTimer '" + this.name + "'\nResume timer instead")
		}
	}
	pause() {
		if (!this.paused) {
			this.paused = true;
			this.pauseStartTime = performance.now() / 1000;
		} else {
			console.error("An attempt has been made to pause an already paused timer\nTimer '" + this.name + "'")
		}
	}
	resume() {
		if (this.paused) {
			this.paused = false;
			this.pausedTime += performance.now() / 1000 - (this.pauseStartTime);
		} else {
			console.error("An attempt has been made to resume an already running timer\nTimer '" + this.name + "'")
		}
	}
	stop() {
		if (this.paused) {
			this.resume();
		}
		this.elapsedTime = ((performance.now() / 1000) - this.startTime) - this.pausedTime;
		return this.elapsedTime
	}
	getCurrentTime() {
		if (this.paused) {
			this.resume();
		}
		this.elapsedTime = ((performance.now() / 1000) - this.startTime) - this.pausedTime - this.offsetingTIme;
		return this.elapsedTime
	}
	setTime(timeInSeconds = 0) {
		if (this.paused) {
			this.resume();
		}
		this.offsetingTIme = ((performance.now() / 1000) - this.startTime) - this.pausedTime - timeInSeconds;
		return this.getCurrentTime()
	}
}

// [SID]
class button {
	constructor(x = 0, y = 0, width = 80, height = 30, text = 'Button', color = 'Grey', strokeColor = 'white') {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.lineWidth = 10;
		this.text = text;
		this.textColor = 'white';
		this.color = color;
		this.strokeColor = strokeColor;
		this.clicks = 0;
		this.delay = 0;
		this.active = true;
		this.visible = true;
		this.selected = false;
		this.touchPoint = null;
		this.fontSize = 30;
		this.drawingStyle = 1;
		this.data = [];
		this.setFontSize = function () {
			//return font((cc.measureText(this.text).width)*(1/this.width)
			//cc.lineHeight = this.height*0.7
			let size = this.width * (10 / (cc.measureText(this.text).width));
			return font(size);
		};

		this.show = function () {
			if (this.visible == true) {
				this.render();
				this.drawing();
				this.callback();
				if (!this.active) {
					if (this.drawingStyle != 3) {
						Rect(this.x, this.y, this.width, this.height, "rgba(0, 0, 0, 0.5");
					}
				}
			}
		};

		this.render = function () {
			if (this.drawingStyle == 1) {
				Rect(this.x, this.y, this.width, this.height, this.color);
				txt(this.text, this.x, this.y, font(this.fontSize), this.textColor);
			} else if (this.drawingStyle == 2) {
				curvedRect(this.x, this.y, this.width, this.height, this.color, 20);
				stCurvedRect(this.x, this.y, this.width, this.height, this.strokeColor, 20, this.lineWidth);
				txt(this.text, this.x, this.y, font(this.fontSize), this.textColor);
				if (this.active == false) {
					curvedRect(this.x, this.y, this.width, this.height, 'rgba(50,50,50,0.5)');
					stCurvedRect(this.x, this.y, this.width, this.height, 'rgba(50,50,50,0.5)', 20, this.lineWidth);
				}
			} else if (this.drawingStyle == 3) {
				this.drawing();
			}
		};

		this.listen = function (point) {
			if (this.active && !this.selected) {
				if (pointIsIn(point, this)) {
					this.onclick();
					this.touchPoint = point;
					this.selected = true;
					++this.clicks;
					return true;
				}
				return false;
			}
		};

		this.autoListen = function () {
			if (this.active && !this.selected) {
				let point = Caldro.screen.getFirstPointerIn(this)
				if (point) {
					this.onclick();
					this.touchPoint = point;
					this.selected = true;
					++this.clicks;
					return true;
				}
				return false;
			}
		};

		this.stopListening = function () {
			if (this.selected) {
				this.selected = false;
				this.onClickEnd();
				this.touchPoint = null;
			}
		};

		this.autoStopListening = function () {
			if (this.selected && !Caldro.screen.checkForPointerIn(this)) {
				this.selected = false;
				this.onClickEnd();
				this.touchPoint = null;
			}
		};

		this.effect = function () { };
		this.callback = function () { };
		this.drawing = function () { };
		this.onclick = function () { };
		this.onClickEnd = function () { };

		this.set = function (value) {
			this.visible = value;
		};

		this.position = function (x = this.x, y = this.y, width = this.width, height = this.height, fontSize = this.fontSize, color = this.color) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.fontSize = fontSize
			this.color = color;
		};

		//END OF BUTTON OBJECT
	}
}

class buttonHandler {
	constructor() {
		this.buttons = new Array();
		this.active = true;
	}
	updateButtons() {
	}
}

// [SID]
class particle {
	constructor(x, y, xv, yv, size, colors = "white", timer = null, renderingFunction = 'box', decayStyle = 'shrink') {
		this.particleSystem = null;
		this.timer = timer;
		this.lifeTime = 1;
		this.x = x;
		this.y = y;
		this.xv = xv;
		this.yv = yv;
		this.outsideForce = [0, 0];
		this.friction = [0, 0]
		this.colors = colors;
		this.alpha = 1;
		this.colorIndex = 0;
		this.color = colors
		// this.color = this.colors[this.colorIndex];
		// this.colorChangeRate = Math.floor(this.timer / this.colors.length);
		// this.alphaChangeRate = this.size / this.originalState.size;
		this.decayStyle = decayStyle;
		this.glow = 10;
		this.renderingFunction = renderingFunction;
		this.size = size;
		this.sizeChangeMultiplier = 1
		this.lineWidth = 4;
		this.data = new Array();
		this.originalState = {
			x: this.x,
			y: this.y,
			size: size,
			timer: timer,
		};
		this.sizeChangeRate;
		if (this.timer == null) {
			this.sizeChangeRate = 0
		} else {
			this.sizeChangeRate = this.size / this.timer;
		}
		this.toDelete = false;
	}

	onDelete() { }

	addToParticleSystem(particleSystem) {
		particleSystem.addParticle(this)
		this.particleSystem = particleSystem
	}

	removeFromParticleSystem(particleSystem) {

	}

	callback() { }

	update(deltatime = 1) {
		if (this.particleSystem != null) {
			deltatime *= this.particleSystem.speedMultiplier;
			this.size = this.originalState.size * this.particleSystem.scaleFactor;
		}
		let passedTime = deltatime;
		this.timer -= passedTime;
		this.lifeTime += passedTime;
		// let Pspointer = this.particleSystem;
		if (typeof this.color == "object") {
			if (Math.round(this.lifeTime) % this.colorChangeRate == 0) {
				// this.colorIndex = limit(this.colorIndex + 1, 0, this.colors.length - 1);
				this.color = this.colors[this.colorIndex];
			}
		} else {
			this.color = this.colors;
		}
		if (this.particleSystem != null) {
			addFriction(this, this.friction, deltatime)
			this.xv += this.outsideForce[0]
			this.yv += this.outsideForce[1]
			this.x += (this.xv * deltatime) * this.particleSystem.scaleFactor;
			this.y += (this.yv * deltatime) * this.particleSystem.scaleFactor;
		} else {
			this.xv += this.outsideForce[0];
			this.yv += this.outsideForce[1];
			this.x += (this.xv * deltatime);
			this.y += (this.yv * deltatime);
		}
		let sizeChange = (this.sizeChangeRate) * deltatime;
		// let sizeChange = (this.sizeChangeRate * this.particleSystem!=null?this.particleSystem.scaleFactor:1) * deltatime;
		if (this.decayStyle.includes('shrink')) {
			this.size = limit(this.originalState.size - sizeChange * this.sizeChangeMultiplier, 0)
		} else if (this.decayStyle.includes("grow")) {
			this.size = limit(this.originalState.size + sizeChange * this.sizeChangeMultiplier, 0);
		}
		if (this.decayStyle.includes('fadeout')) {
			if (this.timer) {
				this.alpha = scaleTo(this.timer, 0, this.originalState.timer, 0, 1);
			}
		}
		this.callback();
	}

	render() {
		glow(this.glow, this.color);
		cc.save();
		alpha(this.alpha)
		// alert(this.y)
		if (typeof this.renderingFunction == 'function') {
			this.renderingFunction();
		} else if (this.renderingFunction == 'box') {
			Rect(this.x, this.y, this.size, this.size, this.color);
		} else if (this.renderingFunction.includes('cir')) {
			circle(this.x, this.y, this.size, this.color);
		} else if (this.renderingFunction.includes('line')) {
			cc.lineWidth = this.lineWidth;
			line(this.x, this.y, this.x + this.xv * this.size, this.y + this.yv * this.size, this.color, 2);
		} else {
			Rect(this.x, this.y, 50, 50, 'darkblue');
		}
		alpha(1)
		cc.restore();
		glow(0);
	}
}

// [SID]
class particleSystem {
	constructor() {
		this.particles_Array = new Array();
		this.scaleFactor = 1;
		this.createdParticles = 0;
		this.destroyedParticles = 0;
		this.speedMultiplier = 1;
		this.shouldCreateParticles = true
		this.precisePlacment = true
		this.active = true;
		this.individualParticleModification = NULLFUNCTION;
	}
	addParticle(particle) {
		this.particles_Array.push(particle)
		++this.createdParticles;
	}

	createParticle(x, y, xv, yv, size, colors = ['white'], timer = null, type = 'box', decayStyle = 'shrink') {
		let _particle = new particle(x, y, xv, yv, size, colors, timer, type, decayStyle)
		_particle.particleSystem = this;
		return _particle;
	};


	particleSource(x, y, width, height, xv = [0, 0], yv = [0, 0], forces = [[0, 0], [0, 0]], size = 20, colors = ['white'], outputRate = 1, timer = null, renderingFunction = 'box', decayStyle = 'shrink') {
		if (this.shouldCreateParticles && this.active) {
			let Pxv, Pyv;
			for (let a = 0; a < outputRate; ++a) {
				if (typeof xv == "object") {
					Pxv = randomNumber(xv[0], xv[1], true);
				} else if (typeof xv == "number") {
					Pxv = xv;
				}
				if (typeof yv == "object") {
					Pyv = randomNumber(yv[0], yv[1], true);
				} else if (typeof yv == "number") {
					Pyv = yv;
				}
				width *= this.scaleFactor;
				height *= this.scaleFactor;
				let px = randomNumber(x - width / 2, x + width / 2, this.precisePlacment);
				let py = randomNumber(y - height / 2, y + height / 2, this.precisePlacment);
				let particle = this.createParticle(px, py, Pxv, Pyv, size, colors, timer, renderingFunction, decayStyle);
				particle.glow = glow;
				if (typeof forces[0] == "number") {
					particle.outsideForce = forces;
				} else if (typeof forces[0] == "object") {
					particle.outsideForce = forces[0]
					if (forces[1]) {
						particle.friction = forces[1]
					}
				}
				this.individualParticleModification(particle)
				this.particles_Array.push(particle);
			}
		}
	};

	updateAndRenderAll(deltatime = 1, update = true, render = true) {
		if (this.active) {
			// for (let pv = 0; pv < this.particles_Array.length; ++pv) {
			for (let pv = this.particles_Array.length - 1; pv > -1; --pv) {
				let particle = this.particles_Array[pv];
				/* if(particle.data["finished"]){
					
				} */
				if (update) {
					particle.update(deltatime);
					if (particle.x == NaN || particle.y == NaN || particle.xv == NaN || particle.yv == NaN) {
						console.error("A particle from a particle System has a particle that has a NaN value")
						console.log(particle)
					}
				}
				let timer = particle.timer != null ? particle.timer : 1;
				if (timer <= 0 || particle.size == 0 || particle.toDelete) {
					// particle.data["finished"] = true
					particle.onDelete();
					delete this.particles_Array[pv];
					this.particles_Array.splice(pv, 1);
					continue;
				}
				if (render) {
					particle.render();
				}
			}
		}
	};

	getArray() {
		return this.particles_Array;
	};

	amountOfParticles() {
		return this.particles_Array.length;
	};

	clearParticles(array = 'in') {
		return this.particles_Array.length = 0;
	};
};

// [SID]
class camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = c.w;
		this.height = c.h;
		this.inWorldBounds = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
		this.zoom = 1;
		this.zoomSpeed = 3;
		this.zoomRatio = 446;
		this.adjustedZoom = 1;
		this.attachment = null;
		this.attached = false;
		this.capturing = false;
		this.actualOffsetX = 0;
		this.actualOffsetY = 0;
		this.shakeOffsetX = 0;
		this.shakeOffsetY = 0;
		this.angle = 0;
		this.frame = 0;
		this.speed = 200;
		this.translationX = this.camtranslationX = 0;
		this.translationY = this.camtranslationY = 0;
		this.pointer = new Point2D();

		this.mimicCamera = function (referrence_camera = this) {
			this.x = referrence_camera.x;
			this.y = referrence_camera.y;
			this.zoom = referrence_camera.zoom;
			this.actualOffsetX = referrence_camera.actualOffsetX;
			this.actualOffsetY = referrence_camera.actualOffsetY;
			this.angle = referrence_camera.angle;
		};

		this.showCamera = function (otherCamera) {
			if (otherCamera == this) {
				// Caldro.reportError("A camera cannot perform the operation 'showCamera' on itself", "SPECIAL OBJECT: camera", false)
			} else {
				otherCamera.update();
				otherCamera.resolve();
			}
			let x = -otherCamera.camtranslationX;
			let y = -otherCamera.camtranslationY;
			circle(-x, -y, 40, "red")
			let cx = -otherCamera.camtranslationX + otherCamera.width / 2;
			let cy = -otherCamera.camtranslationY + otherCamera.height / 2;
			let width = c.w * (1 / otherCamera.zoom)
			let height = c.h * (1 / otherCamera.zoom)
			let angle = otherCamera.angle
			cc.save();
			cc.rotate(degToRad(-angle))
			alpha(0.05)
			strect(x, y, width, height, "white", 100)
			alpha(0.1)
			rect(x, y, width, height, "white")
			alpha(0.5)
			strect(x, y, width, height, "white", 5)
			alpha(0.3)
			circle(x, y, 50, "white")
			alpha(0.5)
			let lw = 100;
			let lh = 4;
			Rect(cx, cy, lw, lh, "white")
			Rect(cx, cy, lw, lh, "white", 90)
			cc.restore();
			alpha(1)
		}
		
		this.updatePointer = function (pointer) {
			let magnificationX = ((c.w * (1 / this.adjustedZoom)) / c.w)
			let magnificationY = ((c.h * (1 / this.adjustedZoom)) / c.h)
			this.pointer.x = this.x + (pointer.x * magnificationX) - (c.hw * magnificationX)
			this.pointer.y = this.y + (pointer.y * magnificationY) - (c.hh * magnificationY)
		}
		/* this.shake = function(magnitudeX, magnitudeY, timer){
			if(this.shakeTime <= timer){
			   
			}
		}
		*/
		this.resetOffset = function (resetShakeOffset = true, resetActualOffset = false) {
			if (resetActualOffset) {
				this.actualOffsetX = this.actualOffsetY = 0;
			}
			if (resetShakeOffset) {
				this.shakeOffsetX = this.shakeOffsetY = 0;
			}
		};
		
		this.update = function () {
			this.pre_shot();
			this.capturing = true;
			this.width = c.w * (1 / this.zoom);
			this.height = c.h * (1 / this.zoom);
			if (this.attached == true) {
				place(this, this.attachment);
			}
			let radAngle = -degToRad(this.angle)
			this.adjustedZoom = this.zoom

			let offsetX = this.actualOffsetX + this.shakeOffsetX;
			let offsetY = this.actualOffsetY + this.shakeOffsetY;
			
			let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(this.width / 2, this.height / 2));
			let offsetAngle = 180 - angleBetweenPoints(ORIGIN, new Point2D(this.width / 2, this.height / 2));
			// this.angle = 0	
			// this.translationX = -((this.x + offsetX) -~ (c.hw * 1 / this.adjustedZoom)) /* * Math.sin(radAngle); */
			// this.translationY = -((this.y + offsetY) - (c.hh * 1 / this.adjustedZoom)) /* * Math.cos(radAngle); */
			this.camtranslationX = -((this.x + offsetX) - (c.hw * 1 / this.adjustedZoom))
			this.camtranslationY = -((this.y + offsetY) - (c.hh * 1 / this.adjustedZoom))
			
			// offsetX = offsetY = null;
			
			cc.save();
			cc.scale(this.adjustedZoom, this.adjustedZoom);
			cc.translate(this.camtranslationX, this.camtranslationY);
			cc.rotate(radAngle);
			++this.frame;
			this.callback();
		};
		
		this.pre_shot = this.callback = function () { };

		this.resolve = function () {
			cc.restore();
			this.capturing = false
		};
		
		this.attach = function (object) {
			this.attachment = object;
			this.attached = true;
		};
		
		this.unattach = function () {
			this.attachment = null;
			this.attached = false;
		};
	}
}

// [NF]
class experimental_camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = c.w;
		this.height = c.h;
		this.inWorldBounds = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
		this.zoom = 1;
		this.zoomSpeed = 3;
		this.zoomRatio = 446;
		this.adjustedZoom = 1;
		this.attachment = null;
		this.attached = false;
		this.capturing = false;
		this.actualOffsetX = 0;
		this.actualOffsetY = 0;
		this.shakeOffsetX = 0;
		this.shakeOffsetY = 0;
		this.offsetAngle = 0
		this.angle = 0;
		this.frame = 0;
		this.speed = 200;
		this.translationX = this.camtranslationX = 0;
		this.translationY = this.camtranslationY = 0;
		this.pointer = new Point2D();
		this.info = new infoBox("CAMERA", 20, 20, "blue")

		this.mimicCamera = function (referrence_camera = this) {
			this.x = referrence_camera.x;
			this.y = referrence_camera.y;
			this.zoom = referrence_camera.zoom;
			this.actualOffsetX = referrence_camera.actualOffsetX;
			this.actualOffsetY = referrence_camera.actualOffsetY;
			this.angle = referrence_camera.angle;
		};
		
		this.showCamera = function (otherCamera) {
			if (otherCamera == this) {
				// Caldro.reportError("A camera cannot perform the operation 'showCamera' on itself", "SPECIAL OBJECT: camera", false)
			} else {
				otherCamera.update();
				otherCamera.resolve();
			}
			let x = -otherCamera.camtranslationX;
			let y = -otherCamera.camtranslationY;
			circle(-x, -y, 40, "red")
			let cx = -otherCamera.camtranslationX + otherCamera.width / 2;
			let cy = -otherCamera.camtranslationY + otherCamera.height / 2;
			let width = c.w * (1 / otherCamera.zoom)
			let height = c.h * (1 / otherCamera.zoom)
			let angle = otherCamera.angle
			cc.save();
			cc.rotate(degToRad(-angle))
			alpha(0.05)
			strect(x, y, width, height, "white", 100)
			alpha(0.1)
			rect(x, y, width, height, "white")
			alpha(0.5)
			strect(x, y, width, height, "white", 5)
			alpha(0.3)
			circle(x, y, 50, "white")
			alpha(0.5)
			let lw = 100;
			let lh = 4;
			Rect(cx, cy, lw, lh, "white")
			Rect(cx, cy, lw, lh, "white", 90)
			cc.restore();
		}

		this.updatePointer = function (pointer) {
			let magnificationX = ((c.w * (1 / this.adjustedZoom)) / c.w)
			let magnificationY = ((c.h * (1 / this.adjustedZoom)) / c.h)
			this.pointer.x = this.x + this.camtranslationX + ((pointer.x * magnificationX) - (c.hw * magnificationX))/*  * sine(this.angle) */
			this.pointer.y = this.y + this.camtranslationY + ((pointer.y * magnificationY) - (c.hh * magnificationY))/*  * -cosine(this.angle) */
		}
		/* this.shake = function(magnitudeX, magnitudeY, timer){
		   if(this.shakeTime <= timer){
			   
		   }
		 }
		 */
		this.resetOffset = function (resetShakeOffset = true, resetActualOffset = false) {
			if (resetActualOffset) {
				this.actualOffsetX = this.actualOffsetY = 0;
			}
			if (resetShakeOffset) {
				this.shakeOffsetX = this.shakeOffsetY = 0;
			}
		};

		this.update = function () {
			this.pre_shot();
			this.capturing = true;
			this.width = c.w * (1 / this.zoom);
			this.height = c.h * (1 / this.zoom);
			if (this.attached == true) {
				place(this, this.attachment);
			}
			let radAngle = -degToRad(this.angle)
			this.adjustedZoom = this.zoom

			let offsetX = this.actualOffsetX + this.shakeOffsetX;
			let offsetY = this.actualOffsetY + this.shakeOffsetY;
			this.angle += 1

			// this.angle = - this.angle;
			/* let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(
				scaleTo(this.x, 0, this.width / 2, 0, this.width / 2),
				scaleTo(this.y, 0, this.height / 2, 0, this.height / 2)
			)) * (this.zoom); */
			// let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(this.width / 2, this.height / 2)) * (this.zoom);
			// this.offsetAngle = 180 - angleBetweenPoints(ORIGIN, new Point2D(this.width / 2, this.height / 2));
			// this.camtranslationX = (( (this.x )  * 1/this.zoom)) + (topLeftToCenterLength * sine(this.angle - this.offsetAngle))
			// this.camtranslationY = (( (this.y )  * 1/this.zoom)) + (topLeftToCenterLength * -cosine(this.angle - this.offsetAngle))
			
			// let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(this.width / 2, this.height / 2)) * (this.zoo +m); 
			// let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(this.width / 2, this.height / 2)) * (this.zoom);  
			let topLeftToCenterLength = dist2D(ORIGIN, new Point2D(this.width / 2, this.height / 2)) * (this.zoom); 
			this.offsetAngle = 180 - angleBetweenPoints(ORIGIN, new Point2D(this.width / 2, this.height / 2));
			this.camtranslationX = (((this.x ) * (1/this.zoom))) + topLeftToCenterLength * sine(this.angle - this.offsetAngle)
			this.camtranslationY = (((this.y ) * (1/this.zoom))) + topLeftToCenterLength * -cosine(this.angle - this.offsetAngle) 

			// offsetX = offsetY = null;

			cc.save();
			cc.resetTransform()
			cc.scale(this.adjustedZoom, this.adjustedZoom);
			cc.translate(this.camtranslationX, this.camtranslationY);
			cc.rotate(degToRad(this.angle));
			cc.translate(0, 0);
			++this.frame;
			this.callback();
			this.info.add("X: ", this.x)
			this.info.add("Y: ", this.y)
			this.info.add("zoom: ", this.zoom)
			this.info.add("half-diag", topLeftToCenterLength)
			this.info.add("transX", this.camtranslationX)
			this.info.add("transY", this.camtranslationY)
		};

		this.pre_shot = this.callback = function () { };

		this.resolve = function () {
			cc.restore();
			this.capturing = false
		};

		this.attach = function (object) {
			this.attachment = object;
			this.attached = true;
		};

		this.unattach = function () {
			this.attachment = null;
			this.attached = false;
		};
	}
}

// [NU]
class cameraManager {
	constructor() {
		this.cameras = new Array()
		this.ICM = new ImageCanvasManager();
	}
}



var CaldroCam = new camera();
var Ps = new particleSystem();
var GameKeys = new keyStateHandler();

var Caldro = {
	time : {
		deltatime: 0,
		elapsedTime: 0,
		currentFrame: 0,
		previousFrame: 0,
		_lastFrame: 0,
		framesPerSecond: 0,
		lastRecordedFramesPerSecond: new Array(),
		maxFramesPerSecond: 100,
		avergeFrameRateRecordingSpan: 10,
		cycles: 0,
		update: function(){
			let ct = Caldro.time
			++ct.cycles;
			ct.currentFrame = window.performance.now() / 1000;
			if(ct.currentFrame - ct._lastFrame < (1/ct.maxFramesPerSecond)){
				ct.deltatime = 0
				return;
			}
			ct.deltatime = ct.currentFrame - ct._lastFrame //+ ((ct.currentFrame - ct._lastFrame) - (1/ct.maxFramesPerSecond))
			ct.previousFrame = ct._lastFrame;
			ct._lastFrame = ct.currentFrame
			
			ct.elapsedTime += ct.deltatime;
			ct.framesPerSecond = 1/ct.deltatime;
			ct.lastRecordedFramesPerSecond.push(ct.framesPerSecond)
			if(ct.lastRecordedFramesPerSecond.length > ct.avergeFrameRateRecordingSpan){
				ct.lastRecordedFramesPerSecond.shift();
			}
		},
		getAverageFrameRate: function(){
			let ct = Caldro.time;
			if(!ct.lastRecordedFramesPerSecond.length > 0) return 0;
			return arraySum(ct.lastRecordedFramesPerSecond) / ct.lastRecordedFramesPerSecond.length;
		}
	},

	game : {
		// ! ~Not in use~ !
		world: {
			dimensions: {
				meters: c.min/10,
			}
		},
	},
	
	display: {
		// ! ~Not in use~ !
		aspectRatio: [16, 9],
		
	},

	info : {
		version: "0.2.0",
		logIssues: false,
		debuggingLogs : {
			// ! ~Not in use~ !
			audio: true,
			rendering: true,
			particleSystem: true,
			setAll: function(value = true){
				this.audio = value;
				this.rendering = value;
				this.particleSystem = value;
			}
		},
	    isloggingIssues: function(){
			return this.logIssues
		},
		currentCamera : CaldroCam,
		currentKeyStateHandler: GameKeys,
		displayText : {
			text : "Caldro is Active",
			color : 'lightgreen'
		}
	},
	
	renderer: {
		canvas: get("Caldro_Canvas"),
		context: get("Caldro_Canvas").getContext("2d"),
		setRenderingCanvas: function(canvas){
			if(getConstructorName(canvas) == "HTMLCanvasElement"){
				this.canvas = canvas
				this.context = this.canvas.context
				Caldro.rendering.canvas = this.canvas
				Caldro.rendering.context = this.canvas.context
			}
		},
		getCurrentRenderingInfo: function(){
			return {
				canvas: this.canvas,
				context: this.context
			}
		},
		hidingCursor: false,
		cursorType: "arrow",
		shouldHideCursor: function(bool = false){
			if(bool){
				this.canvas.style.cursor = "none"
			} else {
				this.canvas.style.cursor = this.cursorType;
			}
		},
		setCursorType: function(cursorType = "arrow"){
			this.cursorType = this.canvas.style.cursor = cursorType;
		}
	},

	rendering : {
		canvas: get("Caldro_Canvas"),
		context: get("Caldro_Canvas").getContext("2d"),
		plafrom: "CanvasRenderingContext2D",
		shapeClipping: false,
		shapeClippingCamera: null,
		glow: true,
		imageSmoothing: false,
		textOutlineThickness: 0,
		textOutlineColor: "black",
		defaultColor: "skyblue",
	},

	events : {
		handleMouseEvents: true,
		handleTouchEvents: true,
		handleKeyboardEvents: true,
		forceMapPointerEventToWindow: function(){
			window.ontouchstart = window.onmousedown = pointStartEvent;
			window.ontouchmove = window.onmousemove = pointMoveEvent;
			window.ontouchend = window.onmouseup = pointEndEvent;
		},
	},

	screen : {
		pointers : new Array(),
		checkForPointerIn: function(area){
			for(let point of Caldro.screen.pointers){
				if(pointIsIn(point, area)){
					return true
				}
			}
			return false;
		},
		getFirstPointerIn: function(area){
			for(let point of Caldro.screen.pointers){
				if(pointIsIn(point, area)){
					return point;
				}
			}
			return null;
		},
		addPointer: function(x, y, id = generateRandomId()){
			this.pointers.push(new Point2D(x, y))
		},
		updatePointers: function(touchEvent, type = "idle"){
			this.pointers.length = touchEvent.targetTouches.length;
			for(let touch = 0; touch < touchEvent.targetTouches.length; ++touch){
				let point = new Point2D();
				point.x = touchEvent.targetTouches[touch].pageX
				point.y = touchEvent.targetTouches[touch].pageY
				this.pointers[touch] = point
			}
			if(type == "start"){

			} else if(type == "move"){

			} else if(type == "end"){

			}
		},
		showPointers: function(){
			for(let point of this.pointers){
				cordShow(point)
			}
		}
	},

	getVersion: function(){
		return this.info.version;
	},	

	setCamera: function(CAMERA){
		this.info.currentCamera = CAMERA
	},
	getCamera: function(){
		return this.info.currentCamera;
	},
	
	setShapeClippingCamera: function(CAMERA){
		this.rendering.shapeClippingCamera = CAMERA;
	},

	setPlayer: function(PLAYER){
		this.info.currentPlayer = PLAYER;
	},	
	
	setKeyStateHandler: function(KEYSTATEHANDLER){
		this.info.currentKeyStateHandler = KEYSTATEHANDLER
	},

	reportError: function(errorDescription, errorSource, caldroCausedError = false){
		console.error(errorDescription+"\n"+"Error Source: "+errorSource)
		if(caldroCausedError){
			// needs a better error handling system currently
		}
	},

	physics: {

		entities: {
			blocks: new Array(),
			triggers: new Array(),
			bodies: new Array(),
			autoUpdate: function(){

			},
		},
		
	},

	auto: {
		layout: {
			updateLayouts: NULLFUNCTION,
			updateButtons: function(){

			},
			updateJoysticks: function(){

			},
		}
	},

	show : function(){
		if(this.showActive){
			let ratio = 1.6;
			rect(0, 0, c.w, c.h, "black")
			// let twidth = cc.measureText(Caldro.info.displayText.text).width
			glow(gen(0, 30), Caldro.info.displayText.color)
			txt(Caldro.info.displayText.text, c.xc, c.yc, font(c.w * ratio / (Caldro.info.displayText.text.length)), Caldro.info.displayText.color)
			txt(Caldro.info.displayText.text, c.xc, c.yc, font(c.w * ratio / (Caldro.info.displayText.text.length)), Caldro.info.displayText.color)
			txt(Caldro.info.displayText.text, c.xc, c.yc, font(c.w * ratio / (Caldro.info.displayText.text.length)), Caldro.info.displayText.color)
			glow(0)
		};
	},
	
	startAutoLoop: function(){
		CALDRO_INFINITE_LOOP()
	}
}



// adjustCanvas(c);
// console.log(Caldro)

function CaldroLoop(){};
const CALDRO_INFINITE_LOOP = function(){
	// Caldro.time.update()
	CaldroLoop()
	window.requestAnimationFrame(CALDRO_INFINITE_LOOP);
}

