import {CustomError} from "../core/functions.js";


export const REPOSITORY = "github.com/Vachilla64/Caldro"; 
export const CONTAINERS = [];
// errors
export const INVALID_VECTOR = (msg = "Please provide an appropriate vector's type") => new CustomError("NOT_A_VECTOR", msg);
export const INVALID_SCENE = (msg = "Please provide an appropriate Scene/HTMLElement type") => new CustomError("NOT_A_SCENE", msg);