export class Preloader {

    /**
     * @description loads a single image file
     * @param {String} src location of the image
     * @returns {Promise}
     */
    static loadImage(src) {
        let img;
        if(src instanceof HTMLImageElement)
            img = src;
        else {
            img = new Image();
            img.src = src;
        };
        console.log("ggg");
        let promise =  new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                resolve(img);
            });
            img.addEventListener("error", () => {
                reject();
            });
        });
        return promise;
    }

    // const loadFiles = (data, _this) => {
    //     let req = new XMLHttpRequest();
    //     req.onreadystatechange = function() {
    //         if(req.readyState === XMLHttpRequest.DONE) {
    //             if(req.status === 200) {
    //                 _this._preloadedAssetsCounter++;
    //                 data.res = req.responseText;
    //                 _this.loadingFunction();
    //             } else {
    //                 this.error = `Bad Internet Connection`;
    //                 _this.status = "failed";
    //             }
    //         }
    //     };
    //     req.open("GET", data.src);
    //     req.send();
    // }


    /**
     * @description load multiple images
     * @param  {...any} args Data for the images
     * @returns 
     * arg = {src, id}
     */
     static loadImage(...args) {
        
    }

    static loadDocument() {
        
    }

    static loadAudio() {
        
    }

    static loadURL() {
        
    }

    constructor() {

    }

    async start() {

    }

};