/**
 * Singleton Preloader class 
 * Able to 
 * -Load images, audios and open link
 */
export const Preloader = (() => {

    // current media added to buffer
    let images = [], audios = [], urls = [];
    // all loaded medias
    const loadedImages = [], loadedAudios = [], loadedUrls = [];
    // preloader object API
    const preloader = {};

    const printables = [];
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
                reject("Something went wrong :( while loading " + src);
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
        const ctx = new AudioContext();
        let src = typeof param === "string" ? param : param.src;
        let id = typeof param === "string" ? getId(param) : param.id || getId(param);
        let promise = fetch(src).then(e => e.arrayBuffer())
        .then(e => ctx.decodeAudioData(e)).then(e => {
            const sound = ctx.createBufferSource();
            sound.buffer = e;
            sound.connect(ctx.destination);
            sound.play = function(when = ctx.currentTime, offset=0, duration = sound.buffer.duration) {
                sound.start(when, offset, duration);
            };
            sound.id = id;
            loadedAudios.push(sound);
            return 1;
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
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                images.push(arg);
        });
    };

    preloader.addAudios = (...args) => {
        args.forEach(arg => {
            if(typeof arg === "string" || typeof arg === "object") 
                audios.push(arg);
        }); 
    };

    // {src, id}
    preloader.addUrls = (...args) => {
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
        images.forEach(src => pImages.push(loadImage(src)));
        images = [];
        audios.forEach(src => pAudios.push(loadAudio(src)));
        audios = [];
        urls.forEach(src => pUrls.push(loadUrl(src)));
        urls = [];
        return await Promise.all([...pImages, ...pAudios, ...pUrls])
        .then(e => {
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