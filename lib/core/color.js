export class Color {

    constructor(h=0, s=0, l=0, a=255) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    add(color) {
        let res = new Color();
        res.h = this.h + color.h;
        res.s = this.s + color.s;
        res.l = this.l + color.l;
        res.a = this.a + color.a;
        return res;
    }

    sub(color) {
        let res = new Color();
        res.h = this.h - color.h;
        res.s = this.s - color.s;
        res.l = this.l - color.l;
        res.a = this.a - color.a;
        return res;
    }

    toString() {
        return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }

};


Object.assign(Color, {
    Red: new Color(0, 100, 50),
    Green: new Color(120, 100, 50),
    Blue: new Color(250, 100, 50),
    Purple: new Color(270, 100, 50),
    Black: new Color(0, 0, 0, 0),
    White: new Color(360, 100, 100)
});