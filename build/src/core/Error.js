class CanvasCreationError extends Error {
    constructor() {
        super("Browser is unable to create a HTML5 canvas object");
    }
}
class GLCreationError extends Error {
    constructor(msg) {
        super("Unbale to create a webgl rendering context for: " + msg);
    }
}
export { CanvasCreationError, GLCreationError };
