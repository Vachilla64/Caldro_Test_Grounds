/**
 * Create splashscreen
 * toast
 * controls
 */
import * as caldro from "../caldrodev.js";

const {Canvas, Color} = caldro;

class App extends Canvas {

    constructor(w, h) {
        super(document.body, w, h);
        this.css({backgroundColor: "#000"});
        // this.requestAnimationFrame = true;
        // this.clearColor = "#000";
    }

    update() {
        this.context2d.fillStyle = Color.Red;
        this.context2d.fillRect(0, 0, 100, 100);
    }

};

let a = new App(200, 200);
a.mainLoop();