import * as caldro from "../caldrodev.js";


const Mat3x3 = caldro.Mat3x3;
let f = new caldro.Vector2(1, 1, 1);
let a = Mat3x3.create(2, 0, 0, 0, 2);
let b = caldro.Mat4x4.pitchRotation(10);

console.log(b);