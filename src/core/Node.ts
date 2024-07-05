export class Node
{
    private parent: Node | null;
    private children: Node[] = [];
    protected _w: number = 0;
    protected _h: number = 0;

    constructor(parent: Node | null = null) {
        this.parent = parent;
        this._w = (parent?._w || 0);
        this._h = (parent?._h || 0);
    }

    addChild(child: Node) {
        this.children.push(child);
    }

    get allChildren() { return this.children; }
}