import { Node } from "./Node.js";
import { getDefaultParam } from "./Caldro.js";
import { Shader } from "./Shader.js";
export class Scene extends Node {
    canvas;
    renderer;
    #shaders = {};
    constructor(parent) {
        super(parent);
        this.canvas = document.createElement("canvas");
        this.canvas.style.background = "#100c0c";
        this.renderer = this.canvas.getContext(getDefaultParam("renderer"));
    }
    set w(v) {
        this.canvas.width = v;
        this.canvas.style.width = v + "px";
        this._w = v;
    }
    set h(v) {
        this.canvas.height = v;
        this.canvas.style.height = v + "px";
        this._h = v;
    }
    get w() { return this._w; }
    get h() { return this._h; }
    // TODO: viewport implementation should be able to divide the whole screen accordinlgy
    setRenderViewport(x, y, w, h) {
        this.renderer.viewport(x, y, w, h);
    }
    setRenderClearColor(r, g, b, a) {
        this.renderer.clearColor(r, g, b, a);
    }
    // TODO: Add clear for DEPTH_BUFFER_BIT and STENCIL_BUFFER_BIT
    renderClear() {
        this.renderer.clear(this.renderer.COLOR_BUFFER_BIT);
    }
    start() {
        let windowShouldStart = this.onCreate(this.renderer);
        const loop = (timeStamp) => {
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
    addShader(name, vertexShaderSource, fragmentShaderSource) {
        if (this.#shaders.hasOwnProperty(name))
            return true;
        this.#shaders[name] = new Shader(this.renderer, vertexShaderSource, fragmentShaderSource, name);
        return true;
    }
    // TODO: throw ShaderDoesNotExist Error
    getShader(name) {
        if (!this.#shaders.hasOwnProperty(name))
            return null;
        return this.#shaders[name];
    }
    // TODO: throw ShaderDoesNotExist Error
    useShader(name) {
        if (!this.#shaders.hasOwnProperty(name))
            return;
        this.#shaders[name].use();
    }
}
