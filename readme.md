# Node line counter
[![Build Status](https://travis-ci.org/social13/line-counter-node.svg?branch=master)](https://travis-ci.org/social13/line-counter-node)
[![npm](https://img.shields.io/npm/v/line-counter-node.svg)]()
[![npm](https://img.shields.io/npm/l/line-counter-node.svg)]()
[![npm](https://img.shields.io/npm/dt/line-counter-node.svg)]()

Line counter is a node library that traverses a directory tree recursively to find all files with specific extensions (which is specified by user) and returns the total line count of matched files.

## Installation
LineCounter is a npm library and it can be installed as following
```bash
npm install -g line-counter-node
```

## CLI Usage
After installing LineCounter, binary file will be added to path
- {required} Path: The directory path which will be used as starting point
- {optional} Extensions: Comma separated extension list. Only the files with given extensions will be counted
- {optional} Except: Comma separated extension list which will be ignored
```bash
linecounter --path="path/to/directory"  # All files will be counted
linecounter --path="path/to/directory" --extensions="comma, separated, extensions"
linecounter --path="path/to/directory" --except="js"  # All files except the files with js extension will be counted
```
### Example output
```
Total files: 755
Total lines: 338203
```

## API Usage
### ExtensionsFactory
From method allows user to specify the allowed extensions. Only given extensions will be counted
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
var ext = ExtensionsFactory.from("js, php, java");  // Comma separated extension list
var ext = ExtensionsFactory.from(["js", "php", "java"]); // Array with extensions
```
Except method allows user to specify disallowed extensions. All other extensions will be counted except given extensions
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
var ext = ExtensionsFactory.except("js, php, java");  // Comma separated extension list
var ext = ExtensionsFactory.except(["js", "php", "java"]); // Array with extensions
```

### LineCounter
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
const LineCounter = require("line-counter-node").LineCounter;
var lc = new LineCounter();
lc->setPath("directory/path/");  // Sets the current directory which will be traversed
lc->setExtensions(ExtensionsFactory.from("js"));  // Specify allowed/disallowed extensions. Set null (or never set anything) to disable extension filter and target all files with all extensions
var files = lc->resolveTargetFiles();   // Traverses and returns target files as File array
lc->getLines(function(result){  });   // Returns total files and total lines. Result is a json object like { files: 15, lines: 7854 }
```

### Example Usage
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
const LineCounter = require("line-counter-node").LineCounter;
var lc = new LineCounter();
lc->setPath("/var/www/html/");
lc->setExtensions(ExtensionsFactory.from("js"));
lc->getLines(function(result){
    console.log("Total files: " + result.files);
    console.log("Total lines: " + result.lines);
});
```