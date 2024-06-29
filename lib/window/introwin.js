import {Scene} from "../window/scene.js";

/**
 * Loader
 */

export class GameEngine extends Scene {

    constructor(w, h) {
        super("section", document.body, w, h);
        this.element.css({
            position: "absolute",
            top: "0px",
            left: "0px",
            width: w + "px",
            height: h + "px",
            zIndex: 9000
        });
        this.scenes = [];
    }

    addScene(scene) {
        this.element.appendChild()
    }

    update() {

    }

    start() {

    }

};