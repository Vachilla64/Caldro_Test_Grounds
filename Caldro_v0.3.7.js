"CALDRO VERSION 0.3.7 [SID] {Big Library Wide update}" 
 "FLAGS: "
  "Backwards Incompatable Update [BIU]"
  "MOSTLY Stable update [PSU]"
""

"[ICL] {Incomplete change log}"

"Main updates: >>> "
  "Physics: indroduced the 'classicPhysics' class"
  "Physics: indroduced the 'Collisions' static functions class"
  "Physics: indroduced the 'classicPhysicsAABB' class"
  "Physics: indroduced the 'classicPhysicsWorld' class"
  "Physics: indroduced the 'classicPhysics.rigidBody' class"
  "Animations: indroduced the 'AnimationGraph' class"
  "Animations: indroduced the 'AnimationGraphNode' class"
  "Matricies: indroduced the 'Matrix' class"
  "Scenes: indroduced the 'Scene' class"
  "Scenes: indroduced the 'TransitionScreen' class"
  "Scenes: indroduced the 'SceneManager' object"
  "Machine Learning: indroduced the 'NeuralNerwork' class"
  "Machine Learning: indroduced the 'Perceptron' class"
  "Machine Learning: indroduced the 'NeuralNerwork.layer_dense' class"
  "Machine Learning: indroduced the 'Activation' static functions class"
  "Machine Learning: indroduced the 'geneticInformation' class"
  "Machine Learning: indroduced the 'NeuroEvolution' class"
  "Audio: Added the 'WAAPIaudioManger' class"
  "Caldro: Removed 'info.currentKeyStateHandler' and associated functions"
  "Caldro: Removed 'info.currentParticleSystem' and associated functions"
  "Caldro: Removed 'info.currentCamera' and associated functions"
""

"sub updates: >>"
  "Bug fixes: fixed a bug in the 'vecMath' object where the 'normal' function did not take any arguments"
  "Bug fixes: fixed a bug in the controls whick prevented events 'mousescrollUp' and 'mousescrollDown' from firing"
  "Bug fixes: fixed a bug with the 'pickColor' function"
  "Bug fixes: fixed a bug that make 'Caldro.events.handleTouchSwipeEvnets' irrelevant"
  "Utilities: renamed the'pickColor' utility function to 'pickRandomColor'"
  "arrUtils: added the specifier function to the 'arrUtills.min' fucntion"
  "arrUtils: added the specifier function to the 'arrUtills.max' fucntion"
  "Post-processing: indroduced the 'pixelateCanvas' operation"
  "Post-processing: introduced the 'manipulateImageData; operation"
  "File Management: added the 'downloadDataAsFile' function"
  "File Management: added the 'FILE' helper object"
  "File Management: added the 'loadBytes' function"
  "File Management: added the 'loadText' function"
  "File Management: added the 'saveCanvasScreenshot' function"
  "Physics: indroduced the 'TransformPoint' class"
  "Rednering: Added the 'renderAnimationGraph' function"
  "Rendering: other undocumented changes"
  "Library wide: undocumented changes too many to remeber"
""

"Notes >=>"
  "A lot more changes and bug fixes occured that are not listed here due to them not being important, or the more likely scenario, me forgetting to list them here "
  "Caldro is currently under a standardization stage, the target standard version number is 1.0.0"
  "Caldro documentation is still inexsistent"
""

">> End of Version Info"


"use strict"; // DOM_Manipulation

document.body.style.margin = "0px";
document.body.style.padding = "0px";
document.body.style.userSelect = "none";


function setPageTitle(title){
	document.title = title;
}

function get(id) {
	return document.getElementById(id);
};


function fullscreen(id = "Caldro_Canvas") {
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

function createCanvas(addToDOM = false, id = undefined, width = window.innerWidth, height = window.innerHeight) {
	let canv = document.createElement('canvas');
	canv.context = canv.getContext("2d")
	if (id) {
		canv.id = id;
	}
	canv.width = width;
	canv.height = height;
	if (addToDOM) {
		let container = document.createElement("div")
		container.id = "Main_Canvas_Container";
		container.style.width = width;
		container.style.height = height;
		// console.log(container)
		container.appendChild(canv)
		document.body.appendChild(container);
	}
	return canv;
};

function createMainCanvas(addToDOM = false, id = undefined, width = window.innerWidth, height = window.innerHeight) {
	let canv = document.createElement('canvas');
	canv.context = canv.getContext("2d")
	if (id) {
		canv.id = id;
	}
	if (addToDOM) {
		let container = document.createElement("div")
		container.id = "Main_Canvas_Container";
		container.style.width = width;
		container.style.height = height;
		// console.log(container)
		container.appendChild(canv)
		document.body.appendChild(container);
	}
	return canv;
};


"use strict" // File_Management

const FILE = {
    TYPES: {
        TEXT: "text/plain",
        CSV: "text/csv",
        JSON: "text/json",
        JAVASCRIPT: "text/javascript",
        BINARY: "application/octet-stream",
    }
}

function downloadDataAsFile(data, fileName, fileType = FILE.TYPES.TEXT, fileExtension = null){
    let link = document.createElement("a")
    link.setAttribute("target", "_blank")
    let file;
    let href;
    if(Blob !== undefined){
        let blob = new Blob([data], {
            type: fileType
        })
        href = URL.createObjectURL(blob);
    } else {
        href = "data:"+fileType+"," + encodeURIComponent(file)
    }
    link.setAttribute("href", href)
    if(fileExtension){
        fileName+="."+fileExtension;
    }
    link.setAttribute("download", fileName);
    link.style.display = "none" ;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(file);
}

function copyBuffer(buffer, type = "UInt8Array"){
    let ARRAY_BUFFER_TYPES = [
        "Uint0Array",
        "Uint0ArrayClampedArray",
        "Uint16Array",
        "Uint32Array",
        "Uint64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "BigUint64Array",
        "Float32Array",
        "Float64Array",
        "DataView",
    ]
    if(!ARRAY_BUFFER_TYPES.includes(type)){
        console.error("Buffer type passed to 'copyBuffer' is not a valid type of TypedArray. Valid types include", ARRAY_BUFFER_TYPES)
    }
    return (new Function("return new "+type+"(buffer).buffer"))();
}

function loadBytes(fileURL, callback, async = true){
    let data;
    let xReq = new XMLHttpRequest();
    xReq.open('GET', fileURL, async);
    xReq.responseType = "arraybuffer";
    xReq.onload = function(event){
        let arrayBuffer = xReq.response;
        if(arrayBuffer){
            data = new Uint8Array(arrayBuffer);
            if(callback){
                callback(data)
            }
        }
    }
    xReq.send(null);
    return data;
}

function loadText(fileURL, callback, async = true){
    let data;
    let xReq = new XMLHttpRequest();
    xReq.open('GET', fileURL, async);
    xReq.responseType = "text";
    xReq.onload = function(event){
        data = xReq.responseText
        if(data){
            if(callback){
                callback(data)
            }
        }
    }
    xReq.send(null);
    return data;
}

function loadScript(url){
    let scriptFile = document.createElement("script");
    scriptFile.src = url;
    scriptFile.defer = true;
    document.body.appendChild(scriptFile);
}

function saveCanvasScreenshot(canvas, name){
    canvas.toBlob(
        (data)=>{
            downloadDataAsFile(data, name)
        }
    )
}


"use strict"; // Math
function degToRad(degree) {
	return degree * (Math.PI / 180);
}

function radToDeg(radians) {
	return (radians * 180) / Math.PI;
}

function tan(angle) {
	if (angle == 180) {
		return 0;
	} else if (angle == 360) {
		return 0;
	} else if (angle == 90 || angle == 270) {
		return "Invalid Input :(";
	} else {
		return (Math.tan(degToRad(angle)))
	}
}

function tanInverse(ratio) {
	return radToDeg(Math.atan((ratio)))
}

function sine(angle) {
	return (Math.sin(degToRad(angle)))
}

function cosine(angle) {
	return (Math.cos(degToRad(angle)))
}


function slope(point1, point2) {
	return (point2.y - point1.y) / (point2.x - point1.x)
}

function toDecimalPlace(num, decimalPlace = 0) {
	return parseFloat(num.toFixed(decimalPlace))
}

function scaleTo(number = 5, numberMin = 0, numberMax = 10, scaleMin = 0, scaleMax = 1) {
	let percentage = (number - numberMin) / (numberMax - numberMin)
	return interpolate(percentage, scaleMin, scaleMax)
}

function approach(number = 10, destination = 0, speed = 0.2, deltatime = Caldro.time.deltatime, margin = 0.001) {
	let arrived = false
	if (Math.abs(destination - number) < margin) {
		arrived = true;
		number = destination
	} else {
		speed = 1 / (1 + (deltatime * speed))
		number = destination + (number - destination) * speed;
	}
	return { value: number, arrived: arrived };
}

function interpolate(decimal_percentage = 0.5, minNumber = 0, maxNumber = 1) {
	return minNumber + (maxNumber - minNumber) * (decimal_percentage);
}

function clip(value, lowerLimit = 0, higherLimit = 1) {
	return Math.max(lowerLimit, Math.min(value, higherLimit))
}




"use strict"; // Physics_Utilities

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
	} else if (type == 'AABB') {
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

function castRay(originX = 0, originY = 0, angle = 0, length = 1){
	angle = degToRad(angle) - Math.PI/2;
	return {
		x: originX+(length*Math.cos(angle)),
		y: originY+(length*Math.sin(angle))
	}
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
    return radToDeg(Math.atan2(point2.y - referencePoint.y , point2.x, - referencePoint.x) - Math.PI/2);
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

function applyFriction(who, friction, deltatime) {
	who.x *= 1 / (1 + (deltatime * friction.x));
	who.y *= 1 / (1 + (deltatime * friction.y));
	// who.z *= 1 / (1 + (deltatime * friction.z));
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



// Rendeing Aids
function renderRectBody(body, fill = "white"){
	let color = body.color
	if(fill){
		color = fill;
	}
	Rect(body.x, body.y, body.width, body.height, color, body.angle)
}


"use strict"; // Physics

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


class dynamicPoint2D {
	constructor(x = 0, y = 0, data) {
		this.x = x;
		this.y = y;
		this.oldX = x;
		this.oldY = y;
		this.tag = "dynamicPoint2D";
		this.ID = generateRandomID();
		this.data = data
	}
	updatePosition(x = 0, y = 0) {
		this.oldX = this.x;
		this.oldY = this.y;
		this.x = x;
		this.y = y;
		this.callback();
	}
	callback() { };
}

class Collider2D extends dynamicPoint2D {
	constructor() {
		super();
		this.isTrigger = false;
		this.triggerd = false;
		this.drawing = NULLFUNCTION
		this.resolvable = true
	}
	triggeringStart() { };
	effect() { };
	triggerigEnd() { };
}

//Define Bodies
class boxCollider2D extends Collider2D {
	constructor(x = 0, y = 0, width = 0.5, height = 0.5) {
		super()
		this.x = this.oldX = x;
		this.y = this.oldY = y;
		this.width = width;
		this.height = height;
		this.static = false;
		this.colliding = false;
		this.collidable = true
		this.attachedBody = null;
		this.tag = "";
	}
	setBody(body = null) {
		this.attachedBody = body;
	}
}

class circleCollider2D {
	constructor(x = 0, y = 0, radius = 0.5) {
		this.x = x;
		this.y = y;
		this.radius = raidus;
		this.static = false;
		this.colliding = false;
		this.resolvable = true
	}
}

class polygonCollider2D {
	constructor(x, y, size = 1, model = new Array()) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.static = false
		this.colliding = false;
		this.resolvable = true
		this.points = new Array();
		for (let point of model) {
			let resizedPoint = new Point2D();
			resizedPoint.x = this.x + point.x * this.size;
			resizedPoint.y = this.y + point.y * this.size;
			this.points.push(resizedPoint)
		}
	}
}

// [SID]
class colliderResolutionEngine2D {
	constructor() {
		this.bodies = new Array();
		this.renderingStyle = "stroke";
		this.colliderRenderingLineWidth = 10
	}
	addBody(body) {
		this.bodies.push(body)
	}
	addBodies(arrayOfBodies = new Array()) {
		for (let body of arrayOfBodies) {
			this.bodies.push(body);
		}
	}
	deleteAllBodies(){
		this.bodies.length = 0
	}
	deleteBodiesTagged(tag = null){
		if(!tag) return;
		for(let i = this.bodies.length-1; i>=0; --i){
			if(this.bodies[i].tag == tag){
				this.bodies.splice(i, 1)
			}
		}
	}

	updateColliders() {
		for (let collider of this.bodies) {
			if (collider.attachedBody) {
				collider.x = collider.attachedBody.x
				collider.y = collider.attachedBody.y
				collider.width = collider.attachedBody.width
				collider.height = collider.attachedBody.height
				collider.angle = collider.attachedBody.angle
			}
		}
	}

	resolveCollidersWithCollider(body) {
		for (let b1 = this.bodies.length - 1; b1 >= 0; --b1) {
			let body1 = this.bodies[b1]
			if (body1.toDelete) {
				this.bodies.splice(b1, 1);
				continue;
			}
			let body2 = body
			if (body1 == body) continue;
			body1.colliding = false 
			if (!(body1.collidable && body2.collidable)) {
				body1.callback()
				continue;
			} 
			let colliding = false;
			if (getConstructorName(body1) == "boxCollider2D") {
				if (getConstructorName(body2) == "boxCollider2D") {
					if (collided(body1, body2)) {
						colliding = true;
						if (body1.isTrigger) {
							body1.effect(body2)
						}
						if (body2.isTrigger) {
							body2.effect(body1);
						}
						body1.colliding = colliding || body1.colliding;
						body2.colliding = colliding || body2.colliding;
						if ((body1.resolvable && body2.resolvable)) {
							this.resoolveBox_Box(body1, body2)
						}
					}
				}
			}



			body1.callback()
		}
	}
	resolveColliders() {
		for (let b1 = this.bodies.length - 1; b1 >= 0; --b1) {
			let body1 = this.bodies[b1]
			if (body1.toDelete) {
				this.bodies.splice(b1, 1);
				continue;
			}
			body1.colliding = false 
			for (let b2 = this.bodies.length - 1; b2 >= 0; --b2) {
				let body2 = this.bodies[b2]
				if (body1 == body2) continue;
				
				let colliding = false;
				if (!(body1.collidable && body2.collidable)) {
					body1.callback(body2)
					continue;
				} 
				// box and box
				if (getConstructorName(body1) == "boxCollider2D") {
					if (getConstructorName(body2) == "boxCollider2D") {
						if (collided(body1, body2)) {
							colliding = true;
							if (body1.isTrigger) {
								body1.effect(body2)
							}
							if (body2.isTrigger) {
								body2.effect(body1);
							}
							body1.colliding = colliding || body1.colliding;
							body2.colliding = colliding || body2.colliding;
							if ((body1.resolvable && body2.resolvable)) {
								this.resoolveBox_Box(body1, body2)
							}
						}
					}
				}


			}

			body1.callback()
		}
	}

	resoolveBox_Box(box1, box2) {
		if (box1.static && box2.static) return;

		if (!box1.static && box2.static) {
			let penetrationX = (box1.width + box2.width) / 2 - Math.abs(box2.x - box1.x)
			let penetrationY = (box1.height + box2.height) / 2 - Math.abs(box2.y - box1.y)

			if (penetrationX < penetrationY) {
				// resolving X axis
				if (box1.x < box2.x) {
					box1.x = box2.x - box2.width / 2 - box1.width / 2
				} else if (box1.x > box2.x) {
					box1.x = box2.x + box2.width / 2 + box1.width / 2
				}

			} else {
				// resolving Y axis
				if (box1.y < box2.y) {
					box1.y = box2.y - box2.height / 2 - box1.height / 2
				} else if (box1.y > box2.y) {
					box1.y = box2.y + box2.height / 2 + box1.height / 2
				}
			}


		} else if (box1.static && !box2.static) {
			let penetrationX = (box2.width + box1.width) / 2 - Math.abs(box1.x - box2.x)
			let penetrationY = (box2.height + box1.height) / 2 - Math.abs(box1.y - box2.y)

			if (penetrationX < penetrationY) {
				// resolving X axis
				if (box2.x < box1.x) {
					box2.x = box1.x - box1.width / 2 - box2.width / 2
				} else if (box2.x > box1.x) {
					box2.x = box1.x + box1.width / 2 + box2.width / 2
				}

			} else {
				// resolving Y axis
				if (box2.y < box1.y) {
					box2.y = box1.y - box1.height / 2 - box2.height / 2
				} else if (box2.y > box1.y) {
					box2.y = box1.y + box1.height / 2 + box2.height / 2
				}
			}


		} else if (!box1.static && !box2.static) { // both are dynamic
			let penetrationX = (box2.width + box1.width) / 2 - Math.abs(box2.x - box1.x);
			let penetrationY = (box2.height + box1.height) / 2 - Math.abs(box2.y - box1.y);

			let box1mass = box1.width * box1.height;
			let box2mass = box2.width * box2.height;
			let totalMaxx = box1mass + box2mass;
			let box1InvMaxx = box1mass / totalMaxx
			let box2InvMaxx = box2mass / totalMaxx

			if (penetrationX < penetrationY) {
				if (box1.x <= box2.x) {
					box1.x -= penetrationX * box1InvMaxx
					box2.x += penetrationX * box2InvMaxx
				} else {
					box1.x += penetrationX * box1InvMaxx
					box2.x -= penetrationX * box2InvMaxx
				}
			} else {
				if (box1.y <= box2.y) {
					box1.y -= penetrationY * box1InvMaxx
					box2.y += penetrationY * box2InvMaxx
				} else {
					box1.y += penetrationY * box1InvMaxx
					box2.y -= penetrationY * box2InvMaxx
				}
			}
		}


	}
	renderColliders() {
		for (let body of this.bodies) {
			if (getConstructorName(body) == "boxCollider2D") {
				let color = "orange"
				let bcolor = "orange"
				if (body.colliding) {
					color = "red"
					bcolor = "red"
				}
				if(body.static){
					bcolor = "black"
				}
				if(this.renderingStyle.includes("fill")){
					Rect(body.x, body.y, body.width, body.height, color)
				}
				if(this.renderingStyle.includes("stroke")){
					let stlw = this.colliderRenderingLineWidth/2
					stRect(body.x, body.y, body.width-stlw, body.height-stlw, bcolor, stlw)
					line(body.x - body.width / 2, body.y - body.height / 2, body.x + body.width / 2, body.y + body.height / 2, color, this.colliderRenderingLineWidth/2)
				}
			}
		}
	}
	renderColliderDrawings() {
		for (let body of this.bodies) {
			if (body.drawing != NULLFUNCTION) {
				body.drawing();
			}
		}
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
			getCenterPoint() {
				let totalX = 0;
				let totalY = 0;
				for (let point of this.points) {
					totalX += point.x;
					totalY += point.y;
				}
				return new Point2D(totalX / this.points.length, totalY / this.points.length);
			}
		}


	}

	addConstraint(constraint) {
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
	renderBodies(structure = this) {
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




//Error in finding this file...


"use strict"; // Utility_Constants

const CALDGRAY = "rgba(20, 20, 20, 1)"
const CALDGREY = CALDGRAY;
const CALDRED = "rgba(80, 10, 20, 1)"
const CALDBLUE = "rgba(20, 20, 40, 1)"
const CALDGREEN = "rgba(20, 60, 20, 1)"

const ORIGIN = new Point2D(0, 0);
const INFINITY = Infinity;
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
const NUMBERS = "0123456789".split('')

const NULLFUNCTION = function(){};

const ANIMATION = {

    REPEAT_TYPES: {
        PING_PONG_ONCE: 1,
        PING_PONG: 2,
        RESTART: 3,
    },
    INTERPOLATIONS: {
        LINEAR: 1,
        EASE_IN: 2,
        EASE_OUT: 3,
        EASE_IN_AND_OUT: 4,
    }

}


"use strict"; // Utility_Functions

const doings = {
	ids: [],
	tasks: [],
};
function getTask(id) {
	return doings.tasks[id];
}
function doTask(id, what = function () { }, onlyIf = true, maxCallCount = 1, frequency = null) {
	if (onlyIf) {
		let newTask = doings.ids.includes(id);
		let condition = !newTask;
		if (condition) {
			what();
			doings.ids.push(id);
			doings.tasks[id] = {
				calls: 1,
				performed: 1,
				frequency: frequency,
				id: id,
				maxCallCount: maxCallCount,
				passedTime: 0,
				timeOFLastCall: 0,
			};
		} else {
			++doings.tasks[id].calls;
			let task = doings.tasks[id];
			if (task.performed < task.maxCallCount) {
				let time = window.performance.now();
				let task = doings.tasks[id];
				if (task.frequency) {
					if ((time - task.timeOFLastCall) < task.frequency) {
						return;
					}
				}
				what();
				task.timeOFLastCall = time
				++task.performed;
			};
		}
		return condition;
	}
	return onlyIf;
}

function clearDoTask(id = 'Vachila64') {
	for (let i in doings.ids) {
		if (doings.ids[i] == id) {
			doings.ids.splice(i, 1)
			doings.tasks[id] == undefined;
			return true;
		}
	}
	return false;
}

function clearAllTasks() {
	doings.ids.length = doings.tasks.length = 0;
}

function getDoTask(id) {
	return doings.tasks[id];
}




let timedTasks = new Array();
function timeoutTask(task, timeout, oneshotTask = true) {
	let Task = {
		task: task,
		timeout: timeout / 1000,
		time: 0,
		isOneShot: oneshotTask
	}
	timedTasks.push(Task)
	return Task;
}
function deleteTimeoutTask(task){
	timedTasks = timedTasks.filter((Task) => {
		return task != Task
	})
}
function updateTimedTasks() {
	for (let task of timedTasks) {
		task.time += Caldro.time.deltatime;
		if (task.time > task.timeout) {
			task.task();
			if(task.isOneShot){
				task.toDelete = true;
			}
		}
	}
	timedTasks = timedTasks.filter((task) => {
		return !task.toDelete
	})
}




let secMap = {
	second: 1
}
secMap["minute"] = 60
secMap["hour"] = 60 * secMap.minute;
secMap["day"] = 24 * secMap.hour;
secMap["week"] = 7 * secMap.day;
secMap["month"] = 30 * secMap.week;
secMap["year"] = 12 * secMap.month;

var timeMap = [
	{
		name: "second",
		valueInSeconds: 1
	},
	{
		name: "minute",
		valueInSeconds: secMap["minute"]
	},
	{
		name: "hour",
		valueInSeconds: secMap['hour']
	},
	{
		name: "day",
		valueInSeconds: secMap['day']
	},
	{
		name: "week",
		valueInSeconds: secMap['week']
	},
	{
		name: "month",
		valueInSeconds: secMap['month']
	},
	{
		name: "year",
		valueInSeconds: secMap['year']
	},
]


function secondsToTime(amountOfSeconds, showAll = false) {
	let secondsLeft = amountOfSeconds;
	let timeObject = {seconds:0}
	for (let i = timeMap.length - 1; i >= 0; --i) {
		let time_div = Math.floor(secondsLeft / timeMap[i].valueInSeconds)
		if (time_div == 0 && showAll == false) continue;
		secondsLeft -= time_div * timeMap[i].valueInSeconds;
		timeObject[timeMap[i].name + "s"] = time_div
	}
	return timeObject
}

function timeToSeconds(seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0) {
	let totalSeconds = 0;
	totalSeconds += seconds
	totalSeconds += minutes * secMap["minute"]
	totalSeconds += hours * secMap["hour"]
	totalSeconds += days * secMap["day"]
	totalSeconds += weeks * secMap["week"]
	totalSeconds += months * secMap["month"]
	totalSeconds += years * secMap["year"]
	return totalSeconds;
}

function counter(min = 0, max = 10, elapsedTime = Caldro.time.elapsedTime){
	let range = max - min;
	if(range <= 0) return min
	let time = elapsedTime - Math.floor(elapsedTime/range)*range
	time = toDecimalPlace(time, 2)
	return min + time
}







function generateRandomId(model = "XXXXXXXX-XXXX-4XXX-"+['8','9','a','b'][Math.round(Math.random()*3)]+"XXX-XXXXXXXXXXXX", combinations = "0/1/2/3/4/5/6/7/8/9/a/b/c/d/e/f") {
	let id = model;
	let hex = combinations.split('/')
	id = id.replace(/X/g, () => {
		return hex[Math.round(Math.random()*(hex.length-1))]
	})
	return id
}

/**
 * Returns A 32 bit UUID string.
 */
function psuedoUUID() {
	let id = "XXXXXXXX-XXXX-4XXX-"+['8','9','a','b'][Math.round(Math.random()*3)]+"XXX-XXXXXXXXXXXX";
	let hex = "0123456789abcdef".split('')
	id = id.replace(/X/g, () => {
		return hex[Math.round(Math.random()*(hex.length-1))]
	})
	return id
}

/**
 * 
 * @param {*Number} percentageSuccess A number between 0 - 100
 * @returns {*boolean} Either true or false depending on the percentage Sussess
 */
function chance(percentageSuccess = 50) {
	return (Math.random()) <= percentageSuccess * 0.01
}

function greater(valuesToCompare){
	let max = -INFINITY
	for (let i = 0; i < arguments.length; ++i) {
		max = Math.max(max, arguments[i])
	}
	return max
}

function lesser(valuesToCompare){
	let min = INFINITY
	for (let i = 0; i < arguments.length; ++i) {
		min = Math.min(min, arguments[i])
	}
	return min
}

let heavy;
function startHeavyTask(magnitude = 100){
	clearTimeout(heavy)
	heavy = setInterval(()=>{
		for(let i = 0; i < magnitude; ++i){
			let num = 0;
			for(let i = 0; i < 10000; ++i){
				num += Math.sqrt(Math.sin(Math.cos(Math.tan(Math.sqrt(Math.random())))))
			}
		}
	}, 30/1000)
}
function stopHeavyTask(){
	clearTimeout(heavy)
}



function getConstructorName(object) {
	return object.__proto__.constructor.name;
}

function checkNaN(value = 0, setToIfNaN = true, logMessage = null) {
	if (typeof value != "number") {
		if (logMessage != null) {
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


function timeTask(task = NULLFUNCTION) {
	if (typeof task != "function") return false;
	let startTime = performance.now();
	task();
	return performance.now() - startTime;
}


// primitve utilities
function typeMatch(primitive, arrayOfTypes) {
	return arrayOfTypes.includes(typeof primitive)
}

function matchType(primitiveType, arrayOfPrimitives) {
	for (let primitive of arrayOfPrimitives) {
		if (typeof primitive == primitiveType) {
			return true;
		}
	}
	return false;
}

function randomNumber(minimumNumber = 0, maximumNumber = 1, float = true, exacc = false) {
	let number = minimumNumber + (Math.random() * (maximumNumber - minimumNumber))
	if (!float) number = Math.round(number);
	if (exacc) return choose([minimumNumber, maximumNumber])
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

function withinRange(number = 0, mininmumNumber = 0, maximumNumber = 1) {
	if (number >= mininmumNumber && number <= maximumNumber) return true;
	return false;
}

function dist(ax, ay, bx, by) {
	return Math.sqrt(Math.abs(ax - bx) ** 2 + Math.abs(ay - by) ** 2)
}

function dist2D(a, b) {
	return Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2)
}

function place(who, where) {
	if (who != undefined && where != undefined) {
		who.x = where.x
		who.y = where.y
	} else {
		console.error("A variable passed to the function 'place' is udefinded\nWho:" + who + "\n" + "Where: " + where)
	}
}

function getRandomPointIn(x, y, width, height, precise = true) {
	return {
		x: x + randomNumber(-width / 2, width / 2, precise),
		y: y + randomNumber(-height / 2, height / 2, precise)
	}
}

function closest(who, array) {
	let closest = array[0]
	if (closest != undefined) {
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

function linspace(start, end, amount = 10) {
	let array = new Array();
	if (amount < 2) {
		return n === 1 ? [start] : [];
	}
	--amount;
	for (let i = amount; i >= 0; --i) {
		array[i] = (i * end + (amount - i) * start) / amount;
	}
	return array;
}




// Array Utilities
function arraySum(array) {
	let sum = 0;
	for (let i = 0; i < array.length; ++i) {
		sum += array[i]
	}
	return sum;
}

function arrayMax(array) {
	let max = -INFINITY
	for (let i = 0; i < array.length; ++i) {
		max = Math.max(max, array[i])
	}
	return max
}

function choose(array) {
	return array[randomNumber(0, array.length - 1, false)]
}



"use strict"; // LocalStorage

// [SID] [NF]
class localStorageDataCapsule{
	constructor(localStorageID = generateRandomId()){
		this.localStorageID = localStorageID
		this.data = new Array();
		this.save = this.saveToLocalStorage;
		this.load = this.loadFromLocalStorage;
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

	save(){
		localStorage.setItem(this.localStorageID, JSON.stringify(this.data))
	}
	load(){
		this.data = JSON.parse(localStorage.getItem(this.localStorageID))
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



"use strict"; // Vectors_and_Matricies

class Lvector2D {
    static zero = () => {
        return new Lvector2D(0, 0)
    }
    static copy = (vector) => {
        return new Lvector2D(vector.x, vector.y)
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    multiply(number) {
        this.x *= number;
        this.y *= number;
    }
    divide(number) {
        if (number) {
            this.x /= number;
            this.y /= number;
        }
        console.error("vector is being divided by an unsusual variable: " + number)
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    magnitude(){
        return this.length()
    }
    magnitudeSqr(){
        return (this.x ** 2 + this.y ** 2)
    }
    normalize(sourceVector = originVector) {
        let mag = dist2D(this, sourceVector);
        mag = mag == 0 ? 1 : mag;
        this.x /= mag;
        this.y /= mag;
    }
    copy(vector){
        this.x = vector.x;
        this.y = vector.y;
    }
}

class Lvector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class vector2D {
    static zero = new vector2D(0, 0)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    normalize(sourceVector = originVector) {
        let mag = dist2D(this, sourceVector);
        mag = mag == 0 ? 1 : mag;
        return new vector2D(this.x /= mag, this.y /= mag)
    }
    magnitude(sourceVector = originVector) {
        return dist2D(this, sourceVector)
    }
    subtract(vector = originVector) {
        return new vector2D(this.x - vector.x, this.y - vector.y)
    }
    add(vector = originVector) {
        return new vector2D(this.x + vector.x, this.y + vector.y)
    }
    multiply(number = 1) {
        return new vector2D(this.x *= number, this.y *= number)
    }
    divide(number = 1) {
        if (number) {
            return new vector2D(this.x /= number, this.y /= number)
        }
        console.error("vector is being divided by an unsusual variable: " + number)
    }
    normal() {
        return new vector2D(-this.y, this.x);
    }
    invert() {
        return new vector2D(-this.x, -this.y)
    }
    isSameAs(vector) {
        return (this.x == vector.x && this.y == vector.y)
    }
}


const vecMath = {
    normalize(vector, sourceVector = originVector) {
        let mag = this.distance(vector, sourceVector);
        mag = mag == 0 ? 1 : mag;
        return new Lvector2D(vector.x / mag, vector.y / mag)
    },
    lengthSquared(vector) {
        return (vector.x ** 2 + vector.y ** 2)
    },
    distanceSquared(vector1, vector2) {
        let dx = vector1.x - vector2.x
        let dy = vector1.y - vector2.y
        return ((dx ** 2) + (dy ** 2))
    },
    length(vector) {
        return Math.sqrt(vector.x ** 2 + vector.y ** 2)
    },
    distance(vector1, vector2) {
        let dx = vector1.x - vector2.x
        let dy = vector1.y - vector2.y
        return Math.sqrt((dx ** 2) + (dy ** 2))
    },
    normal(vector) {
        return new Lvector2D(-vector.y, vector.x);
    },
    invert(vector) {
        return new Lvector2D(-vector.x, -vector.y)
    },
    equal(vector1, vector2, marginOfError = 0) {
        if (!marginOfError) {
            return (vector1.x == vector2.x && vector1.y == vector2.y)
        }
        return vecMath.distanceSquared(vector1, vector2) < marginOfError ** 2;
    },

    add(vector1, vector2) {
        return new Lvector2D(vector1.x + vector2.x, vector1.y + vector2.y)
    },
    subtract(vector1, vector2) {
        return new Lvector2D(vector1.x - vector2.x, vector1.y - vector2.y)
    },
    multiply(vector, number) {
        return new Lvector2D(vector.x * number, vector.y * number)
    },
    divide(vector, number) {
        if (number) {
            return new Lvector2D(vector.x / number, vector.y / number)
        }
        console.error("vector is being divided by an unsusual variable: " + number)
    },

    transform(vector, transform) {
        return new Lvector2D(
            transform.cos * vector.x - transform.sin * vector.y + transform.positionX,
            transform.sin * vector.x + transform.cos * vector.y + transform.positionY
        )

        let rx = transform.cos * vector.x - transform.sin * vector.y
        let ry = transform.sin * vector.x + transform.cos * vector.y

        let tx = rx + transform.positionX
        let ty = ry + transform.positionY

        return new Lvector2D(tx, ty)

    },
    copy(vector) {
        return new Lvector2D(vector.x, vector.y);
    },
    map(vector, f) {
        return new Lvector2D(f(vector.x), f(vector.y));
    },
    dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    },
    croos(vector1, vector2) {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    },
}

const originVector = new vector2D(0, 0)

function array2D(rows = 2, columns = 2, initialValues = 0) {
    let arr2D = new Array();
    for (let r = 0; r < rows; ++r) {
        let Row = new Array();
        let value = initialValues
        for (let c = 0; c < columns; ++c) {
            if (typeof initialValues == "function") {
                value = initialValues(r, c)
            }
            Row.push(value)
        }
        arr2D.push(Row)
    }
    return arr2D;
}


class Matrix {
    static rowWise = 1;
    static columnWise = 2;
    constructor(rows, columns, initializer = 0) {
        this.rows = rows;
        this.columns = columns;
        this.data = new Array(this.rows);

        for (let i = 0; i < rows; ++i) {
            this.data[i] = new Array(columns);
            for (let j = 0; j < columns; ++j) {
                if (typeof initializer == "number") {
                    this.data[i][j] = initializer;
                } else if (typeof initializer == "function") {
                    this.data[i][j] = initializer(i, j);
                }
            }
        }
    }

    addRow(array) {
        if (array.length == this.columns) {
            this.data.push(array.splice(0, array.length))
            ++this.columns
        }
    }
    addColumn(array) {
        if (array.length == this.rows) {
            for (let i = 0; i < this.rows; ++i) {
                this.data[i].push(array[i])
            }
            ++this.rows;
        }
    }

    sum(direction = Matrix.rowWise) {
        if (direction == Matrix.rowWise) {
            let sumArray = new Array(this.columns)
            sumArray.fill(0)
            for (let i = 0; i < this.rows; ++i) {
                for (let j = 0; j < this.columns; ++j) {
                    sumArray[j] += this.data[i][j]
                }
            }
            return sumArray
        } else if (direction == Matrix.columnWise) {
            let sumArray = new Array(this.rows)
            sumArray.fill(0)
            for (let i = 0; i < this.rows; ++i) {
                for (let j = 0; j < this.columns; ++j) {
                    sumArray[i] += this.data[i][j]
                }
            }
            return sumArray
        }
    }

    copy() {
        let m = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.columns; ++j) {
                m.data[i][j] = this.data[i][j]
            }
        }
        return m;
    }

    static createFromArray(array, direction = Matrix.rowWise) {
        if (direction == Matrix.rowWise) {
            let mat = new Matrix(array.length, 1);
            for (let i = 0; i < array.length; ++i) {
                mat.data[i][0] = array[i];
            }
            // if it's a 2D array
            // let mat = new Matrix(array[0].length, array.length);
            // for (let i = 0; i < array.length; ++i) {
            // for (let j = 0; j < array[0].length; ++j) {
            // mat.data[i][j] = array[i]j];
            // }
            // }
            return mat;
        }
        if (direction == Matrix.columnWise) {
            let mat = new Matrix(1, array.length);
            mat.data[0] = array
            // if it's a 2D array
            // let mat = new Matrix(array.length, array[0].length);
            // for (let i = 0; i < array[0].length; ++i) {
            // mat.data[i] = array[i];
            // }
            return mat;
        }
    }

    toArray(direction = Matrix.rowWise) {
        let array = new Array();
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                if (direction == Matrix.rowWise) {
                    array.push(this.data[r][c])
                } else if (direction == Matrix.columnWise) {
                    array.push(this.data[c][r])
                }
            }
        }
        return array;
    }

    map(action) {
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                this.data[r][c] = action(this.data[r][c], r, c)
            }
        }
    }

    static map(matrix, action) {
        let result = new Matrix(matrix.rows, matrix.columns);
        for (let r = 0; r < result.rows; ++r) {
            for (let c = 0; c < result.columns; ++c) {
                result.data[r][c] = action(matrix.data[r][c], r, c)
            }
        }
        return result
    }

    print(text = null) {
        if (text) {
            console.log(text);
        }
        console.table(this.data);
    }

    randomize(min = 0, max = 1, isFloat = true) {
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                this.data[r][c] = randomNumber(min, max, isFloat)
            }
        }
    }

    transpose() {
        let result = new Matrix(this.columns, this.rows);
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                result.data[c][r] = this.data[r][c];
            }
        }
        this.data = result.data;
    }

    static transpose(matrix) {
        let result = new Matrix(matrix.columns, matrix.rows);
        for (let r = 0; r < matrix.rows; ++r) {
            for (let c = 0; c < matrix.columns; ++c) {
                result.data[c][r] = matrix.data[r][c];
            }
        }
        return result;
    }

    multiply(n) {
        if (n instanceof Matrix) {
            for (let r = 0; r < this.rows; ++r) {
                for (let c = 0; c < this.columns; ++c) {
                    this.data[r][c] *= n.data[r][c];
                }
            }
            return;
        }
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                this.data[r][c] *= n
            }
        }
    }

    static multiply(matA, matB) {
        if (matA.columns !== matB.rows) {
            console.error("Number of columns of A must match number of rows of B");
            return undefined;
        }

        let result = new Matrix(matA.rows, matB.columns)
        let a = matA.data;
        let b = matB.data;
        for (let r = 0; r < result.rows; ++r) {
            for (let c = 0; c < result.columns; ++c) {
                let sum = 0;
                for (let k = 0; k < matA.columns; ++k) {
                    sum += a[r][k] * b[k][c]
                }
                result.data[r][c] = sum;
            }
        }
        return result;
    }


    add(n) {
        if (n instanceof Matrix) {
            for (let r = 0; r < this.rows; ++r) {
                for (let c = 0; c < this.columns; ++c) {
                    this.data[r][c] += n.data[r][c];
                }
            }
            return;
        }
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.columns; ++c) {
                this.data[r][c] += n
            }
        }
    }

    static add(matA, matB) {
        let result = new Matrix(matA.rows, matA.columns)
        for (let r = 0; r < result.rows; ++r) {
            for (let c = 0; c < result.columns; ++c) {
                result.data[r][c] = matA.data[r][c] + matB.data[r][c];
            }
        }
        return result;
    }
    static subtract(matA, matB) {
        let result = new Matrix(matA.rows, matA.columns)
        for (let r = 0; r < result.rows; ++r) {
            for (let c = 0; c < result.columns; ++c) {
                result.data[r][c] = matA.data[r][c] - matB.data[r][c];
            }
        }
        return result;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let matrix = new Matrix(data.rows, data.columns);
        matrix.data = data.data;
        return matrix;
    }

    cellularAutomata(automata) {
        let newState = new Matrix(this.rows, this.columns, 0);
        for (let i = 0; i < newState.rows; ++i) {
            for (let j = 0; j < newState.columns; ++j) {
                let surroundingCells = this.getSurroundingCells(i, j, 1);
                newState.data[i][j] = automata(this.data[i][j], surroundingCells, i, j)
            }
        }
        this.data = newState.data
    }

    cellularAutomataM(automata) {
        let newState = new Matrix(this.rows, this.columns, 0);
        for (let i = 0; i < newState.rows; ++i) {
            for (let j = 0; j < newState.columns; ++j) {
                let surroundingCells = this.getSurroundingCellsMatrix(i, j, 1);
                newState.data[i][j] = automata(this.data[i][j], surroundingCells, i, j)
            }
        }
        this.data = newState.data
    }

    forSurroundingCells(row, column, span, action) {
        for (let i = row - span; i <= row + span; ++i) {
            for (let j = column - span; j <= column + span; ++j) {
                if (i == -1 || j == -1 || i > this.rows - 1 || j > this.columns - 1) continue;
                let data = this.data[i]
                if (data !== undefined) {
                    data = data[j]
                    if (!(i == row && j == column)) {
                        this.data[i][j] = action(this.data[i][j], i, j)
                    }
                }
            }
        }
    }

    getSurroundingCells(row, column, span = 1) {
        let cells = new Array()
        for (let i = row - span; i <= row + span; ++i) {
            for (let j = column - span; j <= column + span; ++j) {
                if (i <= -1 || j <= -1 || i > this.rows - 1 || j > this.columns - 1) continue;
                let data = this.data[i]
                if (data !== undefined) {
                    data = data[j]
                    if (data !== undefined) {
                        if (!(i == row && j == column)) {
                            cells.push(data)
                        }
                    }
                } else {
                    // console.log(i, j)
                }
            }
        }
        return cells;
    }

    getSurroundingCellsMatrix(row, column, span = 1) {
        let cells = new Matrix(span * 2 + 1, span * 2 + 1, 0)
        for (let i = row - span; i <= row + span; ++i) {
            for (let j = column - span; j <= column + span; ++j) {
                if (i <= -1 || j <= -1 || i > this.rows - 1 || j > this.columns - 1) continue;
                let data = this.data[i][j]
                let nRow = (span + i) - row
                let nCol = (span + j) - column
                if (!(i == row && j == column)) {
                    cells.data[nRow][nCol] = data
                }
            }
        }
        return cells;
    }
}

