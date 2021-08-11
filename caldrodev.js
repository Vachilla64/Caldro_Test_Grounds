/**
 * @author github.com/RuntimeTerror418
 * @license MIT 
 * @link github.com/Vachilla64/Caldro
 * @namespace caldro
 * @version null
 * @copyright Copyright(c) 2021 github.com/Vachilla64, github.com/RuntimeTerror418
 * 
 * Kamikazee..... :( weird stuff Dayummmmmmmmmmmmmmn
 * 
 * MIT License
 * Copyright (c) 2021 Vachilla64
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the right
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

// core modules
export {Vector2, Vector3} from "./lib/core/vector.js";
export {Mat3x3, Mat4x4} from "./lib/core/matrices.js";
export {Color} from "./lib/core/color.js";
export * as util from "./lib/core/util.js";
export {Interface} from "./lib/core/constants.js";


// network modules
export {Preloader} from "./lib/network/preloader.js";
export {IndexDB} from "./lib/network/indexdb.js";
export {Firebase} from "./lib/network/firebase.js";


// window
export {
    Scene, 
    DOMElement
} from "./lib/window/container.js";
export {GameArea} from "./lib/window/gameArea.js";
export {Loader} from "./lib/window/loader.js";
// export {Controller} from "./lib/window/controller.js";


// physics
export {Collision} from "./lib/physics/collision.js";

// graphics
export * as Shape from "./lib/graphics/shape.js";