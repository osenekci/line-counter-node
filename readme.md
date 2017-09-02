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
After installing LineCounter, binary file will be added to path. You can run the script as linecounter or lc.
### Options
- -v, --version: Show current version of linecounter
- -h, --help: Shows available commands with descriptions

### Methods
- count: Scans given directory recursively and returns lines of founded files
    - -v, --verbose: Shows accepted, ignored files and directories
    - -p, --path: The directory path which will be used as starting point. If path is not specified then target directory will be current directory
    - -e, --extensions: Comma separated extension list. Only the files with given extensions will be counted
    - -i, --except: Comma separated extension list which will be ignored
    - -r, --rules: Additional rules. See available rules section for rule list
    - -s, --save: Saves all options except path so that it can be reused again. Configuration file path $HOME/.linecounter.json
    - -c, --config: Uses a saved configuration. All options except path will be used from given configuration
- config: Lists, shows and removes available configurations
    - -l, --list: Displays all saved configurations
    - -s, --show: Shows a saved configuration's details
    - -r, --remove: Removes a saved configuration

#### Basic Usage
There are 2 ways to use options.
- Full name: Option name must start with double dashes (--) and equal operator (=) is required to assign a value to the option. Example --optionName=value or --optionWithoutValue
- Alias: Option name must start with a single dash character (-) and a single space is required between option name and value to assign a value to the option. Example: -o value or -o
```bash
linecounter [globalOptions] [method] [methodOptions]
lc [globalOptions] [method] [methodOptions]  # lc is alias of linecounter
```

#### Options Usage
```bash
linecounter # Same with --help
linecounter --version
linecounter --help
```

#### Count Method Usage
```bash
linecounter count --path="/var/www/html" --verbose # All files will be counted and printed under the current directory
linecounter count --extensions="comma, separated, extensions"
linecounter count --except="js"  # All files except the files with js extension will be counted
linecounter count --rules="ignoreDir(node_modules)"
lineCounter count --rules="ignoreHidden|filePostfix(test)"  # multiple rule usage. Separate rules with | character
linecounter count -p "path/to/directory" -r "ignoreDir(node_modules,tests,lib,src)"   # multiple aguments with one rule usage
linecounter count -e "comma, separated, extensions" -r "ignoreDir(node_modules,tests,lib,src)" -v --save="myConfiguration" # Saves options
linecounter count --config="myConfiguration" # Following options will be used: -e "comma, separated, extensions" -r "ignoreDir(node_modules,tests,lib,src)" -v
```

#### Config Method Usage
```bash
linecounter config --list
linecounter config --show=myConfiguration # Shows details of myConfiguration
linecounter config --remove=myConfiguration # Removes myConfiguration
```

#### Example Output of Count (without --verbose option)
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
- lc.on(eventName: String, args1, arg2...)   // Bind event listeners

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

### Events
```node
const Events = require("line-counter-node").Events;
```
- Events.ERROR  // Cause: If given path is invalid or some file or directory could not read. Arg: error message
- Events.FILE_ACCEPTED  // Cause: If if a file is accepted while scanning files. Arg: file path
- Events.DIR_ACCEPTED   // Cause: If if a directory is accepted while scanning files. Arg: file path
- Events.FILE_IGNORED   // Cause: If if a file is ignored while scanning files. Arg: file path
- Events.DIR_IGNORED    // Cause: If if a directory is ignored while scanning files. Arg: file path
- Events.FILE_PROCESSED // Cause: File is counted successfully. Arg: {totalFiles: int, completedFiles: int, path: string, lines: int(for current file)}

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
- Rules.ignoreFile          // Ignore multiple files
- Rules.ignoreDir           // Ignore multiple directories
- Rules.ignoreHidden        // Ignores dotfiles and dotfolders (.git, .idea, .gitignore...)
- Rules.regex               // Regular expression rule. Allows only the matched file or directories
- Rules.ignoreExt           // Ignore multiple extensions
- Rules.dev                 // Developer rule. Ignored dot files, some extensions (md, iml, yml, ...) and some vendor directories (node_modules, bower_components, ...)

### Example Usage
```node
const ExtensionsFactory = require("line-counter-node").ExtensionsFactory;
const LineCounter = require("line-counter-node").LineCounter;
const Rules = require("line-counter-node").Rules;
const Events = require("line-counter-node").Events;
var lc = new LineCounter();
lc.setPath("/var/www/html/");
lc.setExtensions(ExtensionsFactory.from("js"));
lc.addRule(Rules.ignoreDir, ".git", ".idea", "node_modules");  // Ignores given directories
lc.addRule(Rules.filePrefix, "line");   // Only the file names starts with "line" are allowed, others will be ignored
lc.on(Events.ERROR, function(err){
    console.error(err);
});
lc.getLines(function(result){
    console.log("Total files: " + result.files);
    console.log("Total lines: " + result.lines);
});
```