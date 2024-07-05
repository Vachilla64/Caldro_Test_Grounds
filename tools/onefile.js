const fs = require("fs");
const path = require("path");
const readline = require("readline");


const SRC_PATH = path.resolve("src");
const BUILD_PATH = path.resolve("build");

const BUILD_FILE = path.resolve(BUILD_PATH, "caldro.js");
const onefile = fs.createWriteStream(BUILD_FILE);

const FILES = [
    "core/vector",
    "core/matrices",
    "core/util",
    "dom/canvas",
    "graphics/sprite"
];

let content = "";


let contentBuffer = [];



async function g() {

    let promiseArr = [];

    for(let i=0; i < FILES.length; i++) {

        let content = "";
    
        let read = readline.createInterface({
            input: fs.createReadStream(path.join(SRC_PATH, `${FILES[i]}.js`)),
            output: onefile,
            terminal: false
        });
    
    
        let p = new Promise((resolve, reject) => {
            read.on("line", data => {
                let tmp = data.trim();
                if(tmp.startsWith("import"));
                else if(tmp.startsWith("export")) {
                    tmp = tmp.split(" ");
                    let d = tmp.splice(1).join(" ");
                    content += d;
                } else {
                    content += data;
                }
                content += "\n";
            });
        
            read.on("close", () => {
                resolve(content);
            });
    
        });

        promiseArr.push(p);

    };

    return await Promise.all(promiseArr);
}


g().then(e => {
    let s = e.join("\n");
    fs.writeFile(BUILD_FILE, s, (err) => {
        if(err) {
            console.log("Something went wrong while writing to tiled3d.js");
            return -1;
        };
        console.log("Program finished");
    })
});