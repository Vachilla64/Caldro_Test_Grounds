import {CustomError} from "../core/functions.js";

export const DEBUG = false;
// errors
export const INVALID_VECTOR = (msg = "Please provide an appropriate vector's type") => new CustomError("NOT_A_VECTOR", msg);
export const INVALID_SCENE = (msg = "Please provide an appropriate Scene/HTMLElement type") => new CustomError("NOT_A_SCENE", msg);