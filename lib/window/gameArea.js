import {DOMElement} from "../window/container.js";
import {DEBUG_LOG} from "../core/util.js";

/**
 * Inherited from DOMElement 
 * - Creates a canvas element 
 * width / height must be an integer cos they're represented in pixels
 * Any modification to use css styling on the width and height may 
 * result into a distorted canvas 
 * 
 * @static Dynamic -> says canvas should run on RAF
 * @static Static -> opposite to Dynamic
 * 
 * Sample
 * const a = new GameArea();
 * a.width = innerWidth;
 * a.height = innerHeight;
 * a.update = function(t) {
 *      this.clear(x, y, w, h);
 *      this.context2d.fillStyle = new Color();
 *      this.context2d.fillRect(0, 0, 100, 100);
 * };
 * a.mainLoop(GameArea.Static);
 */
 export class GameArea extends DOMElement {

    constructor(w = 300, h = 150) {
        super("canvas");
        this.width = w;
        this.height = h;
        this.context2d = this.element.getContext("2d");
        this.time = {}; // cycles, deltaTime, fps, elapsedTime -> passed into update function
    }

    set width(w) {
        if(typeof w === "number") {
            this.element.width = w;
            this.element.css({width: `${w}px`});
        } else 
            console.error("GameArea width must be an integer represented per pixels");
    }

    set height(h) {
        if(typeof h === "number") {
            this.element.height = h;
            this.element.css({height: `${h}px`});
        } else 
            console.error("GameArea height must be an integer represented per pixels");
    }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }

    set clearColor(col) { this._clearColor = col }

    get clearColor() { return this._clearColor; }

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


    mainLoop(dynamic = GameArea.Static) {
        // don't run this function exceppt if it provide a this.update method
        if(!(typeof this.update === "function"))
            throw new Error("Canvas Must define an update method before calling mainloop");

        if(dynamic === GameArea.Dynamic) {
            DEBUG_LOG("log", "GameArea starts with a gameLoop");

            let cycles = 0;
            let elapsedTimeStarted = new Date().getTime();
            let fpsTimeStarted = new Date().getTime();
            let deltaTimeStarted = new Date().getTime();

            const animate = () => {
                // time = {} [cycles, currentTime, elapsedTime, deltaTime, fps]
                // passed into the update function
                this.time.cycles = ++cycles;
                this.time.currentTime = new Date().getTime();
                this.time.elapsedTime = this.time.currentTime - elapsedTimeStarted;
                this.time.fps = 1000 / (performance.now() - fpsTimeStarted);
                fpsTimeStarted = performance.now();
                this.time.deltaTime = Math.abs(this.time.currentTime - deltaTimeStarted) * 0.001;
                deltaTimeStarted = this.time.currentTime;

                if(this.time.deltaTime > 0.2) this.time.deltaTime = 0;

                this.update(this.time);
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        } else if(dynamic === GameArea.Static) {
            DEBUG_LOG("log", "GameArea starts with no gameLoop");
            this.update({});
        }
        else {
            console.warn(`MainLoop starting in a static mode because "mode: ${dynamic}" is unknown`);
            this.update({});
            DEBUG_LOG("table", {
                "GameArea.Static": GameArea.Static,
                "GameArea.Dynamic": GameArea.Dynamic
            });
        }
        
    }
};


Object.defineProperties(GameArea, {
    Static: {
        value: "Run update function without RAF",
        configurable: false,
    },
    Dynamic: {
        value: "Run update function with RAF",
        configurable: false,
    }
});