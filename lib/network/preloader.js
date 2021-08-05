/**
 * Singleton Preloader class 
 * Able to 
 * -Load images, audios and open link
 * 
 * How it works
 * - This program provides 4 public functions
 * (addImages, addAudios, addUrls, sync)
 * 
 * function starting with "add" creates their respected object from the parameter provided
 *  and push the objects into their  respected buffering array (images, audios, urls) 
 * inside the preloader class.
 * 
 * whenever the sync method is called, this program programmatically loads the current
 * media from the buffer (images, audios, urls) respectively and push the loaded media
 * inside their respected array (loadedImages, ...) and reset their respected buffer to 
 * an empty array
 * 
 * sync method returns a promise of a function (getImage, getAudio, getUrls) to retrieve
 * items from the loaded media array
 * 
 * @author github.com/RuntimeTerror418
 */
export const Preloader = (() => {

    // current media added to buffer
    let images = [], 
        audios = [], 
        urls = [];

    // all loaded medias
    const loadedImages = [], 
          loadedAudios = [], 
          loadedUrls = [];

    // preloader object API
    const preloader = {

        _state: "idle",
        _activeFile: "none",

        set state(val) {
            this._state = val;  // idle, interactive, complete
        },

        get state() { return this._state; },

        set currentLoadingFile(val) {
            this._activeFile = val;
        },

        get currentLoadingFile() { return this._activeFile },

    };

    const printables = ["-"];
    for(let i=65, j=0; i <= 122; i++, j++) {
        printables.push(String.fromCodePoint(i));
        printables.push(String(j));
    };

    /**
     * @description This function extract a supposed name from it's argument
     * // input: https://google.com
     * // output: google
     * @param {String} source destination source
     * @returns {String} name of the link
     */
    const getId = (source) => {
        let start = source.lastIndexOf(".");
        let name = "";
        while(printables.includes(source[start - 1])) {
            start--;
            let currentChar = source[start];
            name += currentChar;
        };
        return name.split("").reverse().join("");
    };


    /**
     * @description loads a single image file
     * @param {any} param location of the image
     * @returns {Promise}
     * 
     * param1 = "....jpg"  // string
     * param2 = {src, id}  // object
     */
    const loadImage = param => {
        const img = new Image();
        if(typeof param === "string") {
            img.src = param;
            img.id = getId(param);
        }else if(typeof param === "object") {
            img.src = param.src;
            img.id = param.id || getId(param.src);
        };
        const promise = new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                loadedImages.push(img);
                resolve(1);
            });
            img.addEventListener("error", () => {
                reject("Something went wrong :( while loading " + img.src);
            })
        });
        return promise;
    };


    /**
     * @description loads a single audio file
     * @param {String} src location of the audio
     * @returns {Promise}
     */
     const loadAudio = param => {
         let src = typeof param === "string" ? param : param.src;
        const audio = new Audio(src);
        audio.load();
        audio.loop = param.loop || true;
        let promise = new Promise((resolve, reject) => {
            audio.addEventListener("canplaythrough", function() {
                loadedAudios.push(audio);
                resolve(1);
            });
            audio.addEventListener("error", () => {
                reject("Something went wrong ;( while loading " + audio.src);
            });
        });
        return promise;
    };


    /**
     * @description loads a single url link
     * @param {String} src location of the link
     * @returns {Promise}
     */
     const loadUrl = param => {
        if(typeof param === "object") {
            param.res = "";
        } else if(typeof param === "string") {
            let old = param;
            param = {src: old, id: getId(old), res:""}
        };
        let promise = fetch(param.src).then(
            e => e.text()).then(e => {
                param.res = e;
                loadedUrls.push(param);
                return 1;
            });
        return promise;
    };


    preloader.addImages = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                images.push(arg);
        });
    };

    preloader.addAudios = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                audios.push(arg);
        }); 
    };

    // {src, id}
    preloader.addUrls = (...args) => {
        preloader.state = "idle";
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                urls.push(arg);
        });
    };


    // call this function to start preloading every objects in 
    // their respected buffer
    preloader.sync = async function(){
        let pImages = [];
        let pAudios = [];
        let pUrls = [];
        preloader.state = "interactive";
        images.forEach(src =>{
            preloader.currentLoadingFile = src;
            pImages.push(loadImage(src));
        });
        images = [];
        audios.forEach(src => {
            preloader.currentLoadingFile = src;
            pAudios.push(loadAudio(src));
        });
        audios = [];
        urls.forEach(src => {
            preloader.currentLoadingFile = src;
            pUrls.push(loadUrl(src));
        });
        urls = [];
        return await Promise.all([...pImages, ...pAudios, ...pUrls])
        .then(e => {
            preloader.state = "complete";
            let res = {
                getImage(id) {
                    if(typeof id === "number")
                        return loadedImages[id];
                    return loadedImages.filter(i => i.id === id)[0];
                },
                getAudio(id) {
                    if(typeof id === "number")
                        return loadedAudios[id];
                    return loadedAudios.filter(i => i.id === id)[0];
                },
                getUrl(id) {
                    if(typeof id === "number")
                        return loadedUrls[id];
                    return loadedUrls.filter(i => i.id === id)[0];
                }
            };
            return res;
        });
    };

    return preloader;

})();