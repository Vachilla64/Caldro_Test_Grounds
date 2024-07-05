import {Node} from "./Node.js";
import {getDefaultParam} from "./Caldro.js";
import {i_scene} from "../types";
import {Shader} from "./Shader.js";

export abstract class Scene extends Node implements i_scene
{
    canvas: HTMLCanvasElement;
    private renderer: WebGLRenderingContext;

    #shaders: any = { };

    constructor(parent: Node) {
        super(parent);
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.canvas.style.background = "#100c0c";
        this.renderer = this.canvas.getContext(getDefaultParam("renderer")) as unknown as WebGLRenderingContext;
    }

    set w(v: number) {
        this.canvas.width = v;
        this.canvas.style.width = v + "px";
        this._w = v;
    }

    set h(v: number) {
        this.canvas.height = v;
        this.canvas.style.height = v + "px";
        this._h = v;
    }

    get w(): number { return this._w; }

    get h(): number { return this._h; }

    // TODO: viewport implementation should be able to divide the whole screen accordinlgy
    setRenderViewport(x: number, y: number, w: number, h: number) {
        this.renderer.viewport(x, y, w, h);
    }

    setRenderClearColor(r: number, g: number, b: number, a: number) {
        this.renderer.clearColor(r, g, b, a);
    }

    // TODO: Add clear for DEPTH_BUFFER_BIT and STENCIL_BUFFER_BIT
    renderClear() {
        this.renderer.clear(this.renderer.COLOR_BUFFER_BIT);
    }

    start() {
        let windowShouldStart = this.onCreate(this.renderer);

        const loop = (timeStamp: number) => {

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }



    abstract onCreate(ctx: WebGLRenderingContext): boolean;

    abstract onUpdate(timestamp: number): boolean;

    abstract onDraw(ctx: WebGLRenderingContext): boolean;

    abstract onExit(ctx: WebGLRenderingContext): boolean;


    addShader(name: string, vertexShaderSource: string, fragmentShaderSource: string) {
        if (this.#shaders.hasOwnProperty(name)) return true;
        this.#shaders[name] = new Shader(this.renderer, vertexShaderSource, fragmentShaderSource, name);
        return true;
    }

    // TODO: throw ShaderDoesNotExist Error
    getShader(name: string): Shader | null {
        if (!this.#shaders.hasOwnProperty(name))
            return null;
        return this.#shaders[name];
    }

    // TODO: throw ShaderDoesNotExist Error
    useShader(name: string) {
        if (!this.#shaders.hasOwnProperty(name))
            return;
        this.#shaders[name].use();
    }

}