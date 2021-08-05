/**
 * @todo
 * Add orientation mode for landscape and offset fixin
 */
import {DEBUG_LOG} from "../core/util.js";

/**
 * @description append scene element to parent element
 * @param {HTMLElement | Scene} scene Element
 * @param {HTMLElement | Scene} parent Element
 */
const appendSceneToParent = (scene, parent) => {
    if(parent instanceof HTMLElement) {
        parent.appendChild(scene);
    }
    else if(parent instanceof Scene) {
        parent.element.appendChild(scene);
    }
};


/**
 * Scene class is suitable for creating HTML Element
 * If parent element is specified, the scene silently 
 * wait for DOM to be loaded and append it's element to the parent element
 */
export class Scene {

    /**
     * 
     * @param {String} type type of the element to be created by tag
     * @param {HTMLElement | String | null} parent reference to the parent element
     * @param {String} w width of the element in css format 
     * @param {String} h height of the element in css format
     */
    constructor(type, parent, w = "300px", h = "300px") {
        this.type = type;
        this.element = document.createElement(this.type);
        this._parentElement = parent;
        this.parentElement = parent;
        this._width = w;
        this._height = h;
        this._parentElementInitialised = 0;
        this._orientation = "potrait";
        this._id = "scene@"+Math.random() * parseInt(Math.random() * 5000);
        this._className = undefined;
        this.css({width:w, height: h});
        if(document.readyState === "complete") {
            appendSceneToParent(this.element, this.parentElement);
        } else {
            window.addEventListener("load", () => {
                appendSceneToParent(this.element, this.parentElement);
            });
        }
    }

    set parentElement(parent) {
        if(!this._parentElementInitialised) {
            this._parentElement = parent;
            this._parentElementInitialised++;
        } else {
            if(!(parent instanceof HTMLElement) && !(parent instanceof Scene))
                throw TypeError("Parent Element must be an instance of Scene | HTMLElement");
            this._parentElement = parent instanceof Scene ? parent.element : parent;
            this._parentElement.append(this.element);
        }
    }

    get parentElement() { 
        if(this._parentElement instanceof HTMLElement)
            return this._parentElement;
        else if(this._parentElement instanceof Scene)
            return this._parentElement.element;
    }

    set className(val) { this._className = val; }

    get className() { return this._className; }

    set id(val) {this._id = val; }

    get id() { return this.id; }

    set orientation(val) {
        this._orientation = val;
        if(this._orientation === Scene.Portrait) {
            DEBUG_LOG("log", Scene.Portrait);
            DEBUG_LOG("log", "Portait Method is not implemented yet");
        } else if(this._orientation === Scene.LandScape) {
            DEBUG_LOG("log", Scene.LandScape);
            this.css({
                transformOrigin: "0 0",
                transform: "rotate(90deg)",
                position: this.getStyle("position") === "<empty string>" ? 
                    "absolute" : this.getStyle("position"),
                left: `${this.getStyle("height")}`
            });
        } else {
            console.warn(`Cannot set orientation to an unknown type: ${val}`);
            DEBUG_LOG("table", {
                "Scene.Portrait": Scene.Portrait,
                "Scene.LandScape": Scene.LandScape,
            });
        }
    }

    getStyle(props) {
        return this.element.style.getPropertyValue(props);
    }

    get orientation() { return this._orientation; };

    set width(w) {
        this._width = w;
        this.element.style.width = this._width;
    }

    get width() { return this._width; }

    set height(h) {
        this.height = h;
        this.element.style.height = this._height;
    }

    get height() { return this._height; }

    css(styles) { this.element.css(styles); }

    attr(_attrib) { this.element.attr(_attrib); }

    addEventListener(type, func) { this.element.addEventListener(type, func); }

    setFullScreen(eventListener) {
        this.element.setFullScreen(eventListener);
        DEBUG_LOG("log", "setFullScreen expects an event listener type as argument: onclick...");
    }

};


Object.defineProperties(Scene, {
    LandScape: {
        value: "Rotate the scene by 90deg",
        configurable: false,
    }, 
    Portrait: {
        value: "Rotate the scene by either 0deg or 90deg",
        configurable: false
    }
});