/**
 * 
 * update(time)
 */

export class Canvas {

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