class Array2D {
    constructor(rows = 2, columns = 2, initialValues = 0) {
        this.data = new Array();
        this.rows = rows;
        this.columns = columns;
        for (let r = 0; r < rows; ++r) {
            let Row = new Array();
            let value = initialValues
            for (let c = 0; c < columns; ++c) {
                if (typeof initialValues == "function") {
                    value = initialValues()
                }
                Row.push(value)
            }
            this.data.push(Row)
        }
    }
    getRow(rowIndex) {
        return this.data[rowIndex]
    }
    getColumn(columnIndex) {
        let arr = new Array();
        for (let row = 0; row < this.data.length; ++row) {
            arr.push(this.data[row][columnIndex])
        }
        return arr;
    }
}

const matUtils = {
    transposeMatrix(matrix) {
        let newMat = new matrix2D(matrix.columns, matrix.rows)
        for (let r = 0; r < matrix.rows; ++r) {
            let row = matrix.mat[r];
            for (let c = 0; c < row.length; ++c) {
                let value = row[c];
                newMat.mat[c][r] = value
            }
        }
        return newMat;
    },
    transpose(matrix) {
        let rows = matrix.length;
        let cols = matrix[0].length;
        let newMat = array2D(cols, rows)
        for (let r = 0; r < rows; ++r) {
            let row = matrix[r];
            for (let c = 0; c < row.length; ++c) {
                let value = row[c];
                newMat[c][r] = value
            }
        }
        return newMat;
    },

    dotMatrix(matrixA, matrixB) {
        if (matrixA.rows != matrixB.columns) {
            console.error("Matrix error: can't perform matrix operation 'dotProduct' on matirces, shape error\nAmount of rows of matrix A and amount of columns of matrix B must be the same\nMatris A shapse (rows by columns): " + matUtils.getShape(matrixA.mat) + "\nMatix B shape (rows by columns): " + matUtils.getShape(matrixB.mat))
            return;
        }
        let mat = new matrix2D(matrixA.rows, matrixB.columns);
        for (let rowA = 0; rowA < matrixA.rows; ++rowA) {
            for (let colB = 0; colB < matrixB.columns; ++colB) {
                mat.mat[rowA][colB] = arrUtils.dot(matrixA.mat[rowA], matrixB.getColumn(colB))
            }
        }
        return mat
    },
    dot(matrixA, matrixB) {
        /*         if(matrixA.length != matrixB[0].length){
                    console.error("Matrix error: can't perform matrix operation 'dotProduct' on matirces, shape error\nAmount of rows of matrix A and amount of columns of matrix B must be the same\nMatris A shapse (rows by columns): "+matUtils.getShape(matrixA)+"\nMatix B shape (rows by columns): "+matUtils.getShape(matrixB))
                    return;    
                } */
        let rowsA = matrixA.length;
        let colsB = matrixB[0].length
        let mat = array2D(rowsA, colsB);
        for (let rowA = 0; rowA < rowsA; ++rowA) {
            for (let colB = 0; colB < colsB; ++colB) {
                mat[rowA][colB] = arrUtils.dot(matrixA[rowA], arrUtils.getArray2Dcols(matrixB, colB))
            }
        }
        return mat
    },
    add(matrixA, matrixB) {
        let arr = array2D(matrixB.length, matrixA[0].length);
        for (let r = 0; r < matrixA.length; ++r) {
            for (let c = 0; c < matrixB[0].length; ++c) {
                arr[r][c] = matrixA[r][c] + matrixB[c]
            }
        }
        return arr;
    },
    getShape(matrix) {
        return [matrix.length, matrix[0].length]
    }
    /*     shape(array){
        if(typeof array[0] == "number"){
            return array.length
        }
        return this.shape(array[0])
    } */
}

const arrUtils = {
    dot(array1, array2) {
        let ans = 0;
        for (let n = 0; n < array1.length; ++n) {
            ans += array1[n] * array2[n]
        }
        return ans;
    },
    sum(array, mapping) {
        let sum = 0;
        if (typeof mapping == "function") {
            for (let n = 0; n < array.length; ++n) {
                sum += mapping(array[n])
            }
            return sum;
        }
        for (let n = 0; n < array.length; ++n) {
            sum += array[n];
        }
        return sum;
    },
    add(array1, array2) {
        let ans = new Array()
        for (let n = 0; n < array1.length; ++n) {
            ans.push(array1[n] + array2[n])
        }
        return ans;
    },
    multiply(array1, array2) {
        let ans = new Array()
        for (let n = 0; n < array1.length; ++n) {
            ans.push(array1[n] * array2[n])
        }
        return ans;
    },
    mean(array) {
        return arraySum(array) / array.length;
    },
    min(array, specifier = null) {
        let min = INFINITY;
        for (let n = 0; n < array.length; ++n) {
            let value = array[n];
            if (specifier) {
                value = specifier(value)
            }
            min = Math.min(min, value)
        }
        return min
    },
    max(array, specifier = null) {
        let max = -INFINITY;
        for (let n = 0; n < array.length; ++n) {
            let value = array[n];
            if (specifier) {
                value = specifier(value)
            }
            max = Math.max(max, value)
        }
        return max
    },
    map(array, action) {
        let newArray = new Array(array.length)
        for (let n = 0; n < array.length; ++n) {
            newArray[n] = action(array[n]);
        }
        return newArray
    },
    copy(array) {
        return array.slice(0, array.length)
    },
    remove(array, element) {
        return array.filter((ArrayElement) => {
            return ArrayElement != element;
        })
    },
    getArray2Dcols(array, columnIndex) {
        let arr = new Array();
        for (let row = 0; row < array.length; ++row) {
            arr.push(array[row][columnIndex])
        }
        return arr;
    },
}


