export const NAME = "runtime";

// core modules
export {Vector2} from "./lib/core/vector.js";
export {Vector3} from "./lib/core/vector.js";
export {Mat3x3} from "./lib/core/matrices.js";
export {Mat4x4} from "./lib/core/matrices.js";
export {Color} from "./lib/core/color.js";


// network modules
export {Preloader} from "./lib/network/preloader.js";
export {LocalStorage, SessionStorage} from "./lib/network/webstorage.js";
export {IndexDB} from "./lib/network/indexdb.js";
export {Firebase} from "./lib/network/firebase.js";


// window
export {Scene} from "./lib/window/scene.js";
export {GameArea} from "./lib/window/canvas.js";
export {Loader} from "./lib/window/loader.js";


// physics


// graphics
export * as Shape from "./lib/graphics/shape.js";


