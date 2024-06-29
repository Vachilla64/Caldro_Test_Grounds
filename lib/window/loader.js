import { Color } from "../core/color.js";
import { Scene } from "../window/scene.js";


export class Loader extends Scene {

    constructor(parent = document.body, bgColor="#fff", color="teal") {
        super("div", parent, `${window.innerWidth}px`, `${window.innerHeight}px`);
        this.id = "caldro@loader";
        this.hasLoaded = Symbol("Single loader");
        if(!(Loader.loaded === this.hasLoaded.toString())) 
            Loader.loaded = this.hasLoaded.toString();
        else 
            throw new Error("You can only make a single instance of this class");
        
        let color1 = bgColor instanceof Color ? bgColor.toString() : bgColor;
        let color2 = color instanceof Color ? color.toString() : color;
        this.css({backgroundColor: color1});
        let div = document.createElement("div");
        div.id = "caldro_loader";
        this.element.appendChild(div);
        let style = document.createElement("style");
        style.innerHTML = `
        #caldro_loader {
            width: 100px;
            height: 25px;
            border-top: 10px dotted ${color2};
            position: absolute;
            left: calc(50vw - 50px);
            top: calc(50vh - 12px);
            animation: spin 2s linear infinite
        }
        @keyframes spin {
            from {
                border-top: 10px dotted teal;
            } 
            to {
                border-top: 5px dotted teal;
            }
        }`;
        document.body.appendChild(style);
    }

    hide() {
        this.element.display = "none";
    }

    show() {
        this.element.display = "block";
    }

};

Object.defineProperties(Loader, {
    loaded: {
        value: false,
        configurable: false,
        writable: true
    }
});