# Node line counter
[![Build Status](https://travis-ci.org/social13/line-counter-node.svg?branch=master)](https://travis-ci.org/social13/line-counter-node)
[![npm](https://img.shields.io/npm/v/line-counter-node.svg)](https://www.npmjs.com/package/line-counter-node)
[![npm](https://img.shields.io/npm/l/line-counter-node.svg)](https://github.com/social13/line-counter-node/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/line-counter-node.svg)](https://www.npmjs.com/package/line-counter-node)

Line counter is a node library that traverses a directory tree recursively to find all files with specific extensions (which is specified by user) and returns the total line count of matched files.

## Installation
LineCounter is a npm library and it can be installed as following
```bash
npm install -g line-counter-node
```

## CLI Usage
After installing LineCounter, binary file will be added to path
- {optional} Help: Shows available commands with descriptions
- {optional} Path: The directory path which will be used as starting point. If path is not specified then target directory will be current directory
- {optional} Extensions: Comma separated extension list. Only the files with given extensions will be counted
- {optional} Except: Comma separated extension list which will be ignored
- {optional} Rules: Additional rules. See available rules section for rule list
```bash
linecounter # All files will be counted in current directory
linecounter --help  # Shows available options
linecounter --path="path/to/directory"  # All files will be counted
linecounter --path="path/to/directory" --extensions="comma, separated, extensions"
linecounter --path="path/to/directory" --except="js"  # All files except the files with js extension will be counted
linecounter --path="path/to/directory" --rules="ignoreDir(node_modules)"
lineCounter --path="path/to/directory" --rules="ignoreHidden|filePostFix(test)"  # multiple rule usage. Separate rules with | character
linecounter --path="path/to/directory" --rules="ignoreDirs(node_modules,tests,lib,src)"   # multiple aguments with one rule usage
```
### Example output
```
Total files: 755
Total lines: 338203
```

## API Usage
### LineCounter
```node
const LineCounter = require("line-counter-node").LineCounter;
var lc = new LineCounter();
```
#### Methods
- lc.setPath(path: string)      // Sets current directory path which will be traversed
- lc.setExtensions(ext: Extensions)     // Specify allowed/disallowed extensions. Set null (or never set anything) to disable extension filter and target all files with all extensions
- lc.resolveTargetFiles()   // Traverses and returns target files as File array
- lc.getLines(callback: Function)  // Returns total files and total lines. Result is a json object like { files: 15, lines: 7854 }
- lc.getExtensions()    // Returns current Extensions object
- lc.clearExtensions()  // Resets Extensions rules
- lc.setRules(rules: Array)  // Overrides existing rules with new ones
- lc.addRule(rule: Function, arg1, arg2, ...)   // Adds new rule
- lc.clearRules()   // Resets all rules

#### Creating custom rule
```node
// Name is file or directory name without path. Stats is fs.Stats. Arguments are unlimited and depends on the rule
function customRule(name, stats, arg1, arg2, arg3, ...){
    if( want file or directory to count ){
        return true;
    }
    else{
        return false;
    }
}
```

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

### Rules
#### Available Rules
```node
const Rules = require("line-counter-node").Rules;
```
- Rules.filePrefix          // Name prefix rule
- Rules.filePostfix         // Name postfix rule (without extension)
- Rules.fileIgnorePrefix    // Name ignore prefix rule
- Rules.fileIgnorePostfix   // Name ignore postfix rule
- Rules.ignoreFile          // Ignore file rule
- Rules.ignoreFiles         // Ignore multiple files
- Rules.ignoreDir           // Ignore directory rule
- Rules.ignoreDirs          // Ignore multiple directories
- Rules.ignoreHidden        // Ignores dotfiles and dotfolders (.git, .idea, .gitignore...)

### Example Usage
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
const LineCounter = require("line-counter-node").LineCounter;
const Rules = require("line-counter-node").Rules;
var lc = new LineCounter();
lc.setPath("/var/www/html/");
lc.setExtensions(ExtensionsFactory.from("js"));
lc.addRule(Rules.ignoreDirs, ".git", ".idea", "node_modules");  // Ignores given directories
lc.addRule(Rules.filePrefix, "line");   // Only the file names starts with "line" are allowed, others will be ignored
lc.getLines(function(result){
    console.log("Total files: " + result.files);
    console.log("Total lines: " + result.lines);
});
```