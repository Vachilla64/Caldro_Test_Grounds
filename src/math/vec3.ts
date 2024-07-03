export class Vec3 {

    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    add(o: Vec3)
    {
        return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
    }

    sub(o: Vec3)
    {
        return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z);
    }

    scale(s: number)
    {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }

}