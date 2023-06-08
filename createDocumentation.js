/**
 * This program requires  you to install nodejs runtime enironment of atleast __version >= 10
 * The purpose of this program is to automatically loop through series of
 * some files specified inside srcFile.json and run jsdoc commands for each file,
 * then pack them into their appropriate directory inside the /docs/ folder
 * 
 * @author RuntimeTerror418 <ccosmos418@gmail.com>
 * Date: 27th August, 2021
 * 
 * @todo creates an index.html file that automatically route documents url
*/

const fs = require("fs");
const path = require("path");
const terminal = require("child_process");

const SRC_FILE = path.resolve("srcFile.json");
const DOC_PATH = path.resolve("docs");
const SRC_PATH = path.resolve("src");


fs.stat(SRC_FILE, err => {

    if(err) {
        console.log(`${SRC_FILE} Does not exists in this directory`);
        return -1;
    };

    fs.readFile(SRC_FILE, {encoding: "utf-8"}, (err, data) => {
        if(err) {
            console.log(`Something went wrong while trying to read from ${SRC_FILE}`);
            console.log(`Please make sure there is a read/write access in this directory`);
            return -1;
        };

        data = JSON.parse(data);

        for(const directory in data) {
            let destDirectory = path.join(DOC_PATH, directory);
            fs.stat(destDirectory, err => {
                if(err) {
                    console.log(`PathDoesNotExist: ${destDirectory}`);
                    return -1;
                };

                for(let i of data[directory]) {
                    let inputFile = `${path.join(SRC_PATH, directory, i)}.js`;
                    let outputDir = `${path.join(DOC_PATH, directory, i)}`;
                    terminal.exec(`jsdoc ${inputFile} -d ${outputDir}`);
                }
            });
        }
    });

});