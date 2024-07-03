import * as Caldro from "../../build/src/core/Caldro.js";
import {Scene} from "../../build/src/core/Scene.js";

const vertexShaderSource = `
attribute vec3 position;

void main() {
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;


class Application extends Scene {
    constructor() {
        super(null);
        this.w = 400;
        this.h = 400;
    }

    onCreate(gl) {
        this.addShader("basic", vertexShaderSource, fragmentShaderSource);
        this.setRenderViewport(0, 0, this.w, this.h);
        this.setRenderClearColor(0x0, 0x0, 0x1,  0x1);
        this.renderClear();

        const vertices = [
            0, 0,
            1, 0,
            1, 1,
        ];
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        this.useShader("basic");
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);


        return true;
    }

    onUpdate() {

    }

}

const main = () => {
    const initParam = {
        parent: document.body,
        scene: new Application()
    }

    if (!Caldro.init(initParam)) throw new Error(Caldro.getError());
    Caldro.start();
}

addEventListener("load", main);