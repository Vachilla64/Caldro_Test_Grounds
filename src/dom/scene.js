export class Scene extends HTMLDivElement {

    static get observedAttributes() {
        return [
            "orientation"
        ]
    }

    constructor() {
        super();
        this.orientation = "portrait";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(name, oldValue, newValue);
    }

};



customElements.define("caldro-scene", Scene, { extends: "div" });