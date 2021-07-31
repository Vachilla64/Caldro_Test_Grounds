import {Scene} from "../window/scene.js";


export const Canvas = (() => {

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