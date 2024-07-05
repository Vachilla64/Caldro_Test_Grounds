export class Shader {

    #renderer: WebGLRenderingContext;
    #program: WebGLProgram | null = null;
    #vertexShaderSource = "";
    #fragmentShaderSource = "";

    #error = "";

    constructor(renderer: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string, name="untitledShader") {
        this.#renderer = renderer;
        this.#vertexShaderSource = vertexShaderSource;
        this.#fragmentShaderSource = fragmentShaderSource;
        this.#init();
        if (this.#error !== "") console.error(`(${name}):${this.#error}`);
    }

    get vertexShaderSource() { return this.#vertexShaderSource; }

    get fragmentShaderSource() { return this.#fragmentShaderSource; }

    get program() { return this.#program; }

    use() {
        this.#renderer.useProgram(this.#program);
    }

    getError() {
        return this.#error;
    }

    #init() {
        const gl = this.#renderer;
        const vertexShader = this.#createShader(gl.VERTEX_SHADER, this.vertexShaderSource);
        const fragmentShader = this.#createShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        if (!gl.isShader(vertexShader) || !gl.isShader(fragmentShader)) return false
        this.#initProgram(vertexShader, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return true;
    }

    #initProgram(vertexShader: null | WebGLShader, fragmentShader: null | WebGLShader) {
        const gl = this.#renderer;
        this.#program = gl.createProgram() as WebGLProgram;
        if (vertexShader) {
            gl.attachShader(this.#program, vertexShader);
        }
        if (fragmentShader) {
            gl.attachShader(this.#program, fragmentShader);
        }
        gl.linkProgram(this.#program);
        const status = gl.getProgramParameter(this.#program, gl.LINK_STATUS);
        if (!status) {
            this.#setError("Shader_Program_Error: " + gl.getProgramInfoLog(this.#program));
            return false;
        }
        return true;
    }

    #createShader(type: GLenum, source: string) {
        const gl = this.#renderer;
        let shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!status) {
            this.#setError("Shader_Error: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    #setError(msg: string) {
        this.#error = msg;
    }

}