"use strict"; // Image_Canvas_Manager


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
	addDrawing(canvas, id = 'drawing', x = 0, y = 0, drawingWidth = -1, drawingHeight = -1, imageSmoothing = false) {
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
			this.context.imageSmoothingEnabled = false;
			if (this.positioning.x + drawingWidth > this.canvas.width) {
				this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.imageSmoothingEnabled = false
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.width = (this.positioning.x + drawingWidth + this.spacing)
				this.context.imageSmoothingEnabled = false
				this.context.drawImage(this.backupCanvas, 0, 0);
			}

			if (this.positioning.y + drawingHeight > this.canvas.height) {
				this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.imageSmoothingEnabled = false
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.height = (this.positioning.y + drawingHeight + this.spacing)
				this.context.imageSmoothingEnabled = false
				this.context.drawImage(this.backupCanvas, 0, 0);
			}

			this.context.imageSmoothingEnabled = imageSmoothing
			this.context.drawImage(canvas, x, y, drawingWidth, drawingHeight, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight)
			this.drawings.push(this.createDrawingObject(id, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight, copy));
			this.positioning.y += drawingHeight + this.spacing;
			this.drawingIds.push(id);
		};
	};
	setDrawing(canvas, id = 'drawing', x = 0, y = 0, drawingWidth = -1, drawingHeight = -1) {
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
			this.context.imageSmoothingEnabled = false;
			if (this.positioning.x + drawingWidth > this.canvas.width) {
				this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.imageSmoothingEnabled = false
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.width = (this.positioning.x + drawingWidth + this.spacing)
				this.context.imageSmoothingEnabled = false
				this.context.drawImage(this.backupCanvas, 0, 0);
			}

			if (this.positioning.y + drawingHeight > this.canvas.height) {
				this.backupCanvas.width = this.canvas.width;
				this.backupCanvas.height = this.canvas.height;
				this.backupContext.imageSmoothingEnabled = false
				this.backupContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.backupCanvas.width, this.backupCanvas.height);
				this.canvas.height = (this.positioning.y + drawingHeight + this.spacing)
				this.context.imageSmoothingEnabled = false
				this.context.drawImage(this.backupCanvas, 0, 0);
			}

			this.context.imageSmoothingEnabled = false
			this.context.drawImage(canvas, x, y, drawingWidth, drawingHeight, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight)
			this.drawings.push(this.createDrawingObject(id, this.positioning.x, this.positioning.y, drawingWidth, drawingHeight, copy));
			this.positioning.y += drawingHeight + this.spacing;
			this.drawingIds.push(id);
		} else {
			let drawing;
			let drawingNotFound = true;
			this.drawings.find(function (Drawing) {
				let sameDrawing = Drawing.id == id;
				if (sameDrawing) {
					drawing = Drawing;
					drawingNotFound = false;
				}
				return sameDrawing;
			});
			if (drawingNotFound) {
				console.error("Drawing not found, No drawing with and Id of '" + id + "' was found")
			}
			this.context.drawImage(canvas, x, y, drawingWidth, drawingHeight, drawing.x, drawing.y, drawing.width, drawing.height)
			drawing.width = drawingWidth
			drawing.height = drawingHeight	
		};
	};
	draw(context, drawingId = 'Vachila64', x = 0, y = 0, width = null, height = null, centralizeImage = false, angle = 0) {
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
			if (width == null) {
				width = drawing.width
			}
			if (height == null) {
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



// rendering classes
class imageHandler {
	constructor() {
		this.images = new Array();
		this.addImages = 0;
		this.loadedImages = 0;
		this.loaded = false
		this.fileNamePrefix = ""
	}
	createImageObject(image) {
		return image;
	}
	getImage(imageID){
		return this.images[imageID];
	}
	addImage(imageID, src, ImageWidth = 64, ImageHeight = 64, onload = null) {
		let img = new Image(ImageWidth, ImageHeight)
		let handler = this;
		img.src = this.fileNamePrefix + src;
		img.hasLoaded = false;
		img.onload =  ()=> {
			if(onload) onload(img);
			img.hasLoaded = true
			handler.loadedImages++
			if(handler.loadedImages == handler.addImages){
				handler.loaded = true
				handler.onload()
			}
		}
		this.images[imageID] = handler.createImageObject(img)
		this.addImages++
	}
	draw(imageID, x = 0, y = 0, width = null, height = null, centralized = false, angle = 0) {
		let img = this.images[imageID];
		if (!img) {
			console.error(`Image HandlerError: No image with an id of '${imageID}' was found`)
			// return;
		}
		if (!img.hasLoaded) return;
		if (!width) {
			width = img.width
		}
		if (!height) {
			height = img.height
		}
		let context = Caldro.renderer.context;
		if (centralized) {
			context.save();
			context.translate(x, y);
			context.rotate(degToRad(angle));
			context.drawImage(img, -width / 2, -height / 2, width, height)
			context.restore();
			return;
		}
		context.imageSmoothingEnabled = false;
		context.drawImage(img, x, y, width, height)
	}
	onload(){};
}

class spriteSheetManager {
	constructor(spritesheet, spriteSheetWidth = 1280, spriteSheetHeight = 1280) {
		if (spritesheet) {
			this.initialize(spritesheet, spriteSheetWidth, spriteSheetHeight)
		}
		this.spriteSheet;
		this.initialized = false;
		this.sprites = new Array()
	}
	initialize(spritesheet, spriteSheetWidth, spriteSheetHeight) {
		if(this.initialized) return;
		if (typeof spritesheet == "string") {
			this.spriteSheet = new Image(spriteSheetWidth, spriteSheetHeight);
			this.spriteSheet.src = spritesheet;
			let SPmanager = this;
			this.spriteSheet.onload = function () {
				SPmanager.initialized = true;
				SPmanager.onInit()
			}
		} else if(getConstructorName(spritesheet) == 'HTMLImageElement'){
			this.spritesheet = spritesheet;
			this.onInit()
		} else {
			console.error(`${getConstructorName(this)} error: Spritesheet passed is neither an image src or a HTMLImageElement`)
		}
	}
	cutSubImage(spriteID, x, y, width, height) {
		if (x + width > this.spriteSheet.width || y + height > this.spriteSheet.height) {
			console.error("SpriteSheet Error: Selected area for subImage '" + spriteID + "' is not within the bounds of the spritesheet :(")
			return;
		}
		let spriteInfo = {
			x: x,
			y: y,
			width: width,
			height: height,
		}
		this.sprites[spriteID] = spriteInfo;
	}
	draw(spriteID, x, y, width = null, height = null, centralized = false, angle = 0, flippedX = false, flippedY = false) {
		if (!this.initialized) return;
		let subImage = this.sprites[spriteID];
		if (!subImage) {
			console.error("SpriteSheet Error: No subImage with an ID of '" + spriteID + "' was cut for the spriteSheetManager")
			return false;
		}
		drawImagePortion(this.spriteSheet, subImage.x, subImage.y, subImage.width, subImage.height, x, y, width, height, centralized, angle, flippedX, flippedY)
		return true
	}
	onInit() { }
}

var CaldroSSM = new spriteSheetManager();
var CaldroCIM = new canvasImageManager();
var CaldroIH = new imageHandler();



function drawImage(img, x, y, width, height, centralized = false, angle = 0, flippedX = false, flippedY = false) {
	let context = Caldro.renderer.context;
	if (!centralized) {
		context.save();
		context.rotate(degToRad(angle));
		context.scale(1 + (-2 * flippedX), 1 + (-2 * flippedY))
		context.drawImage(img, x, y, width, height)
		context.restore();
	} else {
		context.save();
		context.translate(x, y);
		context.rotate(degToRad(angle));
		context.scale(1 + (-2 * flippedX), 1 + (-2 * flippedY))
		context.drawImage(img, -width / 2, -height / 2, width, height)
		context.restore();
	}
}

function drawImagePortion(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height, centralized = false, angle = 0, flippedX = false, flippedY = false) {
	let context = Caldro.renderer.context;
	if (!centralized) {
		context.save();
		context.rotate(degToRad(angle));
		context.scale(1 + (-2 * flippedX), 1 + (-2 * flippedY))
		context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
		context.restore();
	} else {
		context.save();
		context.translate(x, y);
		context.rotate(degToRad(angle));
		context.scale(1 + (-2 * flippedX), 1 + (-2 * flippedY))
		context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
		context.restore();
	}
}


"use strict"; // Rendering

"use strict"; // Rendering

var c = createMainCanvas(true, "Caldro_Canvas");
var cc = c.getContext("2d")
c.style.position = 'fixed';
c.onresize = NULLFUNCTION;

function getCanvasDimensions(canvas) {
	return {
		w: canvas.width,
		h: canvas.height,
		vw: canvas.width / 100,
		vh: canvas.height / 100,
		hw: canvas.width / 2,
		hh: canvas.height / 2,
		xc: canvas.width / 2,
		yc: canvas.height / 2,
		min: Math.min(canvas.width, canvas.height),
		max: Math.max(canvas.width, canvas.height),
		vmin: Math.min(canvas.width, canvas.height) / 100,
		vmax: Math.max(canvas.width, canvas.height) / 100,
	}
}

function setImageSmoothing(context = Caldro.renderer.context, state = false) {
	context.imageSmoothingEnabled = state
}

function adjustCanvas(canvas = c, width = window.innerWidth, height = window.innerHeight, aspectRatio = Caldro.display.aspectRatio) {
	canvas.formerWidth = canvas.width;
	canvas.formerHeight = canvas.height;

	if (aspectRatio) {
		let cw, ch;
		c.style.padding = "0px"
		{
			if (width > height) { // landscape
				ch = height;
				cw = (height * aspectRatio[0]) / aspectRatio[1]
				c.style.paddingLeft = `${(width - cw) / 2}px`
			} else { // potraint
				cw = width;
				ch = (width * aspectRatio[1]) / aspectRatio[0]
				c.style.paddingTop = `${(height - ch) / 2}px`
			}
		}
		width = cw
		height = ch
	}

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
	Caldro.rendering.context.lineCap = "round"
	Caldro.rendering.context.lineJoin = "round"
};

function adjustCanvasToRatio(w = 1, h = 1) {

}

let renderingInfo = {
	fill: null
}

function saveRenderingContext(context = Caldro.rendering.context) {
	context.save();
}

function restoreRenderingContext(context = Caldro.rendering.context) {
	context.restore();
}

function clear(x = 0, y = 0, w = c.width, h = c.height) {
	Caldro.rendering.context.clearRect(x, y, w, h)
}

function fillColor(color = "skyblue", context = Caldro.rendering.context) {
	if (context.fillStyle != color) {
		context.fillStyle = parseColor(color)
		// renderingInfo.fill = context.fillStyle;
	}
}

function hsl(hue, saturation = 100, lightness = 60) {
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function parseColor(color) {
	if (!color) return
	if (typeof color == "string") {
		return color
	} else if (getConstructorName(color) == "colorObject") {
		return colorObjectToString(color)
	}
	return color;
}

function strokeColor(color = "skyblue", context = Caldro.rendering.context) {
	if (context.strokeStyle != color) {
		context.strokeStyle = parseColor(color)
	}
}

function rect(x = 0, y = 0, w = c.width, h = c.height, color = CALDGRAY) {
	fillColor(color)
	Caldro.rendering.context.fillRect(x, y, w, h);
	// rounding down is impractical when things are scaled down lover than 0.5
	// Caldro.rendering.context.fillRect(x, y, Math.round(w), Math.round(h));
}

function strect(x, y, w, h, color, lineWidth) {
	strokeColor(color);
	Caldro.rendering.context.lineWidth = lineWidth
	Caldro.rendering.context.strokeRect(x, y, w, h);
}

function clrect(x, y, w, h) {
	Caldro.rendering.context.rect(x, y, w, h);
	Caldro.rendering.context.clip();
}


function chord(x, y, r, theta, angle, fill) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, -Math.PI / 2 + degToRad(angle - theta / 2), -Math.PI / 2 + degToRad(angle + theta / 2));
	Caldro.rendering.context.closePath();
	fillColor(fill)
	Caldro.rendering.context.fill();
}

function sector(x, y, r, theta, angle, fill, lw) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(x, y);
	Caldro.rendering.context.arc(x, y, r, -Math.PI / 2 + degToRad(angle - theta / 2), -Math.PI / 2 + degToRad(angle + theta / 2));
	Caldro.rendering.context.closePath();
	fillColor(fill)
	Caldro.rendering.context.fill();
}

function stAarc(x, y, r, theta, angle, fill, lineWidth = 5) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, -Math.PI / 2 + degToRad(angle - theta / 2), -Math.PI / 2 + degToRad(angle + theta / 2));
	Caldro.rendering.context.closePath();
	strokeColor(fill)
	cc.lineWidth = lineWidth
	Caldro.rendering.context.fill();
}

function circle(x, y, r, fill) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, 0, 2 * Math.PI);
	Caldro.rendering.context.closePath();
	fillColor(fill)
	Caldro.rendering.context.fill();
}

function stCircle(x, y, r, fill, lw) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, 0, 2 * Math.PI);
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.lineWidth = lw;
	strokeColor(fill);
	Caldro.rendering.context.stroke();
}

function clCircle(x, y, r) {
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.arc(x, y, r, 0, 2 * Math.PI);
	Caldro.rendering.context.closePath();
	Caldro.rendering.context.clip();
}

