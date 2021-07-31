import { ShapeMixin } from "../graphics/shapeMixin.js";

/**
 * Get bounding rect
 * get bounding circle
 * set image fill and make ctx draw them
 */

export class CircleShape extends ShapeMixin {

    constructor(pos, radius = 0) {
        super("circle", pos, radius);
    }

};