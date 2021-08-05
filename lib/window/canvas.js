import {Scene} from "../window/scene.js";
import {DEBUG_LOG} from "../core/util.js";


/**
 * GameArea is like an extension to HTMLCanvasElement 
 * it inherit from scene
 */
export class GameArea extends Scene {

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