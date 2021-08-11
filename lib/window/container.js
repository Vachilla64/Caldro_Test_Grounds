import { splitCSSValue, DEBUG_LOG } from "../core/util.js";

/**
 * @exports 
 * Scene
 * DOMElement
 */

/**
 * Scene is a container type and the base for all the 
 * game area... Every other html tag/element should 
 * be added directly or indirectly to this tag
 * 
 * scene is always appended to the body tag by default
 * 
 * Sample 
 * let a = new Scene("100px", "200px");
 * a.orientation = Scene.LandScape;
 * a.add(some component)
 * 
 * [NOTE] scene can only add components which are valid HTMLElement 
 * or an instance of DOMElement
 * 
 * @todo
 *  - Able to append scene to other tag
 *  - Make orientation switch perfect everyWhere
 */
export class Scene {

    constructor(w, h) {
        this.element = document.createElement("section");
        this.element.className = "caldro-dom-scene";
        this.element.id = `caldro-scene-${Scene.id}`;
        this.element.style.backgroundColor = "#000";
        this._rotation = 0;     // use when switching orientation modes
        this.width = w || "100vw";
        this.height = h || "100vh";

        if(document.readyState === "complete") {
            document.body.appendChild(this.element);
        } else {
            window.addEventListener("load", () => {
                document.body.appendChild(this.element);
            });
        };
        Scene.id++;
    }

    set width(w) { this.element.css({width: w}); }

    set height(h) { this.element.css({height: h}); }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }

    set orientation(type) {
        this._orientation = type;
        let oldPositionCSS = this.element.getCss("position");
        let oldHeightCSS = this.element.getCss("height");
        let oldWidthCSS = this.element.getCss("width");
        let oldHeight = splitCSSValue(oldHeightCSS);
        let oldWidth = splitCSSValue(oldWidthCSS);
        if(this._orientation === Scene.LandScape && this._rotation === 0) {
            this._rotation = 90;
            this.element.css({
                width: oldHeightCSS,
                height: oldWidthCSS,
                transformOrigin: "0 0",
                transform: `rotate(90deg)`,
                position: Boolean(oldPositionCSS) ? oldPositionCSS : "absolute",
                left: `${oldWidth[0] + oldWidth[1]}`,
            });
        } else if(this._orientation === Scene.Portrait && this._rotation === 90) {
            this._rotation = 0;
            this.element.css({
                width: oldHeightCSS,
                height: oldWidthCSS,
                transformOrigin: "0 0",
                transform: `rotate(0deg)`,
                position: "absolute",
                left: "0px"
            });
        } else if(this._orientation !== Scene.Portrait && this._orientation != Scene.LandScape){
            DEBUG_LOG("log", 
            `Cannot set orientation to an unknown and/or unrotated scene: ${this._orientation}`);
            DEBUG_LOG("table", {
                "Scene.Portrait": Scene.Portrait,
                "Scene.LandScape": Scene.LandScape,
            });
        }
    }

    add(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement");
        let child;
        if(element instanceof DOMElement) {
            child = element.element;
        } else {
            child = element;
        };
        element.scene = this;
        if(element.parentElement === null) 
            element.parentElement = this.element;
        else
            this.element.appendChild(child);
    }

    setFullScreen(eventListener = "click") {
        let _this = this.element;
		this.addEventListener(eventListener, () => {
			if (_this.requestFullscreen) 
				_this.requestFullscreen();
			else if (_this.mozRequestFullScreen) 
				_this.mozRequestFullScreen();
			else if (_this.webkitRequestFullscreen) 
				_this.webkitRequestFullscreen();
			else if (_this.msRequestFullscreen) 
				_this.msRequestFullscreen();
		});
        DEBUG_LOG("log", "setFullScreen expects an event listener type as argument: onclick...");
    }
};


Object.defineProperties(Scene, {
    id: {
        value: 1, 
        writable: true,
        readable: true, 
        configurable: true
    },
    LandScape: {
        value: "Rotate this Scene by 90deg",
        configurable: false,
    }, 
    Portrait: {
        value: "No rotation applied",
        configurable: false
    }
});



/**
 * DOMElement creates an HTML Tag...
 * By default it will not append the created tag to anything 
 * untill you explicity give the "add" instruction... or add it to a scene
 * 
 * let a = new DOMElement("section");
 * Scene.add(a);   /// 
 * a.add(children)...
 */
export class DOMElement {

    constructor(type) {
        this.type = type;
        this.element = document.createElement(this.type);
        this.scene = null;
        this.id = "cladro-element-" + parseInt(Math.random()* 5000);
        this.className = "caldro-dom-element";
    }

    set id(s) {
        this._id = s;
        this.element.id = this._id;
    }

    get id() { return this._id }

    set className(s) {
        this._className = s;
        this.element.className += " " + this._className;
    }

    get className() { return this.element.className; }

    set width(w) { this.element.css({width: w}); }

    set height(h) { this.element.css({height: h}); }

    get width() { return this.element.getCss("width"); }

    get height() { return this.element.getCss("height"); }


    set parentElement(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement)
            && !(element instanceof Scene))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement | Scene");
        this.scene = element instanceof Scene ? element : element.scene;
        let par = element instanceof DOMElement || element instanceof Scene ? 
            element.element : element;
        this._parentElement = par;
        par.appendChild(this.element);
    }


    get parentElement() {
        return this._parentElement;
    }

    add(element) {
        if(!(element instanceof HTMLElement) && !(element instanceof DOMElement))
            throw TypeError("Function expects an instance of HTMLElement | DOMElement | Scene");
        let par = element instanceof DOMElement ?  element.element : element;
        this.element.appendChild(par);
    }

    css(styles) { this.element.css(styles); }

    getStyle(props) { return this.element.style.getPropertyValue(props); }

};