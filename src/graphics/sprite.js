export class Sprite {

    constructor(...args) {

        if(this.constructor === Sprite) 
            throw "abstractError";
        
        if(!(typeof this.update === "function"))
            throw "abstractError";

        if(args.length < 2)
            throw "Length Error";

        this.animationFrames = args.splice(0, args.length - 1); 
        this.delayInterval = args[0];
        this.delayCounter = 0;
        this.frameCounter = 0;
        this.repeat = true;
        this.done = false;
    }


    update(dt = 1) {
        this.delayCounter += dt;
        if(this.delayCounter >= this.delayInterval) {
            this.delayCounter = 0;
            this.frameCounter++;
            if(this.frameCounter >= this.animationFrames.length) {
                this.frameCounter = this.repeat ? 0 : this.animationFrames.length - 1;
                this.done = true;
                if(typeof this.onComplete === "function")
                    this.onComplete();
            } else {
                this.done = this.frameCounter >= this.animationFrames.length - 1;
            }
        }
        return this.animationFrames[this.frameCounter];
    }

}



export class PositionalSwapSprite extends Sprite {

    constructor(...pos) {
        super(...pos);
    }

};



export class ImageSwapSprite extends Sprite {

    /**
     * @description Animates image sprites
     * @param  {...any} frames list of images
     * The last value of frames must be a number indicating the interval 
     * per each sprite's frame
     * @note 
     * May take an optional method "onComplete"
     * 
     * @todo
     * Create better "onComplete" calling state
     */
    constructor(...frames) {
        super(...frames)
    }

    /**
     * @description returns the current image
     * @param {Number} dt speed runs before the next interal
     * @returns {Any} the current image
     * it's always good to have "dt" value as a deltatime
     */
    update(dt = 1) {
        this.delayCounter += dt;
        if(this.delayCounter >= this.delayInterval) {
            this.delayCounter = 0;
            this.frameCounter++;
            if(this.frameCounter >= this.animationFrames.length) {
                this.frameCounter = this.repeat ? 0 : this.animationFrames.length - 1;
                this.done = true;
                if(typeof this.onComplete === "function")
                    this.onComplete();
            } else {
                this.done = this.frameCounter >= this.animationFrames.length - 1;
            }
        }
        return this.animationFrames[this.frameCounter];
    }
};
