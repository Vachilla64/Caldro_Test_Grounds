# Caldro
<<<<<<< HEAD
Caldro is a HTML.5 Canvas Javascript game library
=======
A webgl based game engine.

## Table of Contents

1. [Introduction](#introduction)
2. [Initialization](#initialization)
2. [Scene](#scene)
3. [Shapes](#shapes)
3. [Contributing](#contributing)
4. [License](#license)

## Introduction
Caldro is a HTML5 based game engine that utilizes the WebGL rendering API for its graphical output.
The project was first initiated by [Vachila](https://www.github.com) and [Bytenol](https:://www.github.com)
in early 2021. It started off as a canvas2d based API until mid-2024 when webgl got introduced as the default
renderer. 

## Initialization
Caldro must be initialized before doing anything and the initialization process 
must be done after the document has been loaded. Preferrably, inside a `window.onload` event.
```javascript
// this import uses a relative path, your's might be different
import * as Caldro from "./build/src/core/Caldro.js";

// do this within a scene.onload event
const initParams = {
    parent: document.body,
    scene: null,
    // optional parameters and their options
    renderer: "webgl2",  // 'webgl'
    physics: null,  // box2d, matter, default
    orientation: "portrait" // 'landscape'
}

// is there anything that goes wrong, lets find out
if (!Caldro.init(params)) throw new Error(Caldro.getError());

// or just start the engine
Caldro.start();
```
The *parent* attribute is important though it can be any of the HTMLDivElement in your document.
*scene* is something to talk about in the next stage.
*renderer* can only be a string of "webgl" or "webgl2".
If your game uses any physics engine, The name should be provided as commented in the code. The physics 
engine must be either "box2d", "matter" or "default".
*orientation* describes the alignment of the parent element as portrait or landscape.

it is pertinent to know that the function `Caldro.getError()` hold the current error
message as a string. This can be handy in debugging lots of internal issues.

Caldro.init() - May throw an instance of `CanvasCreationError`, `GLCreationError`.

Well, if you have none of the above error in the console, the implementation
expect that you have an error that says `An instance of a scene must be created for default caldro...`.
This error is expected since the Caldro engine expect to have atleast one scene to be available.
The next lesson will talk about how to fix this issue.

## Scene
A Caldro scene is a javascript class that can represent a whole page or part of a page.
The scene inherited from the Node class just like every other components. To create a scene like 
object, you must extends from  `Scene` (An Abstract class).
```javascript
class SimpleScene extends Scene {
    constructor() {
        super(null);
        this.w = 400;   // width of the scene
        this.h = 400;   // height of the scene
    }
}
```
The next thing is to create an instance of a `SimpleScene` and attach it to the game configuration.
```javascript
const initParams = {
    //...
    scene: new SimpleScene(),
    //...
}
```
The scene constructor takes as argument the parent node. By default, A scene will take the 
size of its parent node except if explicitly stated anywhere in the scene lifecycle.
The lifecycle of a scene include the methods 
- `onCreate(gl: WebGLRenderingContext): boolean` called immediately after the constructor. This is where initialization should take place
- `onUpdate(timeStamp: number): boolean`: This is where the game logic should take place. This method is called repeatedly before the draw method
- `onDraw(gl: WebGLRenderingContext): boolean`. This is where continuos drawing should take place. This method is called repeatedly after the onUpdate method
- `onExit(gl: WebGLRenderingContext): boolean`. Called when the scene is about to exit.

We can further our scene by making the background blue
```javascript
class SimpleScene extends Scene {
    // ...constructor
    onUpdate(gl) {
        // setting the viewport
        this.setRenderViewport(0, 0, 100, 100);
        
        // setting the clear color. A number between 0-1
        this.setRenderClearColor(0x0, 0x0, 0x1,  0x1);
        
        // clearing the renderer
        this.renderClear();
        
        return true;    // ITS IMPORTANT
    }
}
```
Now, we should see a blue background scene. Yay.

## Shapes
One of the most easiest thing to get started with is shapes. Caldro provide 
the following set of geometrical shapes. The two most basic shapes provided are Rectangle,
Cirlce and Polygon... plus, ermm... lines

## Contributing
More content on this later

## License
Open Source: More content on this later
>>>>>>> 7edbd10 (hardware_accelerated_renderer)