function line(a, b, c, d, col, lw) {
	Caldro.rendering.context.beginPath();
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

function font(size = 30, font = 'Arial', thickness = "") {
	let fnt = "" + thickness + "" + size + "px " + font;
	Caldro.rendering.context.font = fnt;
	return fnt;
}

function txt(text, x, y, font = '30px Arial', fill = 'skyblue', angle = 0, alignment = "center", baseLine = "middle") {
	Caldro.rendering.context.font = font
	Caldro.rendering.context.textAlign = alignment
	Caldro.rendering.context.textBaseline = baseLine
	fillColor(fill)
	fillText(text, x, y, angle)
}

function sttxt(text, x, y, font = '30px Arial', fill = 'skyblue', lineWidth = 5, angle = 0, alignment = "center", baseLine = "middle") {
	Caldro.rendering.context.font = font
	Caldro.rendering.context.textAlign = alignment
	Caldro.rendering.context.textBaseline = baseLine
	Caldrp.rendering.context.lineWidth = lineWidth
	strokeColor(fill)
	strokeText(text, x, y, angle)
}

function cltxt(text, x, y, font = '30px Arial', fill = 'skyblue', angle = 0, alignment = "center", baseLine = "middle") {
	Caldro.rendering.context.font = font
	Caldro.rendering.context.textAlign = alignment
	Caldro.rendering.context.textBaseline = baseLine
	Caldro.rendering.context.clip();
}

function fillText(text, x, y, angle = 0) {
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	if (Caldro.rendering.textOutlineThickness > 0) {
		Caldro.rendering.context.lineWidth = Caldro.rendering.textOutlineThickness
		strokeColor(Caldro.rendering.textOutlineColor)
		Caldro.rendering.context.strokeText(text, 0, 0)
		glow(0)
	}
	Caldro.rendering.context.fillText(text, 0, 0)
	Caldro.rendering.context.restore();
}

function strokeText(text, x, y, angle = 0) {
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	if (Caldro.rendering.textOutlineThickness > 0) {
		Caldro.rendering.context.lineWidth = Caldro.rendering.textOutlineThickness
		strokeColor(Caldro.rendering.textOutlineColor)
		Caldro.rendering.context.strokeText(text, 0, 0)
		glow(0)
	}
	Caldro.rendering.context.strokeText(text, 0, 0)
	Caldro.rendering.context.restore();
}

function textOutline(thickness = 0, fillStyle = "black") {
	if (thickness >= 0) {
		Caldro.rendering.textOutlineThickness = thickness;
	}
	Caldro.rendering.textOutlineColor = parseColor(fillStyle)
}

function wrapText(text, x, y, maxWidth, lineHeight, color = "green", font = "50px Arial", angle = 0, textAlignment = "center", baseline = "middle") {
	Caldro.rendering.context.save()
	Caldro.rendering.context.textAlign = textAlignment
	Caldro.rendering.context.textBaseline = baseline
	Caldro.rendering.context.font = font;
	Caldro.rendering.context.lineWidth = 5
	Caldro.rendering.context.lineCap = "round";
	Caldro.rendering.context.lineJoin = "round";

	if (lineHeight == null) {
		lineHeight = parseFloat(font) * 1.1
	} else if (typeof lineHeight == "string") {
		if (lineHeight.includes("auto"))
			lineHeight = parseFloat(font) * 1.1
	}

	let spaceSplit = text.split(' ')
	let words = new Array()
	// doTask("hmmmm", 
	// ()=>{console.log(spaceSplit)})

	let lastWordWasSpace = false
	let savedIndex = 0;
	for (let i = 0; i < spaceSplit.length; ++i) {
		let unCutWord = spaceSplit[i]
		let cutWords = unCutWord.split('\n');
		for (let j = 0; j < cutWords.length; ++j) {
			let word = cutWords[j];
			if (word != "") {
				// if (word == ' ') {
				// if (!lastWordWasSpace) {
				// savedIndex = j-1
				// lastWordWasSpace = true
				// }
				// words[savedIndex] += word
				// } else {
				// if(lastWordWasSpace){
				// words.push(cutWords[savedIndex])
				// lastWordWasSpace = false
				// } else {
				words.push(word);
				// }
				// }
				if (j != cutWords.length - 1) {
					words.push(null)
				}


			} else {
				words.push(null)
			}
		}
	}

	// doTask("hmmmm",
	// () => { console.log(words) })

	let line = '';
	let height = lineHeight
	let width = 0

	fillColor(color)
	strokeColor("black")
	for (let n = 0; n < words.length; ++n) {
		if (words[n] == null) {
			fillText(line, x, y, angle);
			width = Math.max(width, Caldro.rendering.context.measureText(line).width)
			y += lineHeight;
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
			fillText(line, x, y, angle);
			width = Math.max(width, Caldro.rendering.context.measureText(line).width)
			line = words[n] + ' ';
			y += lineHeight;
			height += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	fillText(line, x, y, angle);

	// return {x: x, y: y, width: width, height: height};
	/* alpha(0.4)
	rect(x- width/2, y-height, width, height, "black")
	alpha(1) */
	Caldro.rendering.context.restore();
}

function edges(w, h, blur, color, canvas = c, camera) {
	let cn = getCanvasDimensions(canvas)
	Caldro.rendering.context.save();
	glow(blur, color)
	fillColor(color)
	if (camera) {
		Caldro.rendering.context.translate(camera.x - camera.width / 2, camera.y - camera.height / 2)
	}
	rect(cn.w, 0, w, h)
	rect(-w, 0, w, h)
	rect(cn.w, cn.h - h, w, h)
	rect(-w, cn.h - h, w, h)
	rect(0, -h, w, h)
	rect(cn.w - w, -h, w, h)
	rect(0, cn.h, w, h)
	rect(cn.w - w, cn.h, w, h)
	glow(0)
	Caldro.rendering.context.restore();
}
/* function edge(x, y, color, glowAmount, w, h) {
	glow(glowAmount, parseColor(color))
	rect(x, y, w, h, color)
	glow(0)
}

function edges(w, h, blur, color, canvas = c) {
	let c = getCanvasDimensions(canvas)
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
} */

function glow(amount = 10, color = 'white') {
	if (Caldro.renderer.glow) {
		Caldro.rendering.context.shadowBlur = amount;
		Caldro.rendering.context.shadowColor = parseColor(color);
	}
}

function shadow(amount = 10, color = 'white', offsetX = 0, offsetY = 0) {
	if (Caldro.renderer.glow) {
		Caldro.rendering.context.shadowBlur = amount;
		Caldro.rendering.context.shadowColor = parseColor(color);
		Caldro.rendering.context.shadowOffsetX = offsetX;
		Caldro.rendering.context.shadowOffsetY = offsetY;
	}
}

function alpha(value) {
	if (Caldro.renderer.alpha) {
		Caldro.rendering.context.globalAlpha = value;
	}
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
	x = -w / 2; y = -h / 2;
	strect(x, y, w, h, fill, lineWidth);
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
		Caldro.rendering.context.moveTo(hw / 2 - borderRadius, - hh);
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
		Caldro.rendering.context.moveTo(hw / 2 - borderRadius, - hh);
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
	fillColor(fill)
	Caldro.rendering.context.fill();
	Caldro.rendering.context.restore();
	/*circle(this.x-this.hw,this.y,this.hh,this.color)
	circle(this.x+this.hw,this.y,this.hh,this.color)*/
};

function stCurvedRect(x, y, width, height, fill, angle, dotBorderRadius = 10, lw = 5) {
	let hw = width / 2;
	let hh = height / 2;
	Caldro.rendering.context.save();
	Caldro.rendering.context.translate(x, y);
	Caldro.rendering.context.rotate(degToRad(angle));
	Caldro.rendering.context.beginPath();
	if (typeof dotBorderRadius == "number") {
		let borderRadius = dotBorderRadius
		Caldro.rendering.context.moveTo(hw / 2 - borderRadius, - hh);
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
		Caldro.rendering.context.moveTo(hw / 2 - borderRadius, - hh);
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
	Caldro.rendering.context.lineWidth = lw;
	strokeColor(fill)
	Caldro.rendering.context.stroke();
	Caldro.rendering.context.restore();
};


function triangle(x, y, length, color, angle = 0) {
	let sqrt3 = 1.7321;
	let height = length * (sqrt3 / 2)
	let a = new Point2D(0, -height / 2);
	let b = new Point2D(-length / 2, +height / 2);
	let c = new Point2D(length / 2, +height / 2);
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(a.x, a.y);
	Caldro.rendering.context.lineTo(b.x, b.y);
	Caldro.rendering.context.lineTo(c.x, c.y);
	Caldro.rendering.context.closePath();
	fillColor(color);
	Caldro.rendering.context.fill();
	Caldro.rendering.context.restore()
}

function stTriangle(x, y, length, color, angle = 0, lineWidth = 2) {
	let sqrt3 = 1.7321;
	let height = length * (sqrt3 / 2)
	// length = height
	let a = new Point2D(0, -height / 2);
	let b = new Point2D(-length / 2, +height / 2);
	let c = new Point2D(length / 2, +height / 2);
	Caldro.rendering.context.save()
	Caldro.rendering.context.translate(x, y)
	Caldro.rendering.context.rotate(degToRad(angle))
	Caldro.rendering.context.beginPath();
	Caldro.rendering.context.moveTo(a.x, a.y);
	Caldro.rendering.context.lineTo(b.x, b.y);
	Caldro.rendering.context.lineTo(c.x, c.y);
	Caldro.rendering.context.closePath();
	strokeColor(color)
	Caldro.rendering.context.lineWidth = lineWidth
	Caldro.rendering.context.stroke();
	Caldro.rendering.context.restore()
}

function renderRectBody(body, color) {
	Rect(body.x, body.y, body.width, body.height, color)
}

function stDrawPolypon(verticies, color, lineWidth) {
	let context = Caldro.rendering.context;
	context.beginPath();
	context.moveTo(verticies[0].x, verticies[0].y);
	for (let i = 0; i < verticies.length; ++i) {
		context.lineTo(verticies[i].x, verticies[i].y)
	}
	context.closePath();
	strokeColor(color)
	context.lineWidth = lineWidth;
	context.stroke();
}

function drawPolypon(verticies, color) {
	let context = Caldro.rendering.context;
	context.beginPath();
	context.moveTo(verticies[0].x, verticies[0].y);
	for (let i = 0; i < verticies.length; ++i) {
		context.lineTo(verticies[i].x, verticies[i].y)
	}
	context.closePath();
	fillColor(color)
	context.fill()
}

function stDrawPolypon(verticies, color, lw = 2) {
	let context = Caldro.rendering.context;
	context.beginPath();
	context.moveTo(verticies[0].x, verticies[0].y);
	for (let i = 0; i < verticies.length; ++i) {
		context.lineTo(verticies[i].x, verticies[i].y)
	}
	context.closePath();
	strokeColor(color)
	context.lineWidth = lw
	context.stroke()
}

function clipPolypon(verticies) {
	let context = Caldro.rendering.context;
	context.beginPath();
	context.moveTo(verticies[0].x, verticies[0].y);
	for (let i = 0; i < verticies.length; ++i) {
		context.lineTo(verticies[i].x, verticies[i].y)
	}
	context.closePath();
	context.clip()
}

function drawRegularSidedPolygon(x = 0, y = 0, radius = 1, numberOfVertices = 3, color = "skyblue") {
	let TWO_PI = Math.PI * 2;
	Caldro.rendering.context.beginPath()
	for (let angle = 0; angle < TWO_PI; angle += TWO_PI / numberOfVertices) {
		let px = x + radius * Math.sin(angle);
		let py = y + radius * Math.cos(angle)
		if (angle == 0) {
			Caldro.rendering.context.moveTo(px, py)
		} else {
			Caldro.rendering.context.lineTo(px, py)
		}
	}
	Caldro.rendering.context.closePath()
	fillColor(color);
	Caldro.rendering.context.fill()
}



/// ========== CANVAS AND COLOR =================
function colorToRGB(color) { }
function getColor(x, y, context = Caldro.rendering.context, method2 = false) { }
{
	let canv = document.createElement("canvas");
	canv.width = 1;
	canv.height = 1;
	let cont = canv.getContext("2d", {
		willReadFrequently: true
	});

	colorToRGB = function (color) {
		let col = parseColor(color);
		cont.fillStyle = col;
		cont.fillRect(0, 0, 1, 1);
		return getColor(0, 0, canv);
	}

	getColor = function (x, y, canvas = Caldro.rendering.canvas) {
		cont.drawImage(canvas, x, y, 1, 1, 0, 0, 1, 1);
		let src = cont.getImageData(0, 0, 1, 1)
		return {
			r: src.data[0],
			g: src.data[1],
			b: src.data[2],
			a: src.data[3],
		}
	}
	/* getColor = function(x, y, context = Caldro.rendering.context, method2 = false, canvas = Caldro.rendering.canvas) {
		if (!method2) {
			let src = context.getImageData(x, y, 1, 1)
			return {
				r: src.data[0],
				g: src.data[1],
				b: src.data[2],
				a: src.data[3],
			}
		} else {
			cont.drawImage(canvas, x, y, 1, 1, 0, 0, 1, 1);
			return getColor(0, 0, cont)
		}
	} */
}

function pickRandomColor(r = [0, 255], g = [0, 255], b = [0, 255], a = [0, 1]) {
	let color = 'rgba(' + randomNumber(r[0], r[1], false) + ',' + randomNumber(g[0], g[1], false) + ',' + randomNumber(b[0], b[1], false) + ',1)';
	return color;
}


function grayscale(r, g, b) {
	value = (r + g + b) / 3
	return "rgb(" + value + ',' + value + ',' + value + ')';
}

function colorObjectToString(colorObject) {
	let co = colorObject;
	if (co.r) {
		return 'rgba(' + co.r + ',' + co.g + ',' + co.b + ',' + co.a + ')';
	} else if (typeof co == 'object') {
		return 'rgba(' + co[0] + ',' + co[1] + ',' + co[2] + ',' + co[3] + ')';
	}
}




class colorObject {
	constructor(r = 123, g = 123, b = 123, a = 1) {
		if (arguments.length == 1) {
			let color = colorToRGB(r)
			this.r = color.r
			this.g = color.g
			this.b = color.b
			this.a = color.a
		} else {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
	}
	addValue(value = 10, editAlpha = false) {
		this.r = limit(this.r + value, 0, 255);
		this.g = limit(this.g + value, 0, 255);
		this.b = limit(this.b + value, 0, 255);
		if (editAlpha) {
			this.a = limit((this.a + value) / 255, 0, 1);
		}
	}
	addCollor(colorObject, editAlpha = false) {
		this.r = limit(this.r + colorObject.r, 0, 255);
		this.g = limit(this.g + colorObject.g, 0, 255);
		this.b = limit(this.b + colorObject.b, 0, 255);
		if (editAlpha) {
			this.a = limit((this.a + colorObject.a) / 255, 0, 1);
		}
	}
	subtractCollor(colorObject, editAlpha = false) {
		this.r = limit(this.r - value, 0, 255);
		this.g = limit(this.g - value, 0, 255);
		this.b = limit(this.b - value, 0, 255);
		if (editAlpha) {
			this.a = limit((this.a + colorObject.a), 0, 1);
		}
	}
	setAll(value = 0, alpha = 1) {
		this.r = limit(value, 0, 255);
		this.b = limit(value, 0, 255);
		this.g = limit(value, 0, 255);
		this.a = limit(alpha, 0, 1);
	}
	sumTotal() {
		return this.r + this.g + this.b;
	}
	getString() {
		return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
	}
}

const colorUtils = {
	addValue(color, value = 10, editAlpha = false) {
		return new colorObject(
			limit(color.r + value, 0, 255),
			limit(color.g + value, 0, 255),
			limit(color.b + value, 0, 255),
			editAlpha ? this.a = limit((this.a + value) / 255, 0, 1) : 1,
		)
	},
	subtractValue(color, value = 10, editAlpha = false) {
		return new colorObject(
			limit(color.r - value, 0, 255),
			limit(color.g - value, 0, 255),
			limit(color.b - value, 0, 255),
			editAlpha ? this.a = limit((this.a - value) / 255, 0, 1) : 1,
		)
	},
	add(color1, color2) {
		return new colorObject(
			limit(color1.r + color2.r, 0, 255),
			limit(color1.g + color2.g, 0, 255),
			limit(color1.b + color2.b, 0, 255),
			(color1.a + color2.a) / 2
		)
	},
	subtract(color1, color2) {
		return new colorObject(
			limit(color1.r - color2.r, 0, 255),
			limit(color1.g - color2.g, 0, 255),
			limit(color1.b - color2.b, 0, 255),
			(color1.a + color2.a) / 2
		)
	},
	multiply(color1, color2, dampener = 0.01) {
		return new colorObject(
			limit((color1.r * color2.r) * dampener, 0, 255),
			limit((color1.g * color2.g) * dampener, 0, 255),
			limit((color1.b * color2.b) * dampener, 0, 255),
			(color1.a + color2.a) / 2
		)
	},
	raise(color1, color2) {
		return new colorObject(
			limit(color1.r ^ color2.r, 0, 255),
			limit(color1.g ^ color2.g, 0, 255),
			limit(color1.b ^ color2.b, 0, 255),
			(color1.a + color2.a) / 2
		)
	},
	divide(color1, color2, multiplier = 50) {
		return new colorObject(
			limit((color1.r / color2.r) * multiplier, 0, 255),
			limit((color1.g / color2.g) * multiplier, 0, 255),
			limit((color1.b / color2.b) * multiplier, 0, 255),
			(color1.a + color2.a) / 2
		)
	},
	interpolate(color1, color2, percentage) {
		return new colorObject(
			interpolate(percentage, color1.r, color2.r),
			interpolate(percentage, color1.g, color2.g),
			interpolate(percentage, color1.b, color2.b),
			(color1.a + color2.a) / 2
		)
	},
	sumTotal(colorObject) {
		return colorObject.r + colorObject.g + colorObject.b;
	},
	rgbaToHex(rgba){
		return `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}${rgba.a.toString(16).padStart(2, '0')}`
	}
}


function interpolatePoints(pointsArray, percentage) {
	let i = Math.floor(pointsArray.length * (percentage / 100))
	let point1 = points[i]
	let point2 = points[i + 1]
	if (point2) {
		return {
			x: interpolate(percentage, point1.x, point2.x),
			y: interpolate(percentage, point1.y, point2.y)
		}
	} else {
		return point1
	}
}


// SPECIAL EFFECTS
function pixelatedCanvas(canvas, percentage = 50, anti_aliasing = false, x = 0, y = 0, width = c.w, height = c.h) {
	let pixelator = Caldro.renderer._pixelatorCanvas;
	let drawingCanvas = Caldro.renderer.canvas;
	percentage = (clip(percentage, 0, 100) * 0.01);
	let cwidth = clip(Math.floor(canvas.width * percentage), 1, INFINITY);
	let cheight = clip(Math.floor(canvas.height * percentage), 1, INFINITY);
	pixelator.width = cwidth;
	pixelator.height = cheight;
	pixelator.getContext('2d').imageSmoothingEnabled = anti_aliasing;
	Caldro.renderer.setRenderingCanvas(pixelator)
	drawImage(canvas, 0, 0, cwidth, cheight)
	Caldro.renderer.setRenderingCanvas(drawingCanvas)
	drawImagePortion(pixelator, 0, 0, cwidth, cheight, x, y, width, height)
}



function manipulateImageData(canvas, operation) {
	let context = canvas.getContext("2d");
	let imageData = context.getImageData(0, 0, canvas.width, canvas.height)
	let pixels = imageData.data;
	for (let pix = 0; pix < pixels.length; pix += 4) {
		let i = pix * 0.25
		let y = Math.floor(i / canvas.width);
		let x = i - (canvas.width * y)
		let r = pixels[pix]
		let g = pixels[pix + 1]
		let b = pixels[pix + 2]
		let a = pixels[pix + 3]
		let manipulation = operation(x, y, r, g, b, a)
		pixels[pix] = manipulation[0]
		pixels[pix + 1] = manipulation[1]
		pixels[pix + 2] = manipulation[2]
		pixels[pix + 3] = manipulation[3]
	}
	context.putImageData(imageData, 0, 0, 0, 0, c.w, c.h)
}


"use strict"; // Renderers

function cordShow(who, fill = 'green', w = 300, h = 2, showCordValue = false) {
	if (who != undefined) {
		let x = who.x;
		let y = who.y;
		Rect(x, y, w, h, fill)
		Rect(x, y, h, w, fill)
		if (showCordValue) {
			txt('x : ' + x + ', y : ' + y, x + w*0.15, y - w*0.15, font(20))
		}
	}
}

function meter(x, y, width, height, value = 50, lowest_limit = 0, highest_limit = 100, colors = ['#22ff12', 'orange', 'red'], backgroundColor = "transparent", steps = 100)
{
	let color = colors[0]
	steps = width / steps
	limit(value, lowest_limit, highest_limit);
	let percent = (value / highest_limit) * 100
	let valueLenght = limit(steps * percent, 0, width)
	if(backgroundColor!="transparent"){
		rect(x - width / 2, y - height / 2, width, height, backgroundColor)
	}
	rect(x - width / 2, y - height / 2, valueLenght, height, color)
	stRect(x, y, width, height, 'white', 2)
}

function checkBoard(x, y, width, height, rows = 8, columns = 8, color1 = "white", color2 = "black"){
	let rowHeight = height / rows;
	let columnWidth = width / columns;
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


function drawGraph(x = 0, y = 0, width = 1000, height = 1000, minorStep = 10, majorStepCount = 10, color = "white", camera = null, size = null) {
    let sizer = size || minorStep*0.1
    let startX = x - (width / 2);
    let startY = y - (height / 2);
    let endX = x + (width / 2)
    let endY = y + (height / 2)
    let majLw = 1 * sizer
    let minLw = 0.5 * sizer
    let lineSteps = 4
    let textSteps = lineSteps * 2
    x = Math.floor(x)
    y = Math.floor(y)
    alpha(0.1)
    rect(startX, startY, width, height, color)
    alpha(0.9)
    Rect(0, 0, width, majLw, color)
    Rect(0, 0, majLw, height, color)
    Rect(0, 0, majLw * 2, 50 * sizer, color, 45)
    Rect(0, 0, majLw * 2, 50 * sizer, color, 135)
    alpha(0.7)
    for (let vx = startX; vx <= endX; vx += minorStep) {
        if (lineSteps < 4) {
            Rect(vx, y, minLw, height, color)
            ++lineSteps;
        } else {
            Rect(vx, y, majLw, height, color)
            alpha(0.9)
            txt(vx, vx, y + 40 * sizer / 2, font(30 * sizer / 2), color)
            textSteps = 0
            alpha(0.7)
            lineSteps = 0;
        }
    }
    alpha(0.7)
    lineSteps = 4;
    for (let vy = startY; vy <= endY; vy += minorStep) {
        if (lineSteps < 4) {
            Rect(x, vy, width, minLw, color)
            ++lineSteps;
        } else {
            Rect(x, vy, width, majLw, color)
            alpha(0.9)
            txt(vy, x - 40 * sizer / 2, vy, font(30 * sizer / 2), color)
            alpha(0.7)
            lineSteps = 0;
        }
    }
    alpha(0.1)


    alpha(1)
}


"use strict"; // Audio

// [SID]
class DOMaudioManager {
	static shouldRespond(audioID, audioManager) {
		return (audioManager.active && audioManager.bank[audioID] && audioManager.initialized)
	}
	constructor() {
		let audioManager = this;
		this.initState = false;
		this.initialized = false;
		this.loadState = false;
		this.active = true;
		this.addedSounds = 0;
		this.loadedSounds = 0;
		this.masterVolume = 1;
		this.fileSrcPrefix = "";
		this.bank = {};
		this.pausedAudio = new Array();

		this.WAAPICtx;
		this.masterGainNode;
		this.masterFilterNode;
		this.preSFXNode;
	}
	onInit() { };
	initialize() {
		if (!this.active)
			return;
			this.WAAPICtx = createAudioContext();
			if (this.WAAPICtx) {
				this.masterFilterNode = this.WAAPICtx.createBiquadFilter();
				this.masterFilterNode.frequency.value = 20000
				this.masterGainNode = this.WAAPICtx.createGain();
				this.preGainNode = this.WAAPICtx.createGain();
	
				this.preGainNode.connect(this.masterFilterNode)
				this.masterFilterNode.connect(this.masterGainNode);
				this.masterGainNode.connect(this.WAAPICtx.destination);
			}
		for (let s = 0; s < this.bank.length; ++s) {
			try {
				let sound = this.bank[s];
				let former_volume = sound.volume;
				sound.load();
				sound.currentTime = 1;
				sound.volume = 0;
				sound.groupPaused = false
				setTimeout(() => {
					sound.play();
					setTimeout(function () {
						sound.pause();
						sound.volume = former_volume;
						// this.onInit();
					}, 1000);
				}, 2000);
				sound.currentTime = 0;
			} catch (e) {
				/*window.onerror = function(e){
				  return true;
				}*/
			}
		}
		this.initState = true;
		// console.log("initialized")
	};

	pauseAll() {
		if (!this.active)
			return;
		for (let s in this.bank) {
			let didPause = this.pause(s)
			if (didPause) {
				this.pausedAudio.push(s)
				this.bank[s].groupPaused = true
			}
		}
	};
	resumeAll() {
		if (!this.active)
			return;
		for (let s of this.pausedAudio) {
			if (!this.bank[s].groupPaused) continue;
			this.play(s)
			console.log("tried")
		}
		this.pausedAudio.length = 0;
	};

	checkPlaying() {
		let playing = new Array();
		for (let s in this.bank) {
			if (this.bank[s].isPlaying)
				playing.push(s)
		}
		return playing;
	}

	stopAll() {
		if (!this.active)
			return;
		for (let s in this.bank) {
			this.stop(s)
		}
	};

	play(id, cloneNode = false, time = null, volume = null) {
		if (!DOMaudioManager.shouldRespond(id, this)) return;
		if (cloneNode) {
			let sound = this.bank[id].cloneNode(true);
			sound.volume = this.bank[id].volume;
			if (time !== null)
				sound.currentTime = time;
			if (volume !== null)
				sound.volume = volume;
			sound.play();
			return true;
		} else {
			let sound = this.bank[id];
			if (time !== null)
				sound.currentTime = time;
			if (volume !== null)
				sound.volume = volume;
			sound.play();
			sound.groupPaused = false;
			return true;
		}
	};

	pause(id) {
		if (!this.active)
			return;
		// console.log("Trying to pause Audio file tagged **"+id+"**, that file is "+this.bank[id])

		if (this.isAudioFile(id)) {
			if (!this.bank[id].isPlaying) return;
			this.bank[id].pause();
			// console.log(typeof this.bank[id])
			return true
		}
	};

	stop(id) {
		if (!this.active)
			return;
		// console.log("Trying to pause Audio file tagged **"+id+"**, that file is "+this.bank[id])
		if (this.isAudioFile(id)) {
			let audio = this.bank[id]
			// console.log(audio)
			audio.pause();
			audio.currentTime = 0;
			// console.log(typeof this.bank[id])
			return true
		}
	};


	isAudioFile(id) {
		if (this.bank[id]) {
			return getConstructorName(this.bank[id]) == "HTMLAudioElement";
		}
	};

	get(id, cloneNode = false) {
		if (this.bank[id] != undefined) {
			if (!cloneNode) {
				return this.bank[id];
			} else {
				let sound = this.bank[id].cloneNode(true);
				sound.volume = this.bank[id].volume;
				return sound;
			}
		} else {
			// console.log("Tried to get Audio file tagged **"+id+"**");
			// return new Audio();
			return null;
		}
	};

	setCurrentTime(id, value = 0) {
		this.bank[id].currentTime = value;
	};
	getCurrentTime(id) {
		return this.bank[id].currentTime;
	};

	access() {
		this.initialize();
	};

	getLoadPercenteage() {
		return (this.loadedSounds / this.addedSounds) * 100;
	};

	updateLoadinfo() {
		++this.loadedSounds;
		if (this.loadedSounds == this.addedSounds && this.loadState == false) {
			this.loadState = true;
			this.initialized = true;
			this.onInit();
			//console.l555og("All ssounds have been initialized");
			this.access = function () { };
		} else {
			// console.log(this.loadedSounds)
		}
	};

	createSoundObject() {
		let soundObject = {
			/* audioFile: audioFile,
			volume: volume,
			pitch: 1,
			speed: 1, */
		};
	};

	add(id, src, volume = 1) {
		if (!this.active)
			return;
		// let aud = document.createElement("audio");
		let aud = new Audio();
		aud.src = this.fileSrcPrefix + (this.fileSrcPrefix[this.fileSrcPrefix.length - 1] != "/" ? "/" : "") + src
		aud.volume = volume;
		aud.psuedoVolume = volume;
		aud.id = id;
		aud.preload = "auto";
		aud.controls = false;
		aud.isPlaying = false;
		this.bank[id] = aud;
		++this.addedSounds;
		// document.body.appendChild(aud)
		aud.onended = () => {
			aud.isPlaying = false;
			console.log("[Audio}: " + id + " was ended")
		}
		aud.onplaying = () => {
			aud.isPlaying = true;
			// console.log("[Audio}: "+id+" has started playing")
		}
		aud.onpause = () => {
			aud.isPlaying = false;
			// console.log("[Audio}: "+id+" was paused")
		}
		let afterloaded =  () => {
			if (this.WAAPICtx) {
				let mediaElement = this.WAAPICtx.createMediaElementSource(aud);
				mediaElement.connect(this.preGainNode);
			}
			aud.removeEventListener("canplaythrough", afterloaded, false)
			this.updateLoadinfo();
		}
		aud.addEventListener("canplaythrough", afterloaded, false)
		aud.setVolume = (volume = 1) => {
			aud.psuedoVolume = volume;
			aud.volume = aud.psuedoVolume * this.masterVolume;
		};
		aud.getVolume = function (volume = 1) {
			return aud.psuedoVolume;
		};
		aud.getCurrentTime = function () {
			return aud.currentTime
		}
		aud.setCurrentTime = function (time) {
			return aud.currentTime = time;
		}
		aud.setPlaybackRate = function (playbackRate = 1) {
			aud.playbackRate = playbackRate;
		}
		aud.getPlaybackRate = function () {
			return aud.playbackRate;
		}
		aud.setLoop = function (loop = true) {
			aud.loop = loop
		}
	};

	setMasterVolume(volume = 1) {
		if (!this.active)
			return;
		this.masterVolume = volume;
		for (let b in this.bank) {
			let sound = this.bank[b];
			sound.volume = sound.psuedoVolume * this.masterVolume;
		}
	};

	update() {
		if (!this.active)
			return;
		for (let s in this.bank) {
		}
	};
}

class WAAPIEffectChain {
	constructor(WAAPIAudioManager) {
		this.WAAPIAudioManager = WAAPIAudioManager
	}
}

class WAAPIAudioManager {
	constructor() {
		this.active = true
		this.throwErrors = true
		this.audioContext;
		this.addedSounds = 0;
		this.loadedSounds = 0;
		this.loadedData = 0;
		this.totalData = 0;
		this.initData = 0;
		this.fileSrcPrefix = "";
		this.audioBuffers = {};
		this.loadingQueue = {};
		this.runningAudio = {};
		this.autoLoad = true;
		this.initialized = false;
		this.loaded = false;
		this.reverbImpulses = {
			hall: "",
			plate: "",
			room: "",
		}
		this.masterGainNode = null;
		this.masterCompressor = null;
		this.masterPlaybackRate = null;
		this.nodeGraphEnd = null;
	}
	getMasterVolume() {
		if (!this.initialized) return
		return this.masterGainNode.gain.value
	}
	setMasterVolume(volume) {
		if (!this.initialized) return
		this.masterGainNode.gain.value = volume * 0.01
	}
	getLoadPercenteage(actualDataLoaded = false) {
		if (actualDataLoaded)
			if (this.initData == this.addedSounds) {
				return (this.loadedData / this.totalData) * 100
			} else {
				return 0;
			}

		return (this.loadedSounds / this.addedSounds) * 100;
	};
	createSoundObject(audioBuffer) {
		let startTime = 0;
		let currentTime = 0;
		let pausedAtTime = 0;
		let isPlaying = false;
		let gainNode = this.audioContext.createGain();
		let isloop = false;
		let isNativeLoop = false
		let loopStart = 0;
		let loopEnd = 0
		let playbackRate = 1
		let WAAPIam = this;
		let stoppedManually = false
		let getPausedTime = () => {
			if (isPlaying) {
				let time = pausedAtTime + (WAAPIam.audioContext.currentTime - startTime)
				if (time > audioPackage.buffer.duration) {
					time = audioPackage.buffer.duration
				}
				return time
			} else {
				return pausedAtTime
			}
		}
		let audioPackage =
		{
			currentInfo: function () {
				return {
					startTime: startTime,
					currentTime: currentTime,
					pausedAtTime: pausedAtTime,
					isPlaying: isPlaying,
					isloop: isloop,
					loopStart: loopStart,
					loopEnd: loopEnd,
					playbackRate: playbackRate
				}
			},
			buffer: audioBuffer,
			bufferSourceNode: this.audioContext.createBufferSource(),
			duration: audioBuffer.duration,
			hasPlayed: false,
			loadProgress: 100,
			playing: isPlaying,
			isPlaying() { return isPlaying },
			isLooping() { return isloop },
			isNativeLooping() { return isNativeLoop },
			play(clone = false, startAt = 0, delayTime = 0, endAt, volume) {
				let sound;
				if (clone || !isPlaying) {
					sound = WAAPIam.audioContext.createBufferSource();
					this.bufferSourceNode = sound
					sound.buffer = this.buffer;
				} else {
					sound = this.bufferSourceNode
				}
				sound.onended = () => {
					let time;
					if (isPlaying) {
						time = this.getCurrentTime();
						if (time > this.buffer.duration) {
							time = this.buffer.duration
						}
					} else {
						time = pausedAtTime
					}
					if (time == this.buffer.duration) {
						if (!isloop && !stoppedManually) {
							isPlaying = false
							currentTime = time
							startTime = 0;
						}
					}
					if (isloop && !stoppedManually) {
						// console.log("IT TRIES TO LOOP")
						this.bufferSourceNode.onended = () => { };

						if (!this.hasPlayed) return;
						stoppedManually = true;
						this.bufferSourceNode.stop()
						if (getPausedTime() < loopEnd) {
							pausedAtTime = getPausedTime();
						} else {
							pausedAtTime = 0
						}
						isPlaying = false
						startTime = currentTime = 0;

						// console.log(clip(pausedAtTime, loopStart, loopEnd))
						this.play(false, clip(pausedAtTime, loopStart, loopEnd))
						// console.log("SUCCES")
					}
				}
				sound.loop = isNativeLoop
				sound.loopStart = loopStart
				sound.loopEnd = loopEnd

				sound.playbackRate.value = playbackRate
				if (volume) {
					this.setVolume(volume)
				}



				if (clone) {
					startAt = startAt || 0
					endAt = endAt || this.buffer.duration
					sound.connect(gainNode)
					gainNode.connect(WAAPIam.nodeGraphEnd)
					sound.start(WAAPIam.audioContext.currentTime + delayTime, startAt, endAt)
				} else if (!isPlaying) {
					sound.connect(gainNode)
					gainNode.connect(WAAPIam.nodeGraphEnd)
					if (isloop) {
						if (endAt == null) {
							endAt = loopEnd
						}
						if (stoppedManually) {
							pausedAtTime = clip(pausedAtTime, loopStart, loopEnd)
						} else {
							pausedAtTime = loopStart
						}
						sound.start(WAAPIam.audioContext.currentTime + delayTime, pausedAtTime, endAt - pausedAtTime)
					} else {
						if (endAt == null) {
							endAt = this.buffer.duration
						}
						sound.start(WAAPIam.audioContext.currentTime + delayTime, pausedAtTime, endAt)
					}

					startTime = WAAPIam.audioContext.currentTime - pausedAtTime
					currentTime = pausedAtTime// * this.bufferSourceNode.playbackRate.value
					// currentTime = pausedAtTime * this.bufferSourceNode.playbackRate.value
					// currentTime = (pausedAtTime/this.getPlaybackRate()) + (WAAPIam.audioContext.currentTime - startTime) * this.getPlaybackRate();
					pausedAtTime = 0
					isPlaying = true

				}

				this.hasPlayed = true;
				stoppedManually = false
			},
			pause() {
				if (!isPlaying) return;
				stoppedManually = true;
				this.bufferSourceNode.stop()
				pausedAtTime = getPausedTime();
				isPlaying = false;
				startTime = 0
			},
			stop() {
				if (!this.hasPlayed) return;
				stoppedManually = true;
				this.bufferSourceNode.stop()
				isPlaying = false
				startTime = pausedAtTime = currentTime = 0;
			},
			getCurrentTime(isPlayingTime = false) {
				if (isPlaying) {
					let pbr = this.getPlaybackRate();
					let time = (pausedAtTime) + (WAAPIam.audioContext.currentTime / pbr - startTime) //* pbr
					if (time > this.buffer.duration) {
						time = this.buffer.duration
					}
					currentTime = time
					return currentTime
				} else {
					return currentTime
				}
			},
			setCurrentTime(time, isPlayingTime = false) {
				// console.log("recieved time:", time)
				let wasPlaying = isPlaying
				let pbr = this.getPlaybackRate();
				if (this.hasPlayed) {
					if (wasPlaying) {
						this.pause()
					}
				}
				if (time < 0) {
					time = this.buffer.duration - time
					console.wrror("Negative time value passed for the currentTime of the audio when wrapped backwards is geater tanthe lenght of audio\nTime limit fo r the funciotn is [-audioLength, audioLength]")
				} else if (time > this.buffer.duration) {
					time = this.buffer.duration
					console.warn("Provided Time paramerter is greater than the length of the audio")
				}
				if (isloop) {
					time = clip(time, loopStart, loopEnd)
				}
				// time  /= pbr
				currentTime = time
				// time  /= this.bufferSourceNode.playbackRate.value
				pausedAtTime = time
				console.log("set time to", time)
				// currentTime = pausedAtTime

				// console.log("PausedAtTime", pausedAtTime)
				// console.log("CurrentTime", currentTime);
				// console.log("Time", time)
				if (!isPlayingTime) {
					// time  /= this.bufferSourceNode.playbackRate.value
				}
				if (currentTime < this.buffer.duration) {
					if (wasPlaying) {
						this.play()
					}
				} else {
					this.stop()
				}
			},
			getPlaybackRate() {
				return this.bufferSourceNode.playbackRate.value
			},
			setPlaybackRate(playbackrate) {
				this.bufferSourceNode.playbackRate.value = playbackRate = playbackrate
			},
			getVolume() {
				return gainNode.gain.value;
			},
			setVolume(volume) {
				gainNode.gain.value = volume
			},
			getDetune() {
				return this.bufferSourceNode.detune.value
			},
			setDetune(detune) {
				this.bufferSourceNode.detune.value = detune
			},
			setLoop(loop = true, start, end, isNative = false) {
				isNativeLoop = this.bufferSourceNode.loop = isNative
				if (isNativeLoop) {
					loop = false;
					if (this.bufferSourceNode) {
						this.bufferSourceNode.loopStart = loopStart
						this.bufferSourceNode.loopEnd = loopEnd
						// console.log(loopStart, loopEnd)
					}
					return
				}

				isloop = loop;
				if (loop == false) {
					loopStart = 0;
					loopEnd = this.buffer.duration
					this.pause();
					this.play(false);
					return
				}

				loopStart = start || 0
				if (end < 0) {
					loopEnd = this.buffer.duration - end
				} else {
					loopEnd = end || this.buffer.duration
				}
				if (isPlaying) {
					this.pause();
					this.play(false);
				}
			},
		}

		return audioPackage;
	}
	setVolume(id, volume) {
		let soundObject = this.audioBuffers[id];
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no sound with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.setVolume(volume)
	}
	add(id, src, volume = 1) {
		if (!this.active) return;
		src = this.fileSrcPrefix + (this.fileSrcPrefix[this.fileSrcPrefix.length - 1] != "/" ? "/" : "") + src
		if (this.autoLoad) {
			if (!this.audioContext) {
				if (this.throwErrors) throw "WAAPIAudioManager Error: audioManager has not been initialized. Initialize audioManager with [audioManager.initialize] before adding any audio else turn off [audioManager.autoLoad]"
				return;
			}
			this.addedSounds++;
			this.audioBuffers[id] = {
				loadProgress: 0,
			}
			this.loadAudioBuffer(src, (buffer) => {
				this.audioBuffers[id] = this.createSoundObject(buffer);
				this.audioBuffers[id].setVolume(volume)
				this.loadedSounds++;
				this.checkInitState();
			}, id)
		} else {
			this.addedSounds++;
			this.audioBuffers[id] = {
				loadProgress: 0,
			}
			this.loadingQueue[id] = {
				src: src,
			}
		}
	}
	checkInitState() {
		if (this.loadedSounds == this.addedSounds) {
			this.initialized = true
			this.onInit();
		}
	}
	onInit() { };
	hasLoaded(id) {
		if (this.audioBuffers[id].loadProgress = 100) return true;
		return false;
	}
	play(id, clone = false, startAt, delayTime = 0, volume, endAt) {
		if (!this.active) return;
		let soundObject = this.audioBuffers[id]
		if (delayTime <= 0) delayTime = 0;
		if (!soundObject) {
			// throw "WAAPIAudioManager Error: no sound with an id of '"+id+"' was added to the audioManager"
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		if (!this.initialized) {
			if (!soundObject) return
		}
		soundObject.play(clone, startAt, delayTime, endAt, volume)
	}
	pause(id) {
		if (!this.active) return;
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.pause();
	}
	stop(id) {
		if (!this.active) return;
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.stop();
	}
	setLoop(id, loop, start, end, isNative) {
		if (!this.active) return;
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return
		}
		soundObject.setLoop(loop, start, end, isNative)
	}
	pauseAll() {
		if (!this.active) return;
		for (let id in this.audioBuffers) {
			let soundObject = this.audioBuffers[id]
			if (soundObject.isPlaying()) {
				soundObject.pause();
			}
		}
	}
	stopAll() {
		if (!this.active) return;
		for (let id in this.audioBuffers) {
			let soundObject = this.audioBuffers[id]
			soundObject.stop();
		}
	}
	getCurrentTime(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		return soundObject.getCurrentTime();
	}
	setCurrentTime(id, currentTime) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.setCurrentTime(currentTime)
	}
	getPlaybackRate(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		return soundObject.getPlaybackRate();
	}
	setPlaybackRate(id, playbackRate) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.setPlaybackRate(playbackRate)
	}
	getDetune(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		return soundObject.getDetune();
	}
	setDetune(id, detune) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		soundObject.setDetune(detune)
	}
	get(id, clone = false, fullClone = true) {
		if (!this.active) return null;
		// if (!this.active) return this.createSoundObject(this.audioContext.createBuffer(2, this.audioContext.sampleRate, this.audioContext.sampleRate));
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			if (this.throwErrors)
				WAAPIAudioManager.error("no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		if (clone) {
			let sloneAudio = this.createSoundObject(soundObject.buffer)
			if (fullClone) {
				sloneAudio.setVolume(soundObject.getVolume())
			}
			return sloneAudio
		}
		return soundObject
	}
	onAudioLoaded(id) { }
	loadQueue() {
		if (!this.active) return;
		for (let id in this.loadingQueue) {
			this.loadFromQueue(id)
		}
	}
	loadFromQueue(id) {
		if (!this.active) return;
		if (!this.audioContext) {
			if (this.throwErrors)
				WAAPIAudioManager.error("audioManager has not been initialized. Initialize audioManager with [audioManager.initialize] before adding any audio else turn off [audioManager.autoLoad]")
			return;
		}
		this.loadAudioBuffer(this.loadingQueue[id].src, (buffer) => {
			this.audioBuffers[id] = this.createSoundObject(buffer);
			delete this.loadingQueue[id]
			this.loadedSounds++;
			this.checkInitState();
			this.onAudioLoaded(id)
		}, id)
	}
	initialize(load = true, onError) {
		if (!this.active) return;
		this.audioContext = createAudioContext();
		if (!this.audioContext) {
			onError();
			return;
		}
		this.audioContext.resume();

		this.masterGainNode = this.audioContext.createGain();
		this.masterCompressor = this.audioContext.createDynamicsCompressor();

		this.masterCompressor.connect(this.masterGainNode);
		this.masterGainNode.connect(this.audioContext.destination)
		this.nodeGraphEnd = this.masterCompressor
		if (load) {
			this.loadQueue();
		}
	}
	loadAudioBuffer(src, callback, id = null) {
		let xReq = new XMLHttpRequest();
		let audioBuffer;
		xReq.open("GET", src, true);
		xReq.responseType = "arraybuffer"
		xReq.onload = () => {
			this.audioContext.decodeAudioData(xReq.response, (buffer) => {
				audioBuffer = buffer;
				callback(buffer)
			})
		}
		if (id) {
			// console.log(id)
			let firstProgress = true;
			let lastProgress = 0
			xReq.onprogress = (e) => {
				if (firstProgress) {
					this.totalData += e.total
					firstProgress = false;
					this.initData++
				}

				this.loadedData += e.loaded - lastProgress
				lastProgress = e.loaded

				let loadprogress = Math.floor((e.loaded / e.total) * 100)
				this.audioBuffers[id].loadProgress = loadprogress
				this.audioBuffers[id].loadedData = e.loaded
				this.audioBuffers[id].totalData = e.total
				// console.log(`Load for src ${src}: ${loadprogress}%`)
			}
		}
		try {
			xReq.send();
		} catch (error) {
			WAAPIAudioManager.error("file can't be loaded, please check the path of the file: \n'" + src + "'")
		}
		return audioBuffer;
	}
	makeEffectsChain() {
		// TODO: figure out what on earth is supposed to go in here, lol
	}
	static error(message) {
		let msg = message.substring(0, 1).toUpperCase() + message.substring(1)
		console.error("[WAAPIAudioManager Error!]:\n" + "'" + msg + "'")
	}
}



class OWAAPIAudioManager {
	constructor() {
		this.audioContext;
		this.addedSounds = 0;
		this.loadedSounds = 0;
		this.audioBuffers = {};
		this.loadingQueue = {};
		this.runningAudio = {};
		this.autoLoad = true;
		this.initialized = false;
		this.loaded = false;
		this.reverbImpulses = {
			hall: "",
			plate: "",
			room: "",
		}
		this.masterGainNode = null;
		this.masterCompressor = null;
		this.masterPlaybackRate = null;
		this.nodeGraphEnd = null
	}
	getLoadPercenteage() {
		return (this.loadedSounds / this.addedSounds) * 100;
	};
	createSoundObject(audioBuffer) {
		let startTime = 0;
		let currentTime = 0;
		let pausedAtTime = 0;
		let isPlaying = false;
		let gainNode = this.audioContext.createGain();
		let isloop = false;
		let loopStart = 0;
		let loopEnd = 0
		let playbackRate = 1
		let WAAPIam = this;
		return {
			moreInfo: function () {
				return {
					startTime: startTime,
					currentTime: currentTime,
					pausedAtTime: pausedAtTime,
					isPlaying: isPlaying,
					isloop: isloop,
					loopStart: loopStart,
					loopEnd: loopEnd,
					playbackRate: playbackRate
				}
			},
			buffer: audioBuffer,
			bufferSourceNode: this.audioContext.createBufferSource(),
			duration: audioBuffer.duration,
			hasPlayed: false,
			isPlaying() { return isPlaying },
			play(clone = false, startAt = 0, delayTime = 0, endAt, volume) {
				let sound;
				if (clone || !isPlaying) {
					sound = WAAPIam.audioContext.createBufferSource();
					this.bufferSourceNode = sound
					sound.buffer = this.buffer;
				} else {
					sound = this.bufferSourceNode
				}
				sound.onended = () => {
					/* let time;
					if (isPlaying) {
						time = this.getCurrentTime();
						if (time > this.buffer.duration) {
							time = this.buffer.duration
						}
					} else {
						time = pausedAtTime
					}
					if (time == this.buffer.duration) {
						if (!isloop) {
							isPlaying = false
							currentTime = time
							startTime = 0;
						}
					}
					if (isloop) {
						this.bufferSourceNode.onended = () => { };
						this.stop();
						// console.log(clip(pausedAtTime, loopStart, loopEnd))
						this.play(false, clip(pausedAtTime, loopStart, loopEnd))
					} */
					let time;
					if (isPlaying) {
						time = pausedAtTime + (WAAPIam.audioContext.currentTime - startTime)
						// time = pausedAtTime + (WAAPIam.audioContext.currentTime - startTime)
						if (time > this.buffer.duration) {
							time = this.buffer.duration
						}
					} else {
						time = pausedAtTime
					}
					if (time == this.buffer.duration) {
						isPlaying = false
						currentTime = time
						startTime = 0;
						if (isloop) {
							this.play(false, loopStart, 0, loopEnd)
						}
					}
				}

				// sound.loop = isloop
				// sound.loopStart = loopStart
				// sound.loopEnd = loopEnd
				sound.playbackRate.value = playbackRate
				if (volume) {
					this.setVolume(volume)
				}



				if (clone) {
					startAt = startAt || 0
					endAt = endAt || this.buffer.duration
					sound.connect(gainNode)
					gainNode.connect(WAAPIam.nodeGraphEnd)
					sound.start(WAAPIam.audioContext.currentTime + delayTime, startAt, endAt)
				} else if (!isPlaying) {
					endAt = endAt || this.buffer.duration
					sound.connect(gainNode)
					gainNode.connect(WAAPIam.nodeGraphEnd)
					sound.start(WAAPIam.audioContext.currentTime + delayTime, pausedAtTime, endAt)

					startTime = WAAPIam.audioContext.currentTime - pausedAtTime
					currentTime = pausedAtTime * this.bufferSourceNode.playbackRate.value
					pausedAtTime = 0
					isPlaying = true
				}
				this.hasPlayed = true;
			},
			pause() {
				if (!isPlaying) return;
				this.bufferSourceNode.stop()
				pausedAtTime = this.getCurrentTime();
				startTime = 0
				isPlaying = false;
			},
			stop() {
				if (!this.hasPlayed) return;
				this.bufferSourceNode.stop()
				isPlaying = false
				startTime = pausedAtTime = currentTime = 0;
			},
			getCurrentTime() {
				if (isPlaying) {
					let time = pausedAtTime + ((WAAPIam.audioContext.currentTime - startTime) * (this.bufferSourceNode.playbackRate.value))
					if (time > this.buffer.duration * (1 / this.bufferSourceNode.playbackRate.value)) {
						time = this.buffer.duration
					}
					currentTime = time
					return currentTime
				} else {
					return currentTime
				}
			},
			setCurrentTime(time) {
				let wasPlaying = isPlaying
				if (this.hasPlayed) {
					if (isPlaying) {
						this.bufferSourceNode.stop()
						isPlaying = false;
						startTime = 0
					}
				}
				if (time > this.buffer.duration) {
					time = this.buffer.duration
				}
				currentTime = time
				time *= (1 / this.bufferSourceNode.playbackRate.value)
				pausedAtTime = time
				if (time != this.buffer.duration * (1 / this.bufferSourceNode.playbackRate.value)) {
					if (wasPlaying) {
						this.play()
					}
				} else {
					this.stop()
				}
			},
			getPlaybackRate() {
				return this.bufferSourceNode.playbackRate.value
			},
			setPlaybackRate(playbackrate) {
				this.bufferSourceNode.playbackRate.value = playbackRate = playbackrate
			},
			getVolume() {
				return gainNode.gain.value;
			},
			setVolume(volume) {
				gainNode.gain.value = volume
			},
			getDetune() {
				return this.bufferSourceNode.detune.value
			},
			setDetune(detune) {
				this.bufferSourceNode.detune.value = detune
			},
			setLoop(loop = true, start, end) {
				isloop = loop;
				if (loop == false) {
					loopStart = 0;
					loopEnd = this.buffer.duration
					return;
				}
				loopStart = start || 0
				if (end < 0) {
					loopEnd = this.buffer.duration - end
				} else {
					loopEnd = loopEnd || this.buffer.duration
				}
				return
				if (this.bufferSourceNode) {
					this.bufferSourceNode.loop = loop
					this.bufferSourceNode.loopStart = loopStart
					this.bufferSourceNode.loopEnd = loopEnd
				}
			}
		}

	}
	setVolume(id, volume) {
		let soundObject = this.audioBuffers[id];
		if (!soundObject) {
			console.error("WAAPIAudioManager Error: no sound with an id of '" + id + "' was added to the audioManager")
		}
		soundObject.setVolume(volume)
	}
	setMasterVolume(volume) {
		if (!this.initialized) return
		this.masterGainNode.gain.value = volume
	}
	add(id, src, volume = 1) {
		if (this.autoLoad) {
			if (!this.audioContext) {
				throw "WAAPIAudioManager Error: audioManager has not been initialized. Initialize audioManager with [audioManager.initialize] before adding any audio else turn off [audioManager.autoLoad]"
			}
			this.addedSounds++;
			this.loadAudioBuffer(src, (buffer) => {
				this.audioBuffers[id] = this.createSoundObject(buffer);
				this.audioBuffers[id].setVolume(volume)
				this.loadedSounds++;
				this.checkInitState();
			})
		} else {
			this.addedSounds++;
			this.loadingQueue[id] = src;
		}
	}
	checkInitState() {
		if (this.loadedSounds == this.addedSounds) {
			this.initialized = true
			this.onInit();
		}
	}
	onInit() { };
	hasLoaded(id) {
		if (this.audioBuffers[id]) return true;
		return false;
	}
	play(id, clone = false, startAt, delayTime = 0, volume, endAt) {
		let soundObject = this.audioBuffers[id]
		if (delayTime <= 0) delayTime = 0;
		if (!soundObject) {
			// throw "WAAPIAudioManager Error: no sound with an id of '"+id+"' was added to the audioManager"
			console.error("WAAPIAudioManager Error: no audio with an id of '" + id + "' was added to the audioManager")
			return;
		}
		if (!this.initialized) {
			if (!soundObject) return
		}
		soundObject.play(clone, startAt, delayTime, endAt, volume)
	}
	pause(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.pause();
	}
	stop(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.stop();
	}
	setLoop(id, loop, start, end) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.setLoop(loop, start, end)
	}
	pauseAll() {
		for (let id in this.audioBuffers) {
			let soundObject = this.audioBuffers[id]
			if (soundObject.isPlaying()) {
				soundObject.pause();
			}
		}
	}
	stopAll() {
		for (let id in this.audioBuffers) {
			let soundObject = this.audioBuffers[id]
			soundObject.stop();
		}
	}
	getCurrentTime(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		return soundObject.getCurrentTime();
	}
	setCurrentTime(id, currentTime) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.setCurrentTime(currentTime)
	}
	getPlaybackRate(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		return soundObject.getPlaybackRate();
	}
	setPlaybackRate(id, playbackRate) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.setPlaybackRate(playbackRate)
	}
	getDetune(id) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		return soundObject.getDetune();
	}
	setDetune(id, detune) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		soundObject.setDetune(detune)
	}
	get(id, clone = false) {
		let soundObject = this.audioBuffers[id]
		if (!soundObject) {
			throw `WAAPIAudioManager Error: no audio with an id of '${id}' was added to the audio Manager`
		}
		if (clone) {
			return this.createSoundObject(soundObject.buffer)
		}
		return soundObject
	}
	loadQueue() {
		for (let id in this.loadingQueue) {
			this.loadFromQueue(id)
		}
	}
	loadFromQueue(id) {
		if (!this.audioContext) {
			throw "WAAPIAudioManager Error: audioManager has not been initialized. Initialize audioManager with [audioManager.initialize] before adding any audio else turn off [audioManager.autoLoad]"
		}
		this.loadAudioBuffer(this.loadingQueue[id], (buffer) => {
			this.audioBuffers[id] = this.createSoundObject(buffer);
			delete this.loadingQueue[id]
			this.loadedSounds++;
			this.checkInitState();
		})
	}
	initialize(load = true, onError) {
		this.audioContext = createAudioContext();
		if (!this.audioContext) {
			onError();
			return;
		}
		this.audioContext.resume();

		this.masterGainNode = this.audioContext.createGain();
		this.masterCompressor = this.audioContext.createDynamicsCompressor();

		this.masterCompressor.connect(this.masterGainNode);
		this.masterGainNode.connect(this.audioContext.destination)
		this.nodeGraphEnd = this.masterCompressor
		if (load) {
			this.loadQueue();
		}
	}
	loadAudioBuffer(src, callback) {
		let xReq = new XMLHttpRequest();
		let audioBuffer;
		xReq.open("GET", src, true);
		xReq.responseType = "arraybuffer"
		xReq.onload = () => {
			this.audioContext.decodeAudioData(xReq.response, (buffer) => {
				audioBuffer = buffer;
				callback(buffer)
			})
		}
		xReq.send();
		return audioBuffer;
	}
	makeEffectsChain() {
		// TODO: figure out what on earth is supposed to go in here, lol
	}
}

