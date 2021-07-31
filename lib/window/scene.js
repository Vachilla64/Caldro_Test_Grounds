function appendSceneToParent(type, scene, parent, w, h) {
    if(parent instanceof HTMLElement)
        parent.appendChild(scene);
    else if(parent instanceof Scene)
        parent.element.appendChild(scene);

    if(!(type.toLowerCase() === "canvas")) {
        scene.style.width = w;
        scene.style.height = h;
    }
};


/**
 * 
 */
export class Scene {

    constructor(type, parent, w=300, h=300) {
        if(!(parent instanceof HTMLElement) && !(parent instanceof Scene));
            // throw 
        this.type = type;
        this.element = document.createElement(this.type);
        this.parentElement = parent;

        if(document.readyState === "complete") {
            appendSceneToParent(this.type, this.element, parent);
        }
        else {
            window.addEventListener("load", () => {
                appendSceneToParent(this.type, this.element, parent);
            });
        }
    }

    set parentElement(ele) {
        if(ele instanceof HTMLElement)
            ele.appendChild(this.element);
        else if(ele instanceof Scene)
            ele.element.appendChild(this.element);
    }

    css(styles) {
        this.element.css(styles);
    }

    attr(_attrib) {
        this.element.attr(_attrib);
    }

    setFullScreen(eventListener) {
        this.element.setFullScreen(eventListener)
    }

};