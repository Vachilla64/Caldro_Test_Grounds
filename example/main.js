/**
 * Create splashscreen
 * toast
 * controls
 */
import * as caldro from "../caldrodev.js";

const {Vector2, Vector3, Mat4x4, Color} = caldro;

const cubeVertices = [
    [0, 0, 0],
    [1, 0, 0],
    [1, -1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, -1, 1],
    [0, -1, 1]
];


const cubeColor = [
    "red",
    "green",
    "blue",
    "orange",
    "pink",
    "yellow",
    "teal"
];

class Cube {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size || 50;
        this.rotation = new Vector3();
    }

    transform() {
        let mat4;
        let scaledVertices = [];
        let rotatedVertices = [];
        let translatedVertices = [];
        let projectedVertices = [];
        mat4 = Mat4x4.scalar(this.size);
        let mRotateX = Mat4x4.pitchRotation(this.rotation.x);
        let mRotateY = Mat4x4.yawRotation(this.rotation.y);
        let mRotateZ = Mat4x4.rollRotation(this.rotation.z);
        let mRotate = Mat4x4.multiplyMatrix(mRotateX, mRotateY);
        mRotate = Mat4x4.multiplyMatrix(mRotate, mRotateZ);
        // scale
        cubeVertices.forEach((vertex, i) => {
            let v = new Vector3(vertex[0], vertex[1], vertex[2]);
            let sv = Mat4x4.multiplyVector(mat4, v);
            scaledVertices[i] = new Vector3(sv[0], sv[1], sv[2], 1);
        });
        // rotate
        scaledVertices.forEach((vertex, i) => {
            let v = Mat4x4.multiplyVector(mRotate, vertex);
            rotatedVertices[i] = new Vector3(v[0], v[1], v[2], 1);
        });
        // translate
        rotatedVertices.forEach((vertex, i) => {
            translatedVertices[i] = vertex;
        });
        // project
        translatedVertices.forEach((vertex, i) => {
            projectedVertices[i] = vertex.add({x: 300, y:300, z:0});
        });

        this.projected = projectedVertices;
    }

    makeFace(vertices) {
        this.faces = [];
        let faces = [
            [3, 0, 1, 2], // south
            [6, 5, 4, 7], // north
            [7, 4, 0, 3], //east
            [2, 1, 5, 6], // west,
            [7, 3, 2, 6], // top
            [4, 0, 1, 5] // bottom
        ];
        let toRaster = [];
        faces.forEach((v, i) => {
            let v0 = vertices[v[0]];
            let v1 = vertices[v[1]];
            let v2 = vertices[v[2]];
            let v3 = vertices[v[3]];
            let line1 = v0;
            let line2 = v1.sub(v0);
            let line3 = v3.sub(v0);
            let normal = line2.cross(line3);
            normal.normalise();
            let isBackFace = normal.dot(line1) >= 0;
            if(!isBackFace) {
                let zMean = (v0.z + v1.z + v2.z + v3.z) / 4;
                toRaster.push([[v0, v1, v2, v3], zMean]);
            };
        });

        toRaster.sort((a, b) => a[1] < b[1]);
        toRaster.forEach((f, i) => {
            this.faces.push(f[0]);
        });
        toRaster = [];
    }

    drawFace(ctx, face, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(face[0].x, face[0].y);
        ctx.lineTo(face[1].x, face[1].y);
        ctx.lineTo(face[2].x, face[2].y);
        ctx.lineTo(face[3].x, face[3].y);
        ctx.closePath();
        ctx.fill();
    }

    update(ctx) {
        // this.rotation.x += 0.05;
        this.rotation.y += 0.02;
        this.transform();
        this.makeFace(this.projected);
        // this
        this.faces.forEach((face, i) => {
            this.drawFace(ctx, face, cubeColor[i]);
        });
    }
}


class Game extends caldro.GameArea {

    constructor(w, h) {
        super(document.body, w, h);
        this.clearColor = Color.Black;
        this.test = new Cube(new Vector3(0, 0, 0));
    }

    update() {
        let ctx = this.context2d;
        this.test.update(ctx);
    }

};


const game = new Game(innerWidth, innerHeight);
game.mainLoop(caldro.GameArea.Dynamic);