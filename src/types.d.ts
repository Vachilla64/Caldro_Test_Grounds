import {Scene} from "./core/Scene";

/***
 * @file types.d.ts
 * @author github.com/bytenol
 *
 * Well having this comment at the top of my code makes me feel super professional lol. Anyway, this file
 * includes all the typings and interfaces that Caldro provided. The basic convention for type names is to
 * prefix the name with a t_ and i_ for interface. for example
 * t_vec2 is a type for a vec2 object
 * i_vec2 is an interface for a vec2 object
 * Again, this is just one of the many naming convention out there but wait, why not just tVec2 and iVec2. They seems
 * cool too. Maybe we will consider those for later.
 */
type t_renderer = "webgl" | "webgl2"

type t_orientation = "landscape" | "portrait"

type t_physics = "default" | "arcade" | "box2d" | "matter";

interface i_initParam {
    renderer: t_renderer,
    parent?: HTMLDivElement | null,
    scene?: Scene | null,
    physics?: t_physics | null,
    orientation?: t_orientation
}

interface i_scene {
    onCreate: Function, // boolean
    onUpdate?: Function,    // boolean
    onDraw?: Function,  // boolean
    onExit?: Function   // boolean
}