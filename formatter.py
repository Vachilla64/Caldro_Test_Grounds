"""This program requires atleast python 3.6 and above

** This program must be run before the final commit
** This program requires to structure the directory in the below format 
base\
    .git 
    src\
        [all of caldro files on here]

The purpose of this program is to automate some build files like 
- automatically creating the caldroMode, caldroLib file

.........................................
MIT License

Copyright (c) 2021 github.com/RuntimeTerror418

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
...................................................

TODO
- Create a single Merger 
- delete nsModule
"""


class CaldroFileFormatter: pass


class CaldroFileFormatter:
   
    
    def __init__(self: CaldroFileFormatter): 
        """[Constructor]

        Args:
            self (CaldroFileFormatter): A pointer to the current instance of this class
            Please refer the top comment to learn how to structure your file for this program
        """
        self.ROOT_DIR: str = os.path.dirname(os.path.abspath(__file__))
        self.CALDRO_DEV_PATH: str = ""                  # location of caldrodev.js file
        self.CALDRO_VERSION : str = ""                  # next version of caldro
        self.CALDRO_HEIRACHY_PATH: str = ""             # location of heirachy.json file
    
    
    
    def createES6ImportModule(self: CaldroFileFormatter) -> None:
        """Walkthrough caldrodev.js and create if not exists a new caldroMod.js
        containing all imports/exports in respect to the next version on cdn.jsdeliver

        Args:
            self (CaldroFileFormatter): A pointer to the current instance of this class
        """
        self.CALDRO_DEV_PATH: str = os.path.join(self.ROOT_DIR, "caldrodev.js")
        if not os.path.exists(self.CALDRO_DEV_PATH):
            sys.exit(f"Caldrodev.js does not exist on this root directory.. Please create the file")
            
        with open(os.path.join(self.ROOT_DIR, f"caldro-mod.js"), "w") as f:
            with open (self.CALDRO_DEV_PATH, "r") as devFile:
                exports: list = devFile.readlines()
                devFile.close()
            for eachline in exports:
                currentLine = eachline.split(" ")
                exportPath = currentLine[len(currentLine) - 1].split("/")
                if len(exportPath) >= 3:
                    exportPath[0] = '"..'
                    exportPath.insert(1, f"Caldro@{self.CALDRO_VERSION}")
                    currentLine.pop()
                    currentLine.append("/".join(exportPath))
                    print(currentLine)
                f.write(" ".join(currentLine))
            f.close()
            
            
            
    def createLibrary(self: CaldroFileFormatter) -> None:
        """This function convert everything inside lib folder from es6 import to 
        normal es6, and combine  everything into caldro.js
        
        Args:
            self (CaldroFileFormatter): [description]
        """
        self.CALDRO_HEIRACHY_PATH = os.path.join(self.ROOT_DIR, "heirachy.json")
        if not os.path.exists(self.CALDRO_HEIRACHY_PATH):
            sys.exit("heirachy.json file not found.. :(")
        
        with open(self.CALDRO_HEIRACHY_PATH, "r") as f:
            H_file = f.read()
            f.close()
            
        H_file = json.loads(H_file)         # convert json into regular python dictionary
        
        with open(os.path.join(self.ROOT_DIR, "caldro.js"), "w") as f:
            f.close()
            
        for iter, module in enumerate(H_file):
            for lib in H_file[module]:
                # open new file inside tempFolder
                with open(os.path.join(self.ROOT_DIR, "caldro.js"), "a") as f:
                    path: str = os.path.join(self.ROOT_DIR, "lib", module, f"{lib}.js")
                    valid_file: bool = os.path.exists(path)
                    if valid_file:
                        # read the corresponding file inside lib folder and parse them from module to regular lib
                        # by formating lines with [import and export] keyword
                        with open(path, "r") as moduleFile:
                            contents = moduleFile.readlines()
                            moduleFile.close()
                        for lines in contents:
                            stripped = lines.strip()
                            currentText = lines
                            if stripped.startswith("import"):
                                continue
                            elif stripped.startswith("export"):
                                broken = stripped.split(" ")
                                if broken[1].startswith("*") or broken[1].startswith("{"):
                                    continue
                                else:
                                    currentText = " ".join(broken[1:])
                            f.write(currentText)
                        f.write("\n")    
                    f.close()
        
        
    
    def start(self: CaldroFileFormatter) -> None:
            
        while not self.CALDRO_VERSION:
            self.CALDRO_VERSION = input("Please enter your next build version: ")
        print()
        print("Mode.......", "1: Module", "2: Library", "3: both", sep="\n")
        MODE: int = int(input("Please select your mode: ") or "1")
        
        if MODE == 1:
            self.createES6ImportModule()
        elif MODE == 2:
            self.createLibrary()
        elif MODE == 3:
            self.createES6ImportModule()
            self.createLibrary()
    
        
        
if __name__ == "__main__":
    import os
    import sys
    import json
    app: CaldroFileFormatter = CaldroFileFormatter()
    app.start()