import * as e from "../core/vector.js";
import {INVALID_VECTOR} from "../core/constants.js";


const INVALID_POS_TYPE = "Shape position must be a vector2 or vector3 type";
const INVALID_RECTANGLE_SIZE = "Rectangle size must be a vector2 or vector3 type";
const INVALID_POLYGON_DATA = "All Polygon data must be a vector2 or vector3 type";


export class ShapeMixin {

    constructor(type, ...args) {
        this.type = type; // [circle, rectangle, polygon]

        if(!(args[0] instanceof e.Vector2) && !(args[0] instanceof e.Vector3))
            throw INVALID_VECTOR(INVALID_POS_TYPE);

        this.pos = args[0];
        if(this.type === "circle") 
            this.radius = args[1];
        else if(this.type === "rectangle") {
            if(!(args[1] instanceof e.Vector2) && !(args[1] instanceof e.Vector3))
                throw INVALID_VECTOR(INVALID_RECTANGLE_SIZE);
            this.size = args[1];
        } else if(this.type === "polygon") {
            if(args.some(i => !(i instanceof e.Vector2) && !(i instanceof e.Vector3)))
                throw INVALID_VECTOR(INVALID_POLYGON_DATA);
            this.vertices = [];
            for(let i=1; i < args.length; i++) 
                this.vertices.push(args[i]);
        }          
    }

    setRotation() {

    }


    move() {

    }

};