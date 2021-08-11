import {_defineInterface} from "../core/util.js";


export const DEBUG = false;

// interfaces
export const Interface = Object.freeze({

    point: _defineInterface("x", "y"),
    circle: _defineInterface("pos", "radius"),
    wedge: _defineInterface("pos", "radius", "startAngle", "endAngle"),
    arc: _defineInterface("pos", "radius", "startAngle", "endAngle", "innerRadius", "outerRadius"),
    rect: _defineInterface("pos", "size")

});

export const COLOR_I = _defineInterface("r", "g", "b", "a");
export const VECTOR2_I = _defineInterface("x", "y");
export const VECTOR3_I = _defineInterface("x", "y", "z");

export const CIRCLE_I = _defineInterface("pos", "radius");