function createAudioContext() {
	let context = new window.AudioContext()
	context = context || new (
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.oAudioContext ||
		window.msAudioContext
	);
	if (context) return context;
	console.error("Web Audio API is not supported on the current browser")
}


"use strict" // Animation

// [SID]
class AnimationGraphNode {
    constructor(time = 0, value = 0, enterFunction = NULLFUNCTION, callback = NULLFUNCTION) {
        this.x = time;
        this.y = value;
        this.isActiveInpterpolation = false;
        this.hasFiredEnterEvent = false;
        this.onEnter = enterFunction
        this.callback = callback
    }
    onEnter() { };
    callback() { };
}

// [SID]
class AnimationGraph {
    static SAMEASPREVIOUS = "sameFunctionAsPreviousFuncion"
    constructor(animationNodes = new Array()) {
        this.nodes = new Array();
        this.currentX = 0;
        this.value = 0;
        this.animationSpeed = 1;
        this.direction = 1
        this.speedMultiplier = 1;
        this.running = false;
        this.loop = false;
        this.startX = 0;
        this.endX = 0;
        this.offsetX = 0;
        this.nodeAddiitonoffsetX = 0;
        this.setAnimationNodesFromArray(animationNodes)
    }
    onStart() { };
    callback() { };
    onEnd() { };

    update(deltatime, valueX = null) {
        valueX+= this.offsetX
        if (!this.running) return;
        if (!valueX) {
            // this.currentX = clip(valueX, this.startX, this.endX)
            this.currentX += this.animationSpeed * deltatime * (this.direction != 0 ? this.direction : 1);
        } else {
            this.currentX = valueX
        }
        if (this.direction == 1) {
            if (this.currentX >= this.endX) {
                if (this.running) {
                    this.currentX = this.endX
                    let node = this.nodes[this.nodes.length - 1]
                    if (node) {
                        if (!node.hasFiredEnterEvent) {
                            node.onEnter();
                            node.hasFiredEnterEvent = true;
                        }
                    }
                    this.running = false;
                    if (this.loop) {
                        this.direction = -this.direction;
                        this.start()
                    }
                    this.onEnd();
                }
                return;
            }
        } else if (this.direction == -1) {
            if (this.currentX <= this.startX) {
                if (this.running) {
                    this.currentX = this.startX
                    let node = this.nodes[0]
                    if (node) {
                        if (!node.hasFiredEnterEvent) {
                            node.onEnter();
                            node.hasFiredEnterEvent = true;
                        }
                    }
                    this.running = false;
                    if (this.loop) {
                        this.direction = -this.direction;
                        this.start()
                    }
                    this.onEnd();
                }
                return;
            }
        }


        let nodeX1 = null;
        let nodeX2 = null;
        for (let i = 0; i < this.nodes.length; ++i) {
            let node = this.nodes[i];
            node.isActiveInpterpolation = false
        }
        // code to loop throuch all points to find points X1 and X2 for interpolation
        for (let i = 0; i < this.nodes.length; ++i) {
            let node = this.nodes[i];
            node.isActiveInpterpolation = false
            if (this.currentX >= node.x) {

                nodeX1 = node;
                nodeX2 = this.nodes[i + 1];
                if (nodeX2) {
                    if (this.currentX < nodeX2.x) {
                        nodeX2.isActiveInpterpolation = true;
                        nodeX1.isActiveInpterpolation = true;
                        // interpolate through points X1 and X2 for the Y value at x 'this.currentX'
                        this.value = interpolate((Math.abs(this.currentX - nodeX1.x) / Math.abs(nodeX2.x - nodeX1.x)), nodeX1.y, nodeX2.y)
                        if (!nodeX1.hasFiredEnterEvent) {
                            nodeX1.onEnter();
                            nodeX1.hasFiredEnterEvent = true;
                        }
                        nodeX1.callback();
                        break;
                    } else {
                        if (i == this.nodes.length - 2) {
                            if (!nodeX2.hasFiredEnterEvent) {
                                nodeX2.onEnter();
                                nodeX2.hasFiredEnterEvent = true;
                            }
                        }
                    }
                } else {
                    this.value = nodeX1.y
                }
            }
        }
    }

    getCurrentTime() {
        return this.currentX
    }
    getCurrentValue() {
        return this.value;
    }

    getValueAtTime(time, fireEnterfunctions = false) {
        time += this.offsetX
        let value;
        let nodeX1 = null;
        let nodeX2 = null;
        for (let i = 0; i < this.nodes.length; ++i) {
            let node = this.nodes[i];
            nodeX1 = node;
            nodeX2 = this.nodes[i + 1];

            if (nodeX2) { // if this node (nodezX1) isnlt the last node 
                if (time >= nodeX1.x && time < nodeX2.x) { // if this node and the nextnode are the current interpolation points
                    nodeX1.isActiveInpterpolation = true;
                    nodeX2.isActiveInpterpolation = true;
                    // interpolate through points X1 and X2 for the Y value at x 'this.currentX'
                    value = interpolate((Math.abs(time - nodeX1.x) / Math.abs(nodeX2.x - nodeX1.x)), nodeX1.y, nodeX2.y)
                    if (fireEnterfunctions) {
                        if (!nodeX1.hasFiredEnterEvent) {
                            nodeX1.onEnter(time);
                            nodeX1.hasFiredEnterEvent = true;
                        }
                        nodeX1.callback(time);
                    }
                    if(this.nodes[this.nodes.length-1] != nodeX2){ // if the 2nd node is not the last node
                        // nodeX2.isActiveInpterpolation = false;
                    }
                    break;
                } else {
                    nodeX1.isActiveInpterpolation = false;
                    nodeX2.isActiveInpterpolation = false;
                }
            } else {
                nodeX1.isActiveInpterpolation = true;
                value = nodeX1.y
                if (fireEnterfunctions) {
                    if (!nodeX1.hasFiredEnterEvent) {
                        nodeX1.onEnter(time);
                        nodeX1.hasFiredEnterEvent = true;
                    }
                    nodeX1.callback(time);
                }
            }
        }
        return value;
    }

    addAnimationNode(time, value, onEnter = NULLFUNCTION, callback = NULLFUNCTION) {
        /* if(getConstructorName(node) != "AnimationGraphNode"){
            console.error("node is not an instance of the 'AnimationGraphNode' class")
            return;
        } */
        time += this.nodeAddiitonoffsetX
        this.endX = Math.max(time, this.endX)
        if (onEnter === AnimationGraph.SAMEASPREVIOUS) {
            onEnter = this.nodes[this.nodes.length - 1].onEnter
        }
        if (callback === AnimationGraph.SAMEASPREVIOUS) {
            callback = this.nodes[this.nodes.length - 1].callback
        }
        this.nodes.push(new AnimationGraphNode(time, value, onEnter, callback))
    }

    setAnimationNodes(nodes) {
        this.nodes.length = 0
        this.endX = -INFINITY
        for (let i = 0; i < nodes.length; ++i) {
            let node = nodes[i]
            if (getConstructorName(node) != "AnimationGraphNode") {
                console.error("The " + i + "th node in the nodes array passed to the 'setAnimationNodes' is not an instance of the 'AnimationGraphNode' class")
                return;
            }
            this.nodes.push(node)
            this.endX = Math.max(this.endX, nodes[i].x)
        }
    }

    setAnimationNodesFromArray(array) {
        this.nodes.length = 0
        for (let i = 0; i < array.length; ++i) {
            let node = array[i]
            let x = node[0];
            if (x < this.startX) {
                console.error("x value of the " + i + "th array given to 'setAnimationNodesFromArray' is lower than the startX of the graph")
                return;
            }
            let y = node[1];
            this.nodes.push(new AnimationGraphNode(x, y))
        }
    }
    setSpeedInAnimationTimePerSecond(speed) {
        this.animationSpeed = speed
    }
    setSpeedFromCompletionTime(totalTime) {
        let distance = arrUtils.max(this.nodes, function (node) { return node.x }) - arrUtils.min(this.nodes, function (node) { return node.x })
        this.animationSpeed = (distance / totalTime)
    }
    start() {
        this.running = true;
    }
    pause() {
        this.running = false;
    }
    stop() {
        this.running = false;
        this.currentX = this.value = this.startX
        for (let n = 0; n < this.nodes.length; ++n) {
            let node = this.nodes[n]
            node.hasFiredEnterEvent = false;
            node.isActiveInpterpolation = false;
        }
    }
    restart() {
        this.stop();
        this.start();
    }
    clearNodes() {
        this.nodes.length = 0;
    }
    forEachNode(nodeManipulation) {
        for (let n = 0; n < this.nodes.length; ++n) {
            nodeManipulation(this.nodes[n])
        }
    }
    quantize(minValue) {
        let length = this.nodes.length;
        for (let i = 0; i < length; ++i) {
            let node1 = this.nodes[i];
            let node2 = this.nodes[i + 1];
            if (node2) {
                let diff = Math.abs(node1.y - node2.y);
                if (diff < minValue) {
                    this.nodes.splice(i + 1, 1)
                    length -= 1;
                    i -= 1
                }
            }
        }
    }
}

function animationEnvelope(length = 1, lowestValue = 0, maxValue = 1, attackEnd = 0.25, releaseStart = 0.75) {
    let envelope = new AnimationGraph()
    envelope.addAnimationNode(0, lowestValue)
    envelope.addAnimationNode(attackEnd * length, maxValue)
    envelope.addAnimationNode(releaseStart * length, maxValue)
    envelope.addAnimationNode(1 * length, lowestValue)
    return envelope;
}

function drawAnimationGraph(animationGraph, x = 0, y = 0, width, height, time = animationGraph.currentX, graphName = "") {
    let cc = Caldro.renderer.context
    let Xarray = new Array();
    for (let node of animationGraph.nodes) {
        Xarray.push(node.x)
    }

    let Yarray = new Array();
    for (let node of animationGraph.nodes) {
        Yarray.push(node.y)
    }
    rect(x, y, width, height)

    let gwidth = width;
    let gHeight = height;
    let maxValueX = Math.ceil(arrUtils.max(Xarray, function (number) { return Math.abs(number) }))
    let maxValueY = Math.ceil(arrUtils.max(Yarray, function (number) { return Math.abs(number) }))
    let scaleFactorX = (gwidth / maxValueX) * 0.45
    let scaleFactorY = (gHeight / maxValueY) * 0.45
    /*  let scaleFactorX = Math.floor(gwidth / maxValueX) *0.5
     let scaleFactorY = Math.floor(gHeight / maxValueY) *0.5  */
    scaleFactorX = clip(scaleFactorX, 0.1, INFINITY)
    scaleFactorY = clip(scaleFactorY, 0.1, INFINITY)
    let scaler = (scaleFactorX + scaleFactorY) * 0.04
    let lastY = 0;
    let lastLY = 0;
    let lastX = 0;
    let lastLX = 0;

    x += gwidth / 2
    y += gHeight / 2

    cc.save();
    cc.translate(x, y)
    cc.scale(0.9, 0.9)
    circle(0, 0, 10, "white",)
    lastX = lastY = 0
    let fnt = 10
    txt(0, -30, 30, font(fnt), "white", "center", "middle")
    line(0, 0, -20, 20, "white")

    line(-gwidth / 2, 0, gwidth / 2, 0, "white")
    // drawing the vertical line strips
    for (let x = -gwidth / 2; x <= gwidth / 2; x += (scaleFactorX)) {
        // x = Math.round(x)
        if (Math.abs(x - lastX) >= gwidth * (1 / scaleFactorX)) {
            line(x, 0, x, 10, "white")
            txt(Math.round(x / scaleFactorX), x, 30, font(fnt), "white", "center", "middle")
            lastX = x
        } else if (Math.abs(x) - Math.abs(lastLX) >= gwidth * 0.01) {
            line(x, 0, x, 5, "white")
            lastLX = x
        }
    }

    line(0, gHeight / 2, 0, -gHeight / 2, "white")
    // drawing the horizontal line strips
    for (let y = -gHeight / 2; y <= gHeight / 2; y += (scaleFactorY)) {
        if (Math.abs(y - lastY) >= gHeight * ((1) / scaleFactorY)) {
            line(0, -y, -10, -y, "white")
            txt(Math.round(y / scaleFactorY), -30, -y, font(fnt), "white", "center", "middle")
            lastY = y
        } else if (Math.abs(y) - Math.abs(lastLY) >= gHeight * 0.01) {
            line(0, -y, -5, -y, "white")
            lastLY = y
        }
    }


    if (Xarray.length > 0) {

        cc.beginPath();
        cc.moveTo(Xarray[0].x, Xarray[0].y)
        for (let i = 0; i < Xarray.length; ++i) {
            cc.lineTo(Xarray[i] * scaleFactorX, -Yarray[i] * scaleFactorY)
        }
        cc.lineWidth = 2
        strokeColor("white")
        cc.stroke();
        for (let i = 0; i < Xarray.length; ++i) {
            if (!animationGraph.nodes[i].isActiveInpterpolation) {
                circle(Xarray[i] * scaleFactorX, -Yarray[i] * scaleFactorY, scaler * 1, "white")
            } else {
                circle(Xarray[i] * scaleFactorX, -Yarray[i] * scaleFactorY, scaler * 1, "yellow")
            }
        }
    }
    circle(animationGraph.endX * scaleFactorX, 0, clip(scaler * 3, 6, INFINITY), "red")
    circle(animationGraph.startX * scaleFactorX, 0, clip(scaler * 3, 6, INFINITY), "lime")
    alpha(0.5)
    alpha(1)
    if (time) {
        let valx = time * scaleFactorX;
        let valy = animationGraph.getValueAtTime(time) * scaleFactorY
        line(valx, gHeight / 2, valx, -gHeight / 2, "lime")
        line(-gwidth / 2, -valy, gwidth / 2, -valy, "lime")
        stCircle(animationGraph.currentX * scaleFactorX, -animationGraph.value * scaleFactorY, clip(scaler * 5, 5, INFINITY), "blue", clip(scaler * 2, 2, INFINITY))
    }
    txt(graphName, -gwidth / 2 + 10, -gHeight / 2 + 30, font(Math.min(gwidth, gHeight) * 0.1), "white", 0, "left")
    cc.restore();
}



"use strict"; // Machine_Learning

class Activation {
    static softmax = {
        forward(input_array) {
            let exp_values = new Array(input_array.length)
            let exp_sum = 0;
            for (let i = 0; i < input_array.length; ++i) {
                let exp_value = Math.exp(input_array[i]);
                exp_sum += exp_value;
                exp_values[i] = exp_value;
            }
            let normalized_values = new Array(exp_values.length)
            for (let i = 0; i < input_array.length; ++i) {
                normalized_values[i] = exp_values[i] / exp_sum;
            }
            return normalized_values
        },
        backward(x) {
            return x * x
        }
    }
    static linear = {
        gradient: 1,
        forward(x) {
            return Activation.linear.gradient * x;
        },
        backward(y) {
            return Activation.linear.gradient;
        }
    }
    static sigmoid = {
        forward(x) {
            return 1 / (1 + Math.exp(-x));
        },
        backward(y) {
            return y * (1 - y)
        },
    }
    static tanh = {
        forward(x) {
            return Math.tanh(x);
        },
        backward(y) {
            return 1 - y * y
        },
    }
    static reLU = {
        forward(x) {
            return Math.max(0, x);
        },
        backward(x) {
            if (x >= 0) return 1
            return 0;
        }
    }
    static leakyReLU = {
        forward(x) {
            return Math.max(0.01 * x, x);
        },
        backward(x) {
            if (x >= 0) return 1
            return 0.01;
        }
    }
    static ELU = {
        gradient: 0.01,
        forward(x) {
            if (x >= 0) {
                return x;
            } else {
                return Activation.ELU.gradient * (Math.exp(x) - 1)
            }
        },
        backward(x) {
            if (x >= 0) return 1
            return x + Activation.ELU.gradient;
        }
    }
    static nameMap = (activationName) => {
        if (typeof activationName != "string") return activationName;
        return Activation.stringMap[activationName]
    }
    static stringMap = {
        "softmax": Activation.softmax,
        "linear": Activation.linear,
        "sigmoid": Activation.sigmoid,
        "tanh": Activation.tanh,
        "reLU": Activation.reLU,
        "leakyReLU": Activation.leakyReLU,
        "ELU": Activation.ELU,
    }
}

class Perceptron {
    constructor(amountOfImputs = 2) {
        this.weights = new Array(amountOfImputs)
        this.learning_rate = 0.1
        this.bias = 1
        this.Activation = "sigmoid"

        for (let i = 0; i < this.weights.length; ++i) {
            this.weights[i] = randomNumber(-1, 1, true)
        }
    }
    predict(inputs) {
        let sum = 0;
        for (let i = 0; i < this.weights.length; ++i) {
            sum += inputs[i] * this.weights[i];
        }
        let output = sum + this.bias;
        return Activation.nameMap(this.Activation)(output)
    }
    predictY(x) {
        let w0 = this.weights[0]
        let w1 = this.weights[1]
        return -(this.bias / w1) - (w0 / w1) * x;
    }
    train(inputs, target) {
        let guess = this.guess(inputs);
        let error = target - guess;
        for (let i = 0; i < this.weights.length; ++i) {
            this.weights[i] += (error * inputs[i]) * this.learning_rate;
        }
    }
}

class NeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.dampenOutputGradients = false;
        this.hidden_layers = new Array();
        this.output_layer;

        if (hidden_nodes instanceof Array) {
            let previous_layer_nodes = input_nodes
            for (let i = 0; i < hidden_nodes.length; ++i) {
                let hidden_layer_nodes = hidden_nodes[i];
                let new_hidden_layer = new NeuralNetwork.layer_dense(previous_layer_nodes, hidden_layer_nodes)
                this.hidden_layers.push(new_hidden_layer)
                previous_layer_nodes = hidden_layer_nodes
            }
            this.output_layer = new NeuralNetwork.layer_dense(this.hidden_nodes[this.hidden_nodes.length - 1], this.output_nodes)
        } else {
            this.hidden_layers.push(
                new NeuralNetwork.layer_dense(input_nodes, hidden_nodes)
            )
            this.output_layer = new NeuralNetwork.layer_dense(this.hidden_nodes, this.output_nodes)
        }

        this.learning_rate = 0.1;
    }

    setHiddenLayerActivationFunction(activation) {
        for (let layer of this.hidden_layers) {
            layer.Activation = activation;
        }
    }

    static layer_dense = class {
        constructor(input_nodes, layer_nodes) {
            this.input_nodes = input_nodes;
            this.layer_nodes = layer_nodes

            // each row of the weight matrix is respoinsible for a single newron, and each value of that row (array) is a weight connectiong the inputs or neurons form the previous layer to this layer
            this.weights = new Matrix(this.layer_nodes, this.input_nodes);
            this.weights.randomize(-1, 1)
            this.biases = new Matrix(this.layer_nodes, 1);
            this.biases.randomize(-1, 1);

            this.Activation = "sigmoid";
            this.inputs;
            this.outputs;
            this.errors;
        }
        getCopy() {
            return NeuralNetwork.layer_dense.deserialize(this.serialize());
        }
        serialize() {
            return JSON.stringify(this);
        }
        static deserialize(data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            let layer = new NeuralNetwork.layer_dense(data.input_nodes, data.layer_nodes)
            layer.weights = Matrix.deserialize(data.weights)
            layer.biases = Matrix.deserialize(data.biases)
            layer.network = data.network
            layer.inputs = data.inputs
            layer.outputs = data.outputs
            layer.errors = data.errors
            layer.Activation = data.Activation
            return layer
        }
        forward(inputs) {
            if (!(inputs instanceof Matrix)) {
                inputs = Matrix.createFromArray(inputs);
            }

            // the inputs multiplied by the weights
            this.outputs = Matrix.multiply(this.weights, inputs);
            // then we add the biases
            this.outputs = Matrix.add(this.outputs, this.biases)

            let activation = Activation.nameMap(this.Activation)
            // finally our activation function
            if (this.Activation == "softmax") {
                for (let i = 0; i < this.outputs.data.length; ++i) {
                    let values = this.outputs.toArray(Matrix.rowWise)
                    let softValues = activation.forward(values)
                    this.outputs = Matrix.createFromArray(softValues, Matrix.rowWise)
                }
            } else {
                this.outputs.map(activation.forward)
            }
            this.inputs = inputs;
            return this.outputs.toArray(Matrix.rowWise);
        }
        backward(next_layer_errors, previous_layer, learning_rate = 0.1) {
            let outputs = this.outputs;
            let inputs = this.inputs;

            let activation = Activation.nameMap(this.Activation)
            // calculate the error
            let weights_T = Matrix.transpose(previous_layer.weights);
            let layer_errors = Matrix.multiply(weights_T, next_layer_errors)
            this.errors = layer_errors


            // calculate the gradient
            let gradients = Matrix.map(outputs, activation.backward);
            gradients.multiply(layer_errors);
            gradients.multiply(learning_rate)

            // update the weights and biases
            let inputs_T = Matrix.transpose(inputs);
            let weight_deltas = Matrix.multiply(gradients, inputs_T)
            this.weights.add(weight_deltas)
            this.biases.add(gradients)

            return layer_errors
        }
    }

    predict(input) {
        if (!(input instanceof Matrix)) {
            input = Matrix.createFromArray(input);
        }

        let first_layer = this.hidden_layers[0]
        first_layer.forward(input)
        let last_layer_output = first_layer.outputs

        for (let l = 1; l < this.hidden_layers.length; ++l) {
            let layer = this.hidden_layers[l]
            layer.forward(last_layer_output)
            last_layer_output = layer.outputs
        }
        return this.output_layer.forward(last_layer_output)
    }

    train(input_array, targets_array) {
        let inputs = null
        if (!(input_array instanceof Matrix)) {
            inputs = Matrix.createFromArray(input_array);
        } else {
            inputs = input_array
        }

        this.predict(inputs);
        // targets
        let targets = Matrix.createFromArray(targets_array);
        // error is really just 'answer - guess'
        let output_errors = Matrix.subtract(targets, this.output_layer.outputs)

        // catergorical cross entophy
        /* let max = -Infinity
        output_errors.map((value) => {
            if(value > max){
                max = value
            }
        })
        output_errors.map((value) => {
            if(value == max){
                return -Math.log(value)
            }
            return 0
        }) */
        output_errors.map((value) => {
            return value ** 2
        })

        // calculate gradients
        let output_Activation = Activation.nameMap(this.output_layer.Activation)
        let gradients = Matrix.map(this.output_layer.outputs, output_Activation.backward)
        gradients.multiply(output_errors)
        if (this.dampenOutputGradients) {
            gradients.multiply(this.learning_rate * 0.01)
        } else {
            gradients.multiply(this.learning_rate)
        }

        // calculate deltas
        let hidden_T = Matrix.transpose(this.hidden_layers[this.hidden_layers.length - 1].outputs);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T)
        // adjust the weights by deltas
        this.output_layer.weights.add(weight_ho_deltas)
        // adjust the biases by deltas (which is just the gradients);
        this.output_layer.biases.add(gradients);

        // output_errors.print()


        // let last_layer_errors = this.output_layer.backward(output_errors)
        // console.log("LAST ERROS")
        // last_layer_errors.print();
        let last_layer = this.output_layer
        let last_errors = output_errors;
        for (let i = this.hidden_layers.length - 1; i >= 0; --i) {
            let layer = this.hidden_layers[i]
            last_errors = layer.backward(last_errors, last_layer, this.learning_rate)
            last_layer = layer
            last_errors = layer.errors
        }

    }

    trainInBactch(inputs_batch, targets_batch) {

        let output_errors = new Matrix(this.output_layer.layer_nodes, 1)

        for (let i = 0; i < inputs_batch.length; ++i) {
            let inputs = inputs_batch[i]
            if (!(inputs instanceof Matrix)) {
                inputs = Matrix.createFromArray(inputs);
            } else {
                inputs = inputs_batch.data[i]
            }

            this.predict(inputs);
            // targets
            let targets = Matrix.createFromArray(targets_batch[i]);
            // error is really just 'answer - guess'
            output_errors.add(Matrix.subtract(targets, this.output_layer.outputs))
        }

        // I DON'T KNOW WHY, PERHAPS COS THE ERRORS ARE MUCH BIGGER, BUT IT SEEMS LKE THE NEURAL NET 
        // LERNS FASTER IF WE LEAVE THE ERRORS AS JUST A SUM, NOT THE AVERAGE
        // convert to average Error
        /*     output_errors.map((value) => {
                return value / inputs_batch.length
            }) */


        // square it?
        output_errors.map((value) => {
            return value
        })

        // calculate gradients
        let output_Activation = Activation.nameMap(this.output_layer.Activation)
        let gradients = Matrix.map(this.output_layer.outputs, output_Activation.backward)
        gradients.multiply(output_errors)
        gradients.multiply(this.learning_rate)

        // calculate deltas
        let hidden_T = Matrix.transpose(this.hidden_layers[this.hidden_layers.length - 1].outputs);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T)
        // adjust the weights by deltas
        this.output_layer.weights.add(weight_ho_deltas)
        // adjust the biases by deltas (which is just the gradients);
        this.output_layer.biases.add(gradients);

        // output_errors.print()


        // let last_layer_errors = this.output_layer.backward(output_errors)
        // console.log("LAST ERROS")
        // last_layer_errors.print();
        let last_layer = this.output_layer
        let last_errors = output_errors;
        for (let i = this.hidden_layers.length - 1; i >= 0; --i) {
            let layer = this.hidden_layers[i]
            last_errors = layer.backward(last_errors, last_layer, this.learning_rate)
            last_layer = layer
            last_errors = layer.errors
        }
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.output_layer = NeuralNetwork.layer_dense.deserialize(data.output_layer)
        for (let i = 0; i < data.hidden_layers.length; ++i) {
            let hidden_layer = data.hidden_layers[i];
            nn.hidden_layers[i] = NeuralNetwork.layer_dense.deserialize(hidden_layer)
        }
        nn.learning_rate = data.learning_rate
        return nn;
    }

    getCopy() {
        return NeuralNetwork.deserialize(this.serialize());
    }

    copy(nn) {
        if (nn instanceof NeuralNetwork) {
            this.input_nodes = nn.input_nodes;
            this.hidden_nodes = nn.hidden_nodes;
            this.output_nodes = nn.output_nodes;

            this.learning_rate = nn.learning_rate

            this.output_layer = nn.output_layer.getCopy();
            this.hidden_layers.length = 0;
            for (let hidden_layer of nn.hidden_layers) {
                this.hidden_layers.push(hidden_layer.getCopy())
            }
        }
    }

    // Accept an arbitrary function for mutation
    mutate(rate, degree, reset = false) {
        function mutation(value) {
            if (randomNumber(0, 1, true) <= rate * 0.01) {
                if (reset) {
                    return randomNumber(-degree, degree);
                }
                return value + randomNumber(-degree, degree);
            } else {
                return value;
            }
        }
        this.output_layer.weights.map(mutation)
        this.output_layer.biases.map(mutation)
        for (let layer of this.hidden_layers) {
            layer.weights.map(mutation)
            layer.biases.map(mutation)
        }
    }
}

class nNeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.dampenOutputGradients = false;
        this.hidden_layers = new Array();
        this.output_layer;

        if (hidden_nodes instanceof Array) {
            let previous_layer_nodes = input_nodes
            for (let i = 0; i < hidden_nodes.length; ++i) {
                let hidden_layer_nodes = hidden_nodes[i];
                let new_hidden_layer = new NeuralNetwork.layer_dense(previous_layer_nodes, hidden_layer_nodes)
                this.hidden_layers.push(new_hidden_layer)
                previous_layer_nodes = hidden_layer_nodes
            }
            this.output_layer = new NeuralNetwork.layer_dense(this.hidden_nodes[this.hidden_nodes.length - 1], this.output_nodes)
        } else {
            this.hidden_layers.push(
                new NeuralNetwork.layer_dense(input_nodes, hidden_nodes)
            )
            this.output_layer = new NeuralNetwork.layer_dense(this.hidden_nodes, this.output_nodes)
        }

        this.learning_rate = 0.1;
    }

    setHiddenLayerActivationFunction(activation) {
        for (let layer of this.hidden_layers) {
            layer.Activation = activation;
        }
    }

    static layer_dense = class {
        constructor(input_nodes, layer_nodes) {
            this.input_nodes = input_nodes;
            this.layer_nodes = layer_nodes

            // each row of the weight matrix is respoinsible for a single newron, and each value of that row (array) is a weight connectiong the inputs or neurons form the previous layer to this layer
            this.weights = new Matrix(this.layer_nodes, this.input_nodes);
            this.weights.randomize(-1, 1)
            this.biases = new Matrix(this.layer_nodes, 1);
            this.biases.randomize(-1, 1);

            this.Activation = "sigmoid";
            this.inputs;
            this.outputs;
            this.errors;
        }
        getCopy() {
            return NeuralNetwork.layer_dense.deserialize(this.serialize());
        }
        serialize() {
            return JSON.stringify(this);
        }
        static deserialize(data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            let layer = new NeuralNetwork.layer_dense(data.input_nodes, data.layer_nodes)
            layer.weights = Matrix.deserialize(data.weights)
            layer.biases = Matrix.deserialize(data.biases)
            layer.network = data.network
            layer.inputs = data.inputs
            layer.outputs = data.outputs
            layer.errors = data.errors
            layer.Activation = data.Activation
            return layer
        }
        forward(inputs) {
            if (!(inputs instanceof Matrix)) {
                inputs = Matrix.createFromArray(inputs);
            }

            // the inputs multiplied by the weights
            this.outputs = Matrix.multiply(this.weights, inputs);
            // then we add the biases
            this.outputs = Matrix.add(this.outputs, this.biases)

            let activation = Activation.nameMap(this.Activation)
            // finally our activation function
            this.outputs.map(activation.forward)
            this.inputs = inputs;
            return this.outputs.toArray(Matrix.rowWise);
        }
        backward(next_layer_errors, previous_layer, learning_rate = 0.1) {
            let outputs = this.outputs;
            let inputs = this.inputs;

            let activation = Activation.nameMap(this.Activation)
            // calculate the error
            let weights_T = Matrix.transpose(previous_layer.weights);
            let layer_errors = Matrix.multiply(weights_T, next_layer_errors)
            this.errors = layer_errors


            // calculate the gradient
            let gradients = Matrix.map(outputs, activation.backward);
            gradients.multiply(layer_errors);
            gradients.multiply(learning_rate)

            // update the weights and biases
            let inputs_T = Matrix.transpose(inputs);
            let weight_deltas = Matrix.multiply(gradients, inputs_T)
            this.weights.add(weight_deltas)
            this.biases.add(gradients)

            return layer_errors
        }
    }

    predict(input) {
        if (!(input instanceof Matrix)) {
            input = Matrix.createFromArray(input);
        }

        let first_layer = this.hidden_layers[0]
        first_layer.forward(input)
        let last_layer_output = first_layer.outputs

        for (let l = 1; l < this.hidden_layers.length; ++l) {
            let layer = this.hidden_layers[l]
            layer.forward(last_layer_output)
            last_layer_output = layer.outputs
        }
        return this.output_layer.forward(last_layer_output)
    }

    train(input_array, targets_array) {
        let inputs = null
        if (!(input_array instanceof Matrix)) {
            inputs = Matrix.createFromArray(input_array);
        } else {
            inputs = input_array
        }

        this.predict(inputs);
        // targets
        let targets = Matrix.createFromArray(targets_array);
        // error is really just 'answer - guess'
        let output_errors = Matrix.subtract(targets, this.output_layer.outputs)
        output_errors.map((value) => {
            return value
        })

        // calculate gradients
        let output_Activation = Activation.nameMap(this.output_layer.Activation)
        let gradients = Matrix.map(this.output_layer.outputs, output_Activation.backward)
        gradients.multiply(output_errors)
        if (this.dampenOutputGradients) {
            gradients.multiply(this.learning_rate * 0.01)
        } else {
            gradients.multiply(this.learning_rate)
        }

        // calculate deltas
        let hidden_T = Matrix.transpose(this.hidden_layers[this.hidden_layers.length - 1].outputs);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T)
        // adjust the weights by deltas
        this.output_layer.weights.add(weight_ho_deltas)
        // adjust the biases by deltas (which is just the gradients);
        this.output_layer.biases.add(gradients);

        // output_errors.print()


        // let last_layer_errors = this.output_layer.backward(output_errors)
        // console.log("LAST ERROS")
        // last_layer_errors.print();
        let last_layer = this.output_layer
        let last_errors = output_errors;
        for (let i = this.hidden_layers.length - 1; i >= 0; --i) {
            let layer = this.hidden_layers[i]
            last_errors = layer.backward(last_errors, last_layer, this.learning_rate)
            last_layer = layer
            last_errors = layer.errors
        }

    }

    trainInBactch(inputs_batch, targets_batch) {

        let output_errors = new Matrix(this.output_layer.layer_nodes, 1)

        for (let i = 0; i < inputs_batch.length; ++i) {
            let inputs = inputs_batch[i]
            if (!(inputs instanceof Matrix)) {
                inputs = Matrix.createFromArray(inputs);
            } else {
                inputs = inputs_batch.data[i]
            }

            this.predict(inputs);
            // targets
            let targets = Matrix.createFromArray(targets_batch[i]);
            // error is really just 'answer - guess'
            output_errors.add(Matrix.subtract(targets, this.output_layer.outputs))
        }

        // I DON'T KNOW WHY, PERHAPS COS THE ERRORS ARE MUCH BIGGER, BUT IT SEEMS LKE THE NEURAL NET 
        // LERNS FASTER IF WE LEAVE THE ERRORS AS JUST A SUM, NOT THE AVERAGE
        // convert to average Error
        /*     output_errors.map((value) => {
                return value / inputs_batch.length
            }) */


        // square it?
        output_errors.map((value) => {
            return value
        })

        // calculate gradients
        let output_Activation = Activation.nameMap(this.output_layer.Activation)
        let gradients = Matrix.map(this.output_layer.outputs, output_Activation.backward)
        gradients.multiply(output_errors)
        gradients.multiply(this.learning_rate)

        // calculate deltas
        let hidden_T = Matrix.transpose(this.hidden_layers[this.hidden_layers.length - 1].outputs);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T)
        // adjust the weights by deltas
        this.output_layer.weights.add(weight_ho_deltas)
        // adjust the biases by deltas (which is just the gradients);
        this.output_layer.biases.add(gradients);

        // output_errors.print()


        // let last_layer_errors = this.output_layer.backward(output_errors)
        // console.log("LAST ERROS")
        // last_layer_errors.print();
        let last_layer = this.output_layer
        let last_errors = output_errors;
        for (let i = this.hidden_layers.length - 1; i >= 0; --i) {
            let layer = this.hidden_layers[i]
            last_errors = layer.backward(last_errors, last_layer, this.learning_rate)
            last_layer = layer
            last_errors = layer.errors
        }
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.output_layer = NeuralNetwork.layer_dense.deserialize(data.output_layer)
        for (let i = 0; i < data.hidden_layers.length; ++i) {
            let hidden_layer = data.hidden_layers[i];
            nn.hidden_layers[i] = NeuralNetwork.layer_dense.deserialize(hidden_layer)
        }
        nn.learning_rate = data.learning_rate
        return nn;
    }

    getCopy() {
        return NeuralNetwork.deserialize(this.serialize());
    }

    copy(nn) {
        if (nn instanceof NeuralNetwork) {
            this.input_nodes = nn.input_nodes;
            this.hidden_nodes = nn.hidden_nodes;
            this.output_nodes = nn.output_nodes;

            this.learning_rate = nn.learning_rate

            this.output_layer = nn.output_layer.getCopy();
            this.hidden_layers.length = 0;
            for (let hidden_layer of nn.hidden_layers) {
                this.hidden_layers.push(hidden_layer.getCopy())
            }
        }
    }

    // Accept an arbitrary function for mutation
    mutate(rate, degree, reset = false) {
        function mutation(value) {
            if (randomNumber(0, 1, true) <= rate * 0.01) {
                if (reset) {
                    return randomNumber(-degree, degree);
                }
                return value + randomNumber(-degree, degree);
            } else {
                return value;
            }
        }
        this.output_layer.weights.map(mutation)
        this.output_layer.biases.map(mutation)
        for (let layer of this.hidden_layers) {
            layer.weights.map(mutation)
            layer.biases.map(mutation)
        }
    }
}



"use strict" // Genetic_Algorithms

class geneticInformation {
    constructor(score, fitness, brain) {
        this.score = score;
        this.fitness = fitness;
        this.brain = brain;
        this.ID = generateRandomId();
        this.isBestAgent = false;
        this.bestAgentGenes = 0;
        this.rank = "unDetermined";
    }
    addToScore(value){
        this.score += value;
    }
}

class NeuroEvolution {
    constructor(initialNeuralNetworkModel, populationSize = 100) {
        this.populationSize = populationSize;
        this.generation = 1;
        if(initialNeuralNetworkModel instanceof Array){
            initialNeuralNetworkModel = new NeuralNetwork(initialNeuralNetworkModel[0], initialNeuralNetworkModel[1], initialNeuralNetworkModel[2])
            initialNeuralNetworkModel.setHiddenLayerActivationFunction("leakyReLU")
            initialNeuralNetworkModel.output_layer.Activation = "linear"
        }
        this.initialNeuralNetworkModel = initialNeuralNetworkModel;

        this.crossover = true

        this.mutation = true;
        this.mutationRate = 1;
        this.mutationDegree = 1;
        this.isResetMutation = false;

        this.agentName = "auto"
        this.logGenInfoToConsole = true;

        this.generationalData = new Array();
        this.recordGenerationData = true;

        this.updateRanks = true
        this.currentGenerationBestAgent = null;
        this.currentGenerationWorstAgent = null;
    }

    init(agents, exactCopyOfInitialBrain = false) {
        for (let agent of agents) {
            let simlarBrain = this.initialNeuralNetworkModel.getCopy()
            if(!exactCopyOfInitialBrain){
                simlarBrain.mutate(100, 1, true);
            }
            agent.geneticInformation = new geneticInformation(0, 0, simlarBrain)
        }
    }

    updateCurrentGanerationData(agents) {
        let fitnessSum = 0;
        let scoreSum = 0;
        let bestAgent = null
        let worstAgent = null
        for (let agent of agents) {
            agent.geneticInformation.fitness = this.scoreToFitnessMapping(agent.geneticInformation.score)
            fitnessSum += agent.geneticInformation.fitness;
            scoreSum += agent.geneticInformation.score;
            agent.geneticInformation.isBestAgent = false
            if (bestAgent == null) {
                bestAgent = agent
            } else {
                if (agent.geneticInformation.fitness > bestAgent.geneticInformation.fitness) {
                    bestAgent = agent
                }
            }
            if (worstAgent == null) {
                worstAgent = agent
            } else {
                if (agent.geneticInformation.fitness < worstAgent.geneticInformation.fitness) {
                    worstAgent = agent
                }
            }
        }
        bestAgent.geneticInformation.isBestAgent = true
        this.currentGenerationBestAgent = bestAgent
        this.currentGenerationWorstAgent = worstAgent

        // console.log(bestAgent.geneticInformation.fitness)
        return {
            fitnessSum: fitnessSum,
            scoreSum: scoreSum,
            bestAgent: bestAgent,
            worstAgent: worstAgent,
        }
    }

    nextGeneration(agents, autoUpdate = false) {
        if (this.populationSize != agents.length) {
            console.error("Genetic Algorithm Error: amount of agents passed to 'NeuroEvolution.nextGeneration' does not match NeuroEvolution.populationSize. Consider checking ths 'agents' array passed or update NeuroEvolution.populationSize")
            return;
        }
        // let oldIB =agents[0].geneticInformation.ID
        let fitnessInfo = this.calculateFitness(agents);
        // console.log("resorted:", oldIB == agents[0].geneticInformation.ID)
        let bestAgentAsParent = 0
        let bestAgentAsSingleParent = 0


        let newGenetics = new Array();
        for (let i = 0; i < this.populationSize; ++i) {
            // yo let's some secret agents to mate and produce a baby secret agent....muahahahaha
            let agent_parent1 = NeuroEvolution.selectAgent(agents)
            let agent_parent2 = NeuroEvolution.selectAgent(agents)
            let newBrain;

            // some weird genetic stuffs going on here...NEAY huh...

            // crossover or no crossover?
            if (this.crossover || (agent_parent1.geneticInformation.ID != agent_parent2.geneticInformation.ID)) {
                newBrain = NeuroEvolution.crossOver(agent_parent1, agent_parent2,
                    100 * (agent_parent1.geneticInformation.fitness / (agent_parent1.geneticInformation.fitness + agent_parent2.geneticInformation.fitness)))
            } else {
                if (chance(100 * (agent_parent1.geneticInformation.fitness / (agent_parent1.geneticInformation.fitness + agent_parent2.geneticInformation.fitness)))) {
                    newBrain = agent_parent1.geneticInformation.brain.getCopy()
                } else {
                    newBrain = agent_parent2.geneticInformation.brain.getCopy()
                }
            }

            // mutation? probably should
            if (this.mutation) {
                newBrain.mutate(this.mutationRate, this.mutationDegree, this.isResetMutation);
            }
            // newBrain.setHiddenLayerActivationFunction(Activation.leakyReLU)
            // newBrain.output_layer.Activation = Activation.linear

            let genetics = new geneticInformation(0, 0, newBrain)

            genetics.bestAgentGenes = (agent_parent1.geneticInformation.ID == fitnessInfo.bestAgent.geneticInformation.ID) + (agent_parent2.geneticInformation.ID == fitnessInfo.bestAgent.geneticInformation.ID)
            // feeling like a mad scientist...? Y'know...merging brains and all...
            if (genetics.bestAgentGenes == 1) {
                bestAgentAsParent++
            } else if (genetics.bestAgentGenes == 2) {
                bestAgentAsSingleParent++
            }

            newGenetics.push(genetics)
            if (autoUpdate) {
                agents[i].geneticInformation = genetics
            }
        }

        // cos I'm a control freak...
        //               ...not really, hahaha..ha..mmmmMmm
        let averageFitxness = fitnessInfo.fitnessSum / agents.length;
        let averageScore = fitnessInfo.scoreSum / agents.length


        // TODO: add generation data to this.generationalData
        if (this.recordGenerationData) {
            let generationData = {
                generation: this.generation,
                populationSize: this.populationSize,
                averageFitxness: averageFitxness,
                averageScore: averageScore,
                bestAgent: fitnessInfo.bestAgent,
                worstAgent: fitnessInfo.worstAgent,
            }
            this.generationalData[this.generation] = generationData;
        }
        if (this.logGenInfoToConsole) {
            let secondDashes = "-----------"
            secondDashes = secondDashes.substring(this.generation.toString().length - 1)
            console.log("<----------- Gen: |", this.generation, "| " + secondDashes + ">")
            console.log("Average FItness:", toDecimalPlace(averageFitxness, 2))
            console.log("Average Score:", toDecimalPlace(averageScore, 2))
            let agentName;
            if (this.agentName) {
                agentName = this.agentName
                if (this.agentName == "auto") {
                    agentName = getConstructorName(agents[0])
                }
            }
            console.log("Best " + agentName + " score: ", toDecimalPlace(fitnessInfo.bestAgent.geneticInformation.score, 2))
            console.log("Worst " + agentName + " score: ", toDecimalPlace(fitnessInfo.worstAgent.geneticInformation.score, 2))
            console.log("New Agents with best Agent genes:", bestAgentAsParent, toDecimalPlace((bestAgentAsParent / agents.length) * 100, 2) + "%")
            console.log("New Agents with double best Agent genes:", bestAgentAsSingleParent, toDecimalPlace((bestAgentAsSingleParent / agents.length) * 100, 2) + "%")
        }
        ++this.generation
        return newGenetics;
    }

    scoreToFitnessMapping(score) {
        return (score) ** 3;
        // return (score*0.01) ** 3;
    }

    calculateFitness(agents) {
        let fitnessSum = 0;
        let scoreSum = 0;
        let bestAgent = null
        let worstAgent = null
        let index = 0


        for (let agent of agents) {
            if(this.updateRanks){
                agent.geneticInformation.i = index
                ++index
            }
            // calculate and setFitness Values
            agent.geneticInformation.fitness = this.scoreToFitnessMapping(agent.geneticInformation.score)
            // get fitness sum and normalize fitness
            fitnessSum += agent.geneticInformation.fitness;

            // extra stuff
            scoreSum += agent.geneticInformation.score;
            if (bestAgent == null) {
                bestAgent = agent
            } else {
                if (agent.geneticInformation.fitness > bestAgent.geneticInformation.fitness) {
                    bestAgent = agent
                }
            }
            if (worstAgent == null) {
                worstAgent = agent
            } else {
                if (agent.geneticInformation.fitness < worstAgent.geneticInformation.fitness) {
                    worstAgent = agent
                }
            }
            agent.geneticInformation.isBestAgent = false;
        }
        bestAgent.geneticInformation.isBestAgent = true;


        if (this.updateRanks) {
            let savedAgents = new Array(agents.length)
            for (let i = 0; i < agents.length; ++i) {
                savedAgents[i] = agents[i]
            }
            let sortedAgents = savedAgents.sort((agent) => {
                return -agent.geneticInformation.fitness
            })
            for (let a = 0; a < sortedAgents.length; ++a) {
                let agent = sortedAgents[a]
                agent.geneticInformation.rank = a;
                delete agent.geneticInformation.i
            }
        }


        // normalizeing the fitness...and other stuff
        arrUtils.map(agents, (agent) => {
            agent.geneticInformation.fitness = agent.geneticInformation.fitness / fitnessSum
        })
        return {
            agents: agents,
            fitnessSum: fitnessSum,
            scoreSum: scoreSum,
            bestAgent: bestAgent,
            worstAgent: worstAgent,
        }
    }

    static selectAgent(agents) {
        let index = 0;
        let picker = randomNumber(0, 1);
        let currentSum = 0;

        for (let i = 0; i < agents.length; ++i) {
            let agent = agents[i]
            currentSum += agent.geneticInformation.fitness
            if (currentSum > picker) {
                index = i
                break;
            }
        }

        let agent = agents[index]
        return agent;
    }


    static crossOver(agent1, agent2) {
        let brain1 = agent1.geneticInformation.brain;
        let brain2 = agent2.geneticInformation.brain;
        let mixBrain = new NeuralNetwork(brain1.input_nodes, brain1.hidden_nodes, brain1.output_nodes);
        let mixBrainLayers = (brain1_layer, brain2_layer, percentageChanceForLayer1 = 50) => {
            let mixLayer = brain1_layer.getCopy(); // I'm gonna change all its values anyway
            // let mixLayer = new NeuralNetwork.layer_dense(brain1_layer.input_nodes, brain1_layer.layer_nodes)
            // probabilty of gene (weight or bias) being from brain1_layer
            let prob = percentageChanceForLayer1
            mixLayer.weights.map((value, i, j) => {
                if (chance(prob)) {
                    return brain1_layer.weights.data[i][j]
                } else {
                    return brain2_layer.weights.data[i][j]
                }
            })
            mixLayer.biases.map((value, i, j) => {
                if (chance(prob)) {
                    return brain1_layer.biases.data[i][j]
                } else {
                    return brain2_layer.biases.data[i][j]
                }
            })
            return mixLayer
        }
        mixBrain.output_layer = mixBrainLayers(brain1.output_layer, brain2.output_layer)
        for (let i = 0; i < mixBrain.hidden_layers.length; ++i) {
            mixBrain.hidden_layers[i] = mixBrainLayers(brain1.hidden_layers[i], brain2.hidden_layers[i])
        }
        return mixBrain
    }
}



"use strict"; // Special_Objects

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
	constructor(x = c.xc, y = c.yc, width = c.w, height = c.h, text = "TextBox", fontSize = 25, textAlignment = "left") {
		super(x, y, width, height);
		this.text = text;
		this.textPadding = this.width * 0.1
		this.fontSize = fontSize;
		this.fontWeight = 500;
		this.color = "white"
		this.fontStyle = "Arial";
		this.textColor = "white";
		this.alignment = textAlignment
		this.angle = 0
		this.renderBackground = true
		this.backgroundColor = "grey"
		this.borderColor = "white"
		this.borderWidth = this.width * 0.01

		let textbox = this
		this.automizer = {
			active: false,
			renderingText: textbox.text,
			renderedText: "",
			currCharIndex: 0,
			letterDelay: 0.1,
			currentDelayTime: 0.1,
			charTimer: 0,
			speedMultiplier: 1,
			decodingInfo: false,
			audioID: null,
			playAudio: false,
			audioManager: null,
			charTimeMap: {
				",": 0.4,
				" ": 0.1,
			},
			setAudioManager(audioManager) {
				this.audioManager = audioManager;
			},
			refreshText() {
				this.renderingText = textbox.text
			},
			parseEmbeddedInfo(embeddedInfo = "||") {
				this.decodingInfo = false
				let info = embeddedInfo.substring(1, embeddedInfo.length - 1)
				let exclaimIndex = embeddedInfo.indexOf("!")
				let infoValue = embeddedInfo.substring(1, exclaimIndex)
				let infoType = embeddedInfo.substring(exclaimIndex, embeddedInfo.length - 1)

				if (infoType == "!d") {
					let delay = parseFloat(infoValue)
					this.currentDelayTime = delay
				} else if (infoType == "!m") {
					let speed = parseFloat(infoValue)
					this.speedMultiplier = speed
				}
			},
			update(deltatime = Caldro.time.deltatime) {
				this.charTimer += deltatime;

				if (this.currCharIndex < this.renderingText.length) {
					let currChar = this.renderingText[this.currCharIndex];

					if (currChar === "|") {
						this.decodingInfo = true
					}
					if (this.decodingInfo) {
						let info = ""
						let h = this.currCharIndex
						let couldDecode = false
						for (let i = this.currCharIndex; i < this.renderingText.length; ++i) {
							info += currChar
							this.currCharIndex++
							currChar = this.renderingText[this.currCharIndex];
							if (currChar == "|") {
								couldDecode = true;
								info += currChar
								this.currCharIndex++
								this.parseEmbeddedInfo(info)
								break;
							}
						}
						if (!couldDecode) {
							console.error("Textbox Automator Error: A || embedded instruction in the given text is missing a closing |")
						}
					}

					currChar = this.renderingText[this.currCharIndex];

					if (this.currentDelayTime < this.charTimer) {
						this.charTimer = 0;

						currChar = this.renderingText[this.currCharIndex];
						this.renderedText += currChar;
						if (this.playAudio) {
							if (this.audioManager) {
								// this.audioManager.stop(this.audioID)
								let audio = this.audioManager.get(this.audioID, true, true)
								audio.setPlaybackRate(randomNumber(0.5, 1.5))
								audio.play();
								// this.audioManager.play(this.audioID, true)
							} else {
								console.error("Text automator error: An audio manger has not been defined to play a sound on Text update")
							}
						}


						let nextChar = this.renderingText[this.currCharIndex + 1]
						if (this.charTimeMap[nextChar]) {
							this.currentDelayTime = this.charTimeMap[nextChar]
						} else {
							this.currentDelayTime = this.letterDelay;
						}

						this.currentDelayTime /= this.speedMultiplier
						this.currCharIndex++
					}



					// console.log("at end Decode", currChar, this.currCharIndex)

				}
			}
		}
	}
	render() {
		let font = this.fontWeight + " " + this.fontSize + "px " + this.fontStyle
		let textX = this.x
		if (this.alignment == 'left') {
			textX = this.x - this.width / 2 + this.textPadding
		} else if (this.alignment == "right") {
			textX = this.x + this.width / 2 - this.textPadding
		}
		let textY = this.y - this.height / 2 + this.textPadding
		let maxWidth = this.width - this.textPadding * 2


		if (this.renderBackground) {
			curvedRect(this.x, this.y, this.width, this.height, this.backgroundColor, this.angle, this.width * 0.05)
			stCurvedRect(this.x, this.y, this.width, this.height, this.borderColor, this.angle, this.width * 0.05, this.borderWidth)
		}

		cc.save();
		cc.translate(this.x, this.y);
		cc.rotate(degToRad(this.angle));
		textX -= this.x; textY -= this.y
		// circle(textX - this.x, textY - this.y, 10, "blue")
		if (this.automizer.active) {
			this.automizer.update();
			wrapText(this.automizer.renderedText, textX, textY, maxWidth, this.fontSize, this.color, font, 0, this.alignment)
		} else {
			wrapText(this.text, textX, textY, maxWidth, this.fontSize, this.color, font, 0, this.alignment)
		}
		cc.restore()
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
		this.growthSpeed = 30
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
	show() {
		this.update();
		this.render();
	}
	update() {
		let context = Caldro.renderer.context;
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
			this.width = width;
			// this.width = approach(this.width, width, this.growthSpeed).value;
		} else {
			this.width = context.measureText(this.title).width;;
		};
		this.width += this.margin * 2;
		// this.height = ((this.fontSize * 1.3 + this.lineSpace) * this.info.length) / 2
		this.height = approach(this.height, ((this.fontSize * 1.3 + this.lineSpace) * this.info.length) / 2, this.growthSpeed).value;
		// context = null;
	}
	render() {
		let context = Caldro.renderer.context;
		context.save();
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
		context.restore();
	}
}

// [I/D]
class sineOscilator {
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
	constructor(target, radius, speed, direction = 1) {
		this.x = target.x;
		this.y = target.y;
		this.target = target;
		this.radius = radius;
		this.speed = speed;
		this.angle = 0;
		this.direction = direction;
		// this.mode = 'rotating';
		this.setTarget = function (target) {
			this.target = target
		}
		this.update = function (deltatime) {
			this.angle += this.speed * deltatime;
			let angle = degToRad(this.angle)
			this.x = this.target.x + ((Math.cos(angle)) * this.radius) * this.direction
			this.y = this.target.y + ((Math.sin(angle)) * this.radius) * this.direction
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
	start() { }
	effect() { }
	end() { }
	callback() { }
	drawing() { }
	check(a) {
		this.activated = collided(this, a, 'aabb');
		if (this.active && this.activated) {
			if (this.executeOnStart) {
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
	render() {
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
	constructor(name = "timer") {
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
		if (this.paused) {
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
		this.lastClickTime = -Infinity;
		this.delay = 0;
		this.active = true;
		this.clickable = true;
		this.visible = true;
		this.selected = false;
		this.touchPoint = null;
		this.fontSize = 30;
		this.borderRadius = 20;
		this.drawingStyle = 1;
		this.data = [];
		this.hoverEffect = function(){};
		this.setFontSize = function () {
			//return font((cc.measureText(this.text).width)*(1/this.width)
			//cc.lineHeight = this.height*0.7
			let size = this.width * (10 / (cc.measureText(this.text).width));
			return font(size);
		};

		this.show = function () {
			if (this.drawingStyle == 1) {
				Rect(this.x, this.y, this.width, this.height, this.color);
				txt(this.text, this.x, this.y, font(this.fontSize), this.textColor);
				if (!this.active) {
					Rect(this.x, this.y, this.width, this.height, "rgba(50, 50, 50, 0.5");
				}
			} else if (this.drawingStyle == 2) {
				curvedRect(this.x, this.y, this.width, this.height, this.color, 0, this.borderRadius);
				stCurvedRect(this.x, this.y, this.width, this.height, this.strokeColor, 0, this.borderRadius, this.lineWidth);
				txt(this.text, this.x, this.y, font(this.fontSize), this.textColor);
				if (!this.active) {
					curvedRect(this.x, this.y, this.width, this.height, 'rgba(50,50,50,0.5)', 0, this.borderRadius);
					stCurvedRect(this.x, this.y, this.width, this.height, 'rgba(50,50,50,0.5)', 0, this.borderRadius, this.lineWidth);
				}
			}
		};

		this.render = function () {
			if (this.visible == true) {
				if (this.drawingStyle == 3) {
					this.drawing();
				} else {
					this.show();
				}
				this.callback();
			}
		};

		this.listen = function (point) {
			if (this.active && !this.selected && this.clickable) {
				if (pointIsIn(point, this)) {
					this.onclick();
					this.touchPoint = point;
					this.selected = true;
					++this.clicks;
					this.lastClickTime = performance.now();
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
					this.lastClickTime = performance.now();
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
	}
}

const buttonHandler = {
	buttons: new Array(),
	active: true,
	updateButtons() { }
}

// [SID]
class particle {
	constructor(x, y, xv, yv, size, colors = "white", timer = null, renderingFunction = 'box', decayStyle = 'shrink') {
		this.particleSystem = null;
		this.timer = timer;
		this.lifeTime = 0;
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
		this.glow = 0;
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
		if (this.decayStyle) {
			if (typeof this.decayStyle == "function") {
				let time = this.lifeTime / this.originalState.timer
				this.decayStyle(this, time)
			} else {
				if (this.decayStyle.includes('shrink')) {
					this.originalState.size -= sizeChange
					this.size = limit(this.originalState.size * this.sizeChangeMultiplier, 0)
				} else if (this.decayStyle.includes("grow")) {
					this.originalState.size += sizeChange
					this.size = limit(this.originalState.size * this.sizeChangeMultiplier, 0);
				}
				if (this.decayStyle.includes('fadeout')) {
					if (this.timer) {
						this.alpha = scaleTo(this.timer, 0, this.originalState.timer, 0, 1);
					}
				}
			}
		}
		this.callback();
	}
	getUnitTime() {
		return this.lifeTime / this.originalState.timer;
	}

	render() {
		cc.save();
		if (this.glow > 0) {
			glow(this.glow, this.color);
		}
		alpha(this.alpha)
		// alert(this.y)
		if (typeof this.renderingFunction == 'function') {
			this.renderingFunction(this);
		} else if (this.renderingFunction == 'box') {
			Rect(this.x, this.y, this.size, this.size, this.color, this.angle);
		} else if (this.renderingFunction.includes('cir')) {
			circle(this.x, this.y, this.size / 2, this.color);
		} else if (this.renderingFunction.includes('line')) {
			line(this.x, this.y, this.x + this.xv * this.size, this.y + this.yv * this.size, this.color, this.lineWidth);
		} else {
			Rect(this.x, this.y, 50, 50, 'darkblue');
		}
		alpha(1)
		glow(0);
		cc.restore();
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
		this.paused = false;
		this.sizeChangeMultiplier = 1
		this.individualParticleModification = NULLFUNCTION;
	}
	addParticle(particle) {
		this.particles_Array.push(particle)
		++this.createdParticles;
	}

	createParticle(x, y, xv, yv, size, colors = ['white'], timer = null, renderingFunction = 'box', decayStyle = 'shrink') {
		let _particle = new particle(x, y, xv, yv, size, colors, timer, renderingFunction, decayStyle)
		_particle.particleSystem = this;
		_particle.sizeChangeMultiplier = this.sizeChangeMultiplier;
		return _particle;
	};


	particleSource(x, y, width = 1, height = 1, xv = [0, 0], yv = [0, 0], forces = [[0, 0], [0, 0]], size = 20, colors = 'white', outputRate = 1, timer = 1, renderingFunction = 'box', decayStyle = 'fadeout', perParticleMainupulation = NULLFUNCTION) {
		if (this.shouldCreateParticles && this.active && !this.paused) {
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
				if (forces == null || forces == 0) {
					forces = [0, 0]
				} else if (typeof forces[0] == "number") {
					particle.outsideForce = forces;
				} else if (typeof forces[0] == "object") {
					particle.outsideForce = forces[0]
					if (forces[1]) {
						particle.friction = forces[1]
					}
				}
				perParticleMainupulation(particle)
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
				if (update && !this.paused) {
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

	pause() {
		this.paused = true;
	}

	resume() {
		this.paused = false;
	}

	removeParticle(particle) {
		particle.toDelete = true;
	}

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
	constructor(canvas = c) {
		this.x = 0;
		this.y = 0;
		this.width = canvas.width;
		this.height = canvas.height;
		this.aabb = new classicAABB(this.x-this.width*0.5, this.y-this.height*0.5, this.x+this.width*0.5, this.y+this.height*0.5)
		this.inWorldBounds = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
		}
		this.target = {
			position: new Point2D(0, 0),
			zoom: 1,
			trackingSpeed: new Point2D(3, 3),
			offsetTrackingSpeed: new Point2D(3, 3),
			zoomSpeed: 3,
			active: false,
			followX: true,
			followY: true,
			affectZoom: true,
			affectOffset: true,
			offset: {
				x: 0,
				y: 0,
			},
			setTrackingSpeed(x, y){
				if(x!=null)
				this.trackingSpeed.x = x
				if(y!=null)
				this.trackingSpeed.y = y
			},
			setTarget(target) {
				this.position.x = target.x
				this.position.y = target.y
			},
			setOffset(x, y) {
				this.offset.x = x;
				this.offset.y = y;
			},
		}
		this.zoom = 1;
		this.canvas = Caldro.renderer.canvas
		this.context = Caldro.renderer.context
		this.zoomSpeed = 3;
		this.zoomRatio = 446;
		this.adjustedZoom = 1;
		this.attachment = null;
		this.attached = false;
		this.capturing = false;
		this.autoUpdateAssignedCanvas = false;
		this.actualOffsetX = 0;
		this.actualOffsetY = 0;
		this.shakeOffsetX = 0;
		this.shakeOffsetY = 0;
		this.angle = 0;
		this.frame = 0;
		this.speed = 200;
		this.shakeOffsetResetFrequency = 20;
		this.lastOFfsetReset = 0;
		this.translationX = this.camtranslationX = 0;
		this.translationY = this.camtranslationY = 0;
		this.pointer = new Point2D();
		this.shakeResolutioinsSpeed = 100
		this.data = new Array();
		let thisCamera = this
		this.Frame = {
			visible: false,
			type: "fill",
			color: "black",
			visibleFrames: [1, 2, 3, 4],
			thickness: 10,
			lineWidth: 5,
			render() {
				if (!this.visible) return;
				let w = thisCamera.canvas.width;
				let h = thisCamera.canvas.height;
				let x = this.x;
				let y = this.y;
				let color = this.color
				let size = this.thickness * 2
				let lineWidth = this.lineWidth;
				if (this.type == "fill") {
					if (this.visibleFrames.includes(1)) {
						Rect(w / 2, 0 + size / 2, w, size, color)
					}
					if (this.visibleFrames.includes(2)) {
						Rect(0 + size / 2, h / 2, size, h, color)
					}
					if (this.visibleFrames.includes(3)) {
						Rect(w / 2, h - size / 2, w, size, color)
					}
					if (this.visibleFrames.includes(4)) {
						Rect(w - size / 2, h / 2, size, h, color)
					}
				} else if (this.type == "stroke") {
					if (this.visibleFrames.includes(1)) {
						stRect(w / 2, 0 + size / 2, w - size * 2, size, color, lineWidth)
					}
					if (this.visibleFrames.includes(2)) {
						stRect(0 + size / 2, h / 2, size, h, color, lineWidth)
					}
					if (this.visibleFrames.includes(3)) {
						stRect(w / 2, h - size / 2, w - size * 2, size, color, lineWidth)
					}
					if (this.visibleFrames.includes(4)) {
						stRect(w - size / 2, h / 2, size, h, color, lineWidth)
					}
				} else if (this.type == "" || this.type == "custom") {
					this.costumFrame(x, y, w, h, this.visibleFrames, this.color)
				}
			},
			costumFrame() { }
		}
	}

	getAABB(){
		this.aabb.min.x = this.x - this.width * 0.5
		this.aabb.max.x = this.x + this.width * 0.5
		this.aabb.min.y = this.y - this.height * 0.5
		this.aabb.max.y = this.y + this.height * 0.5
		return this.aabb
	}

	setZoom(zoom) {
		this.zoom = zoom;
		let c = getCanvasDimensions(this.canvas)
		this.width = c.w * (1 / this.zoom);
		this.height = c.h * (1 / this.zoom);
	}

	limitWithinBox(boundingBox) {
		if (this.x - this.width / 2 < boundingBox.x - boundingBox.width / 2) {
			this.x = boundingBox.x - boundingBox.width / 2 + this.width / 2
		} else if (this.x + this.width / 2 > boundingBox.x + boundingBox.width / 2) {
			this.x = boundingBox.x + boundingBox.width / 2 - this.width / 2
		}
		if (this.y - this.height / 2 < boundingBox.x - boundingBox.height / 2) {
			this.y = boundingBox.y - boundingBox.height / 2 + this.height / 2
		} else if (this.y + this.height / 2 > boundingBox.y + boundingBox.height / 2) {
			this.y = boundingBox.y + boundingBox.height / 2 - this.height / 2
		}
	}

	getBounds() {
		let cnv = getCanvasDimensions(this.canvas)
		this.width = cnv.w * (1 / this.zoom);
		this.height = cnv.h * (1 / this.zoom);
		return {
			top: this.y - this.height * 0.5,
			bottom: this.y + this.height * 0.5,
			left: this.x - this.width * 0.5,
			right: this.x + this.width * 0.5,
			width: this.width,
			height: this.height,
		}
	}

	setCanvas(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
	}

	persistStart() { };
	persistContinuous() { };
	enablePersistence(localStorageID) {
		this.persistStart = () => {
			if (this.frame === 0) {
				let posInfo = loadFromLocalStorage(localStorageID)
				if (posInfo) {
					posInfo = JSON.parse(posInfo)
					this.x = parseFloat(posInfo.x)
					this.y = parseFloat(posInfo.y)
					this.zoom = parseFloat(posInfo.zoom)
				}
			}
		}
		this.persistContinuous = () => {
			saveToLocalStorage(localStorageID, JSON.stringify({
				x: this.x, y: devCam.y, zoom: devCam.zoom
			}))
		}
	}

	mimicCamera(referrence_camera = this) {
		this.x = referrence_camera.x;
		this.y = referrence_camera.y;
		this.zoom = referrence_camera.zoom;
		this.actualOffsetX = referrence_camera.actualOffsetX;
		this.actualOffsetY = referrence_camera.actualOffsetY;
		this.angle = referrence_camera.angle;
	};

	showCamera(otherCamera) {
		if (otherCamera == this) {
			// Caldro.reportError("A camera cannot perform the operation 'showCamera' on itself", "SPECIAL OBJECT: camera", false)
		} else {
			otherCamera.update();
			otherCamera.resolve();
		}
		let bounds = otherCamera.getBounds();
		let x = -otherCamera.camtranslationX;
		let y = -otherCamera.camtranslationY;
		let cx = x + bounds.width / 2
		let cy = y + bounds.height / 2
		let width = bounds.width
		let height = bounds.height
		let angle = otherCamera.angle
		let lwNul = 1 / otherCamera.zoom
		cc.save();
		cc.rotate(degToRad(-angle))
		circle(x + width, y + height, 40 * lwNul, "red")
		alpha(0.05)
		strect(x, y, width, height, "white", 100 * lwNul)
		alpha(0.1)
		rect(x, y, width, height, "white")
		alpha(0.5)
		strect(x, y, width, height, "white", 5 * lwNul)
		alpha(0.3)
		circle(x, y, 50 * lwNul, "white")
		alpha(0.5)
		let lw = 100 * lwNul;
		let lh = 4 * lwNul;
		Rect(cx, cy, lw, lh, "white")
		Rect(cx, cy, lw, lh, "white", 90)
		cc.restore();
		alpha(1)
	}

	updatePointer(pointer) {
		let c = getCanvasDimensions(this.canvas)
		let magnificationX = ((c.w * (1 / this.adjustedZoom)) / c.w)
		let magnificationY = ((c.h * (1 / this.adjustedZoom)) / c.h)
		this.pointer.x = this.x + (pointer.x * magnificationX) - (c.hw * magnificationX)
		this.pointer.y = this.y + (pointer.y * magnificationY) - (c.hh * magnificationY)
		return new Point2D(this.pointer.x, this.pointer.y)
	}

	resetOffset(resetShakeOffset = true, resetActualOffset = false) {
		if (resetActualOffset) {
			this.actualOffsetX = this.actualOffsetY = 0;
		}
		if (resetShakeOffset) {
			this.shakeOffsetX = this.shakeOffsetY = 0;
		}
	};

	update(deltatime = Caldro.time.deltatime) {
		this.persistStart()
		if (this.autoUpdateAssignedCanvas) this.setCanvas(Caldro.renderer.canvas)
		this.pre_shot();

		if (this.target.active) {
			let speedX = this.target.trackingSpeed.x
			let speedY = this.target.trackingSpeed.y
			let targetZoom = this.target.zoom
			let targetPosition = this.target.position
			if (this.target.affectZoom)
				this.zoom = approach(this.zoom, targetZoom, this.target.zoomSpeed, deltatime).value
			if (this.target.followX)
				this.x = approach(this.x, targetPosition.x, speedX, deltatime).value
			if (this.target.followY)
				this.y = approach(this.y, targetPosition.y, speedY, deltatime).value
			if (this.target.affectOffset) {
				this.actualOffsetX = approach(this.actualOffsetX, this.target.offset.x, this.target.offsetTrackingSpeed.x, deltatime).value
				this.actualOffsetY = approach(this.actualOffsetY, this.target.offset.y, this.target.offsetTrackingSpeed.y, deltatime).value
			}
		}

		let c = getCanvasDimensions(this.canvas)
		let cc = this.context
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
		this.persistContinuous();
	};

	pre_shot() { };
	callback() { };
	post_shot() { };

	resolve() {
		let cc = this.context
		cc.restore();
		let lastOFfsetReset = performance.now() - this.lastOFfsetReset;
		if (this.shakeOffsetResetFrequency < lastOFfsetReset) {
			this.lastOFfsetReset = performance.now();
			this.shakeOffsetX += (-this.shakeOffsetX * 1.9)
			this.shakeOffsetY += (-this.shakeOffsetY * 1.9)
		}
		this.capturing = false
		this.post_shot();
		this.Frame.render();
	};

	setOffset(offsetX, offsetY) {
		if (offsetX != null) {
			this.actualOffsetX = offsetX
		}
		if (offsetY != null) {
			this.actualOffsetY = offsetY
		}
	}

	shake(maxOffsetX, maxOffsetY = 0) {
		this.shakeOffsetX = randomNumber(-maxOffsetX, maxOffsetX)
		this.shakeOffsetY = randomNumber(-maxOffsetY, maxOffsetY)
	}

	attach(object) {
		this.attachment = object;
		this.attached = true;
	};

	dettach() {
		this.attachment = null;
		this.attached = false;
	};
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

		this.getBounds = function () {
			return {
				top: this.y - this.height * 0.5,
				bottom: this.y + this.height * 0.5,
				left: this.x - this.width * 0.5,
				right: this.x + this.width * 0.5
			}
		}

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
			this.camtranslationX = (((this.x) * (1 / this.zoom))) + topLeftToCenterLength * sine(this.angle - this.offsetAngle)
			this.camtranslationY = (((this.y) * (1 / this.zoom))) + topLeftToCenterLength * -cosine(this.angle - this.offsetAngle)

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



// [SID] [NETY]
class languageTextManager {
	constructor() {
		this.data = new Array();
		this.languages = new Array();
		let english = this.createLanguage("eng.1", 0)
		this.addLanguage(english.languageName, english.textDataIndex)
		this.currentLanguage = english
		this.text = class {
			constructor(textData) {
				this.testData = textData
			}
		}
	}
	createLanguage(languageName, textDataIndex) {
		return {
			languageName: languageName,
			textDataIndex: textDataIndex,
		}
	}
	addLanguage(languageName, textDataIndex) {
		let language = this.getLanguage(languageName)
		if (!language) {
			this.languages[textDataIndex] = this.createLanguage(languageName, textDataIndex)
			return true
		} else {
			console.error("A language already exsists with that index" + " | Language <" + language.languageName + "> has a text index of '" + language.textDataIndex + "'.")
		}
	}
	getLanguage(languageName) {
		let language;
		for (let lang of this.languages) {
			if (lang.languageName == languageName) {
				language = lang;
				break;
			}
		}
		return language
	}
	setCurrentLanguage(languageName) {
		let language = this.getLanguage(languageName)
		if (language) {
			this.currentLanguage = language
			return true
		} else {
			console.log("The language '" + languageName + "' does not exsist, please refresh 'The world'")
		}
	}
	addText(id, textData) {
		if (!this.data[id]) {
			let text = new this.text(textData)
			this.data[id] = text
		} else {
			console.log("Text with the id '" + id + "' already exsists")
		}
	}
	setText(id, textData) {
		let text = new this.text(textData)
		this.data[id] = text
	}
	getText(id) {
		let textData = this.data[id]
		return textData[this.currentLanguage.textDataIndex]
	}
}


"use strict"; // Controls

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
		this.detectionAreaExtension = (this.radius)*0.5;
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
		this.callback()
		return this.values;
	}
	callback() { };

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


class Pointer{
	constructor(x, y){
		this.x = x; 
		this.y = y;
		this.oldX = x;
		this.oldY = y;
		this.ID = generateRandomId()
	}
}
var pointer = new Pointer(0, 0)
var touchSwipeTimer = new timer();
var touchDoubleTapTimer = new timer();
var touchDoubleTapCount = 0;
var touchSwipeStartPoint = new Pointer(0, 0);

function pointStartEvent(pointer, pointerType) { };
function pointMoveEvent(pointer, pointerType) { };
function pointEndEvent(pointer, pointerType) { };
function touchDoubleTapEvent() { };
function touchstartEvent() { }

function touchmoveEvent() { }

function touchSwipeUpEvent() { };
function touchSwipeDownEvent() { };
function touchSwipeLeftEvent() { };
function touchSwipeRightEvent() { };
function touchendEvent() { }

function mousedownEvent() { };
function mousemoveEvent() { };
function mouseupEvent() { };

function mousescrollUp() { }
function mousescrollDown() { }

function mouseLeftDown() { };
function mouseRightDown() { };

function keyPressHandler() { }
function keyEndHandler() { }

function adjustPointer(pointer, event){
	let paddingElement = window.document.body
	// let paddingElement = event.target
	// if(event.target.padding){
		pointer.x -= parseFloat(paddingElement.style.paddingLeft)
		pointer.y -= parseFloat(paddingElement.style.paddingTop)
	// }
	pointerAdjustment(pointer)
}

function pointerAdjustment() {};

function init_touch_controls(canvas = c) {
	canvas.addEventListener('touchstart', function (event) {
		if (Caldro.events.handleTouchEvents) {
			event.preventDefault()
			Caldro.screen.updatePointers(event, "start")
			pointer.x = event.touches[0].pageX
			pointer.y = event.touches[0].pageY
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer)
			touchstartEvent(pointer);
			pointStartEvent(pointer, "touch")
			if (Caldro.events.hnadleTouchSwipeEvents) {
				touchSwipeTimer.setTime(0);
				place(touchSwipeStartPoint, pointer)
			}

			if (touchDoubleTapCount == 0) {
				touchDoubleTapTimer.setTime(0)
			} else if (touchDoubleTapCount == 1) {
				if (touchDoubleTapTimer.getCurrentTime() < 1) {
					touchDoubleTapEvent();
				}
				touchDoubleTapCount = 0
			}
		}
	}, false)


	canvas.addEventListener('touchmove', function (event) {
		if (Caldro.events.handleTouchEvents) {
			event.preventDefault()
			Caldro.screen.updatePointers(event, "move")
			place(pointer, { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY })
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer)
			touchmoveEvent(pointer);
			pointMoveEvent(pointer, "touch")
		}
	})


	canvas.addEventListener('touchend', function (event) {
		if (Caldro.events.handleTouchEvents) {
			event.preventDefault()
			Caldro.screen.updatePointers(event, "end")
			place(pointer, { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY })
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer)
			touchendEvent(pointer);
			pointEndEvent(pointer, "touch")
			if (Caldro.events.hnadleTouchSwipeEvents) {
				if (touchSwipeTimer.getCurrentTime() < Caldro.events.swipeEventDetectionTimeRange) {
					let diffX = Math.abs(touchSwipeStartPoint.x - pointer.x)
					let diffY = Math.abs(touchSwipeStartPoint.y - pointer.y)
					if (Math.abs(diffX - diffY) > Caldro.events.swipeEventDetectionDistanceRange)
						if (diffX >= diffY) {
							if (pointer.x <= touchSwipeStartPoint.x) {
								touchSwipeLeftEvent()
							} else {
								touchSwipeRightEvent()
							}
						} else {
							if (pointer.y <= touchSwipeStartPoint.y) {
								touchSwipeUpEvent()
							} else {
								touchSwipeDownEvent()
							}
						}
				}
				place(touchSwipeStartPoint, pointer)
			}
		}
	})
}

function init_mouse_controls(canvas = c) {
	canvas.addEventListener("mousedown", function (e) {
		if (Caldro.events.handleMouseEvents) {
			e.preventDefault();
			Caldro.screen.addPointer(e.clientX, e.clientY)
			pointer.x = e.clientX;
			pointer.y = e.clientY;
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer);
			if(e.button == 0){
				mouseLeftDown();
			} else if(e.button == 2){
				mouseRightDown()
			}
			mousedownEvent();
			pointStartEvent(pointer, "mouse");
		}
	})

	canvas.addEventListener("mousemove", function (e) {
		if (Caldro.events.handleMouseEvents) {
			let spoint = Caldro.screen.pointers[0]
			if (spoint) {
				spoint.x = e.clientX
				spoint.y = e.clientY
			}
			pointer.x = e.clientX;
			pointer.y = e.clientY;
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer)
			mousemoveEvent();
			pointMoveEvent(pointer, "mouse");
		}
	})

	canvas.addEventListener("mouseup", function (e) {
		if (Caldro.events.handleMouseEvents) {
			Caldro.screen.pointers.length = 0
			pointer.x = e.clientX;
			pointer.y = e.clientY;
			adjustPointer(pointer, event)
			// Caldro.info.currentCamera.updatePointer(pointer)
			pointEndEvent(pointer, "mouse");
			mouseupEvent();
		}
	})


	canvas.addEventListener("mousewheel", function (event) {
		if (Caldro.events.handleMouseEvents) {
			if (event.deltaY < 0) {
				mousescrollUp()
			} else {
				mousescrollDown();
			}
		}
	})
}

function init_keyboard_controls() {
	document.addEventListener("keydown", function (event) {
		Caldro.info.currentKeyStateHandler.activateKeyState(event);
		keyboard.addKey(event)
		keyPressHandler(event.which)
	})

	document.addEventListener("keyup", function (event) {
		Caldro.info.currentKeyStateHandler.deactivateKeyState(event);
		keyboard.removeKey(event)
		keyEndHandler(event.which)
	})
}

var keyboard = {
	currentKeys: new Array(),
	isBeingPressed(keyName) { 
		let found = false
		keyName = this.parseKey(keyName)
		for (let i = 0; i < this.currentKeys.length; ++i) {
			if (this.currentKeys[i] == keyName) {
				found = true;
				break;
			}
		}
		return found
	},
	addKey(event) {
		let key = event.key
		if(this.currentKeys.includes(key)) return;
		this.currentKeys.push(key)
	},
	removeKey(event) {
		let key = event.key
		for (let i = 0; i < this.currentKeys.length; ++i) {
			if (this.currentKeys[i] == key) {
				this.currentKeys.splice(i, 1)
			}
		}
	},
	parseKey(key) {
		if (key == "space") {
			key = ' '
		} else if (key == "left") {
			key = "ArrowLeft"
		} else if (key == "right") {
			key = "ArrowRight"
		} else if (key == "up") {
			key = "ArrowUp"
		} else if (key == "down") {
			key = "ArrowDown"
		} else if (key == "shift"){
			key = "Shift"
		} else if (key == "ctrl"){
			key = "Control"
		} else if (key == "alt"){
			key = "Alt"
		}
		return key;
	},
	keyDict: [
		"space", ' '
	]
}

function init_controls() {
	init_touch_controls();
	init_mouse_controls();
	init_keyboard_controls();
}

// [SID]
class keyStateHandler {
	constructor() {
		this.keys = [];
		this.active = true;
		this.strictMatch = true;
		this.strictCaps = false;

		this.keyListener = class {
			constructor(KeyNumber, keyName, effect = NULLFUNCTION, onclick = NULLFUNCTION, onlift = NULLFUNCTION) {
				this.keyNumber = KeyNumber;
				this.keyName = keyName;
				this.active = true;
				this.beingPressed = false;
				this.executeClick = true
				this.effect = effect;
				this.onclick = onclick;
				this.onlift = onlift;
			}
		}
	}
	hitKey(keyinfo){
		let key = this.getKey(keyinfo)
		if(key){
			key.onclick();
		}
	}
	addKey(keyNumber, keyName, onclick, effect, onlift) {
		if (typeof keyName == "object") {
			for (let n = 0; n < keyName.length; ++n) {
				this.keys.push(new this.keyListener(keyNumber, keyName[n], effect, onclick, onlift))
			}
		} else {
			this.keys.push(new this.keyListener(keyNumber, keyName, effect, onclick, onlift))
		}
	}
	bind = this.addKey;
	removeKey(keyName){
		this.keys = this.keys.filter(function(keyL){
			if(keyL.keyName == keyName){
				return false
			} else {
				return true
			}
	})
	}
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
			key.onlift();
			key.beingPressed = false;
			key.executeClick = true;
		}
	}
}

class KeyShortCutHandler{
    constructor(){
        this.shortcuts = new Array();
        let KeyShortCutHandlerPointer = this
        document.addEventListener("keydown", function (event) {
            for(let shortcut of KeyShortCutHandlerPointer.shortcuts){
                if(shortcut.key.toLocaleLowerCase() == event.key.toLocaleLowerCase()){
                    if(shortcut.ctrl == event.ctrlKey && shortcut.shift == event.shiftKey && shortcut.alt == event.altKey){
                        event.preventDefault()
                        shortcut.onPerform()
                        break;
                    }
                }
            }
        })
    }
    addShortcut(key, onPerform = function(){}, ctrl = false, shift = false, alt = false){
        let shortcut = {
            key: key,
            onPerform: onPerform,
            ctrl: ctrl,
            shift: shift,
            alt: alt
        }
        this.shortcuts.push(shortcut)
    }
}

var keyAtlas = [

]

function getKeyName(keyNumber) {

}



"use strict"; // Caldro

/* var CaldroCam = new camera();
var CaldroPs = new particleSystem();
var CaldroKeys = new keyStateHandler(); */
var CaldroKeys = new keyStateHandler(); 



var Caldro = {
	time: {
		deltatime: 0,
		fixedTime: 0.016,
		elapsedTime: 0,
		currentFrame: 0,
		previousFrame: 0,
		_lastFrame: 0,
		framesPerSecond: 0,
		lastRecordedFramesPerSecond: new Array(),
		avergeFrameRateRecordingSpan: 10,
		cycles: 0,
		_minFPS: 1,
		safetyDeltatimeCap: null,
		_maxFPS: null,
		_lastUpdateElapsedTime: 0,
		setFixedTime(FPS) {
			Caldro.time.fixedTime = 1 / FPS
			Caldro.time.fixedTime = clip(Caldro.time.fixedTime, 1 / this.time._maxFPS, 1 / this.time._minFPS)
		},
		update: function () {
			let ct = Caldro.time
			let now = window.performance.now() / 1000
			let deltatime = now - ct.previousFrame
			ct.previousFrame = now
			ct._lastUpdateElapsedTime += deltatime
			
			if (ct._maxFPS) {
				if ((ct._lastUpdateElapsedTime < 1 / ct._maxFPS)) {
				// if ((deltatime < 1 / ct._maxFPS)) {
					return false;
				}
				ct._lastUpdateElapsedTime = 0
			}

			ct.currentFrame = window.performance.now() / 1000;
			ct.deltatime = ct.currentFrame - ct._lastFrame //+ ((ct.currentFrame - ct._lastFrame) - (1/ct._maxFPS))
			ct._lastFrame = ct.currentFrame

			if (ct.safetyDeltatimeCap != null) {
				if (deltatime > ct.safetyDeltatimeCap) {
					return false;
				}
			}

			++ct.cycles;
			ct.elapsedTime += ct.deltatime;
			ct.framesPerSecond = 1 / ct.deltatime;
			ct.lastRecordedFramesPerSecond.push(ct.framesPerSecond)
			if (ct.lastRecordedFramesPerSecond.length > ct.avergeFrameRateRecordingSpan) {
				ct.lastRecordedFramesPerSecond.shift();
			}
			if (ct.deltatime == Infinity) {
				console.log(ct)
			}
			return true;
		},
		setMaxFPS(maxFPS) {
			let ct = Caldro.time
			if (typeof maxFPS != "number") {
				console.error("Caldro.time error: maxFPS provided is not a primitive of type 'number'")
				return;
			}
			ct._maxFPS = maxFPS;
			ct._lastUpdateElapsedTime = 1 / maxFPS
		},
		setSafetyDeltatimeCapAtFPS(deltatimeToleranceInFPS = 1) {
			let ct = Caldro.time;
			ct.safetyDeltatimeCap = 1 / deltatimeToleranceInFPS
		},
		getAverageFrameRate: function () {
			let ct = Caldro.time;
			if (!ct.lastRecordedFramesPerSecond.length > 0) return 0;
			return arraySum(ct.lastRecordedFramesPerSecond) / ct.lastRecordedFramesPerSecond.length;
		}
	},

	game: {
		// ! ~Not in use~ !
		world: {
			dimensions: {
				meters: c.min / 10,
			}
		},
	},

	display: {
		aspectRatio: null,
	},

	info: {
		version: "0.3.0",
		logIssues: false,
		debuggingLogs: {
			// ! ~Not in use~ !
			audio: true,
			rendering: true,
			particleSystem: true,
			setAll: function (value = true) {
				this.audio = value;
				this.rendering = value;
				this.particleSystem = value;
			}
		},
		isloggingIssues: function () {
			return this.logIssues
		},
		// currentCamera: CaldroCam,
		// currentKeyStateHandler: CaldroKeys,
		// currentParticleSystem: CaldroPs,
		// currentCamera: CaldroCam,
		currentKeyStateHandler: CaldroKeys,
		// currentParticleSystem: CaldroPs,
	},

	renderer: {
		canvas: c,
		context: c.getContext("2d"),
		setRenderingCanvas: function (canvas) {
			if (getConstructorName(canvas) == "HTMLCanvasElement") {
				this.canvas = canvas
				this.context = this.canvas.getContext("2d")
				Caldro.rendering.canvas = this.canvas
				Caldro.rendering.context = this.canvas.getContext("2d")
			}
		},
		getCurrentRenderingInfo: function () {
			return {
				canvas: this.canvas,
				context: this.context
			}
		},
		hidingCursor: false,
		cursorType: "",
		shouldHideCursor: function (bool = false) {
			if (bool) {
				this.canvas.style.cursor = "none"
			} else {
				this.canvas.style.cursor = this.cursorType;
			}
			this.hidingCursor = bool
		},
		setCursorType: function (cursorType = "arrow") {
			this.cursorType = this.canvas.style.cursor = cursorType;
		},

		_pixelatorCanvas: document.createElement("canvas"),
		glow: true,
		alpha: true,
	},

	rendering: {
		canvas: c,
		context: c.getContext("2d"),
		plafrom: "CanvasRenderingContext2D",
		shapeClipping: false,
		shapeClippingCamera: null,
		imageSmoothing: false,
		textOutlineThickness: 0,
		textOutlineColor: "black",
		defaultColor: "skyblue",
	},

	events: {
		handleMouseEvents: true,
		hnadleTouchSwipeEvents: false,
		handleTouchEvents: true,
		handleKeyboardEvents: true,
		swipeEventDetectionTimeRange: 0.3,
		swipeEventDetectionDistanceRange: 20,
		forceMapPointerEventToWindow: function (browserWindow = window) {
			browserWindow.ontouchstart = browserWindow.onmousedown = function(){
				pointStartEvent();
			}
			browserWindow.ontouchmove = browserWindow.onmousemove = function(){
				pointMoveEvent();
			};
			browserWindow.ontouchend = browserWindow.onmouseup = function(){
				pointEndEvent();
			};
		},
	},

	screen: {
		clicks: 0,
		pointers: new Array(),
		checkForPointerIn: function (area) {
			for (let point of Caldro.screen.pointers) {
				if (pointIsIn(point, area)) {
					return true
				}
			}
			return false;
		},
		getFirstPointerIn: function (area) {
			for (let point of Caldro.screen.pointers) {
				if (pointIsIn(point, area)) {
					return point;
				}
			}
			return null;
		},
		addPointer: function (x, y, id = generateRandomId()) {
			this.pointers.push(new Point2D(x, y))
		},
		updatePointers: function (touchEvent, type = "idle") {
			this.pointers.length = touchEvent.targetTouches.length;
			for (let touch = 0; touch < touchEvent.targetTouches.length; ++touch) {
				let point = new Point2D();
				point.x = touchEvent.targetTouches[touch].pageX
				point.y = touchEvent.targetTouches[touch].pageY
				this.pointers[touch] = point
			}
			if (type == "start") {

			} else if (type == "move") {

			} else if (type == "end") {

			}
		},
		showPointers: function () {
			for (let point of this.pointers) {
				cordShow(point)
			}
		}
	},

	debug(info, source = "Annonymous") {
		if (!this.info.logIssues) return;
		console.log("Error at " + source + ": " + info)
	},

	getVersion: function () {
		return this.info.version;
	},

	setCamera: function (CAMERA) {
		this.info.currentCamera = CAMERA
	},
	getCamera: function () {
		return this.info.currentCamera;
	},

	setShapeClippingCamera: function (CAMERA) {
		this.rendering.shapeClippingCamera = CAMERA;
	},

	setPlayer: function (PLAYER) {
		this.info.currentPlayer = PLAYER;
	},

	setKeyStateHandler: function (KEYSTATEHANDLER) {
		this.info.currentKeyStateHandler = KEYSTATEHANDLER
	},

	reportError: function (errorDescription, errorSource, caldroCausedError = false) {
		console.error(errorDescription + "\n" + "Error Source: " + errorSource)
		if (caldroCausedError) {
			// needs a better error handling system currently
		}
	},

	// ! ~Not in use~ !
	physics: {

		entities: {
			blocks: new Array(),
			triggers: new Array(),
			bodies: new Array(),
			autoUpdate: function () {

			},
		},

	},

	auto: {
		layout: {
			updateLayouts: NULLFUNCTION,
			updateButtons: function () {

			},
			updateJoysticks: function () {

			},
		}
	},

	show: function () {
		if (this.showActive) {
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

	startAutoLoop: function () {
		CALDRO_INFINITE_LOOP()
	},
	init() {
		this.renderer._pixelatorCanvasContext = this.renderer._pixelatorCanvas.getContext("2d")
		init_controls();
	}
}
Caldro.init();



function MainLoop() { };
const CALDRO_INFINITE_LOOP = function () {
	window.requestAnimationFrame(CALDRO_INFINITE_LOOP);
	MainLoop()
}

if(onCaldroLoad){
	onCaldroLoad();
}
































