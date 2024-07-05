import {i_initParam} from "../types";
import {Scene} from "./Scene.js";
import {CanvasCreationError, GLCreationError} from "./Error.js";

let error = "";

const scenes: Array<Scene> = [];
let currentScene: Scene | null = null;

const Caldro_DefaultParam: i_initParam = {
    renderer: "webgl",
    physics: null,
    scene: null,
    orientation: "portrait",
    parent: null
}

const start = () => {
    currentScene?.start();
    window.onclick = () => {
        // document.body.requestFullscreen();
    }
}

const setDefaultParam = (key: string, value: any) => {
    if (!Caldro_DefaultParam.hasOwnProperty(key)) return;
    // @ts-ignore
    Caldro_DefaultParam[key] = value;
}

// @ts-ignore
const getDefaultParam = (key: string) => Caldro_DefaultParam[key];

const init = (initParam: i_initParam): boolean => {
    const canvas = document.createElement("canvas");
    if (!canvas)
        throw new CanvasCreationError();

    for (const key in initParam) {
        // @ts-ignore
        setDefaultParam(key, initParam[key]);
    }

    const ctx = canvas.getContext(Caldro_DefaultParam.renderer);
    if (!ctx) throw new GLCreationError(Caldro_DefaultParam.renderer);

    if (Caldro_DefaultParam.scene instanceof Scene) {
        document.body.setAttribute("style", `
            width: 100vw;
            height: 100vh;
            margin: 0px;
            padding: 0px;
            position: fixed;
            userSelect: none;
            display: flex;
            flex-direction: column;
        `);
        Caldro_DefaultParam.parent?.appendChild(Caldro_DefaultParam.scene.canvas);
        // TODO: Typescript underlining these red? why?
        // Caldro_DefaultParam.scene.w = Caldro_DefaultParam.width;
        // Caldro_DefaultParam.scene.h = Caldro_DefaultParam.height;
    } else {
        setError("An instance of a scene must be created for default caldro");
        return false;
    }

    scenes.push(Caldro_DefaultParam.scene);
    currentScene = scenes.pop() || null;

    return true;
}

const getError = () => error;

const setError = (msg: string) => error = msg;


async function requestFullScreen() {
    const elem = document.body;
    if (elem.requestFullscreen)
        return await elem.requestFullscreen();
    return Promise.reject();
}


// Cross-Platform request Animation Frame
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000/60);
        }
})();


export {
    init,
    getError,
    start,
    getDefaultParam,
    requestFullScreen
}