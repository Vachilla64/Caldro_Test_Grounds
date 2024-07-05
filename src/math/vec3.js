export class Vec3 {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(o) {
        return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
    }
    sub(o) {
        return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z);
    }
    scale(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }
}
//# sourceMappingURL=vec3.js.map