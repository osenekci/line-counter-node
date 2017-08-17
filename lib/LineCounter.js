/**
 * * * * * * * * * * * * * * * * * * * *
 *             Line Counter            *
 * * * * * * * * * * * * * * * * * * * *
 *                                     *
 * Author  : Özgür Senekci             *
 *                                     *
 * Skype   :  socialinf                *
 *                                     *
 * License : The MIT License (MIT)     *
 *                                     *
 * * * * * * * * * * * * * * * * * * * *
 */

function LineCounter(){

    /**
     * Dependencies
     */
    const fs = require("fs");
    const pth = require("path");
    const File = require("./File");
    const EventEmitter = require("events");
    const Events = require("./Events");


    /**
     * Event emitter
     * @type {EventEmitter}
     */
    var emitter = new EventEmitter();


    /**
     * Current path
     * @type {string}
     */
    var path = "";


    /**
     * Current extensions
     * @type {Extensions}
     */
    var extensions = null;


    /**
     * All rules
     * @type {Array}
     */
    var rules = [];


    /**
     * Path setter
     * @param newPath string
     */
    this.setPath = function(newPath){
        path = newPath;
        extensions = null;
    };


    /**
     * Extensions setter
     * @param newExtensions Extensions
     */
    this.setExtensions = function(newExtensions){
        extensions = newExtensions;
    };


    /**
     * Getter of extensions
     * @returns {Extensions}
     */
    this.getExtensions = function(){
        return extensions;
    };


    /**
     * Clears extensions
     */
    this.clearExtensions = function(){
        this.setExtensions(null);
    };


    /**
     * Overrides rules
     * @param newRules
     */
    this.setRules = function(newRules){
        rules = newRules;
    };


    /**
     * Returns all rules as array
     * @returns {Array}
     */
    this.getRules = function(){
        return rules;
    };


    /**
     * Adds new rule
     * addRule(Rules.ignore, "vendor");
     * addRule(ruleFunction, "firstArg", "secondArg", "thirdArg", ...)
     */
    this.addRule = function(){
        var rule = arguments[0];
        var args = [];
        for( var i = 1; i < arguments.length; i++ ){
            args.push(arguments[i]);
        }
        rules.push({
            rule: rule,
            args: args
        });
    };


    /**
     * Clears all rules
     */
    this.clearRules = function(){
        this.setRules([]);
    };


    /**
     * Counts lines and sends the result to the callback
     * @param callback
     */
    this.getLines = function(callback){
        var targetFiles = this.resolveTargetFiles();
        if( targetFiles.length === 0 ){
            callback({
                files: 0,
                lines: 0
            });
        }
        else{
            var len = targetFiles.length;
            var completed = 0;
            var totalLines = 0;
            for( var i = 0; i < len; i++ ){
                (function(i){
                    targetFiles[i].getLines(function(lines, err){
                        if( err === true ){
                            emitter.emit(Events.ERROR, "Could not read file: " + targetFiles[i].getPath());
                        }
                        else{
                            totalLines += lines;
                            completed++;
                            emitter.emit(Events.FILE_PROCESSED, {
                                totalFiles: len,
                                completedFiles: completed,
                                path: targetFiles[i].getPath(),
                                lines: lines
                            });
                            if( completed === len ){
                                callback({
                                    files: len,
                                    lines: totalLines
                                });
                            }
                        }
                    });
                })(i);
            }
        }
    };


    /**
     * Resolves the files that will be counted
     * @returns {Array}
     */
    this.resolveTargetFiles = function(){
        if( !fs.existsSync(path) ){
            emitter.emit(Events.ERROR, "Invalid path");
        }
        var targetFiles = [];
        resolveRecursive(targetFiles, path);
        return targetFiles;
    };


    /**
     * Add event listener
     * @param event
     * @param callback
     */
    this.on = function(event, callback){
        emitter.on(event, callback);
    };


    /**
     * Resolves recursively
     * @param targetFiles
     * @param path
     */
    function resolveRecursive(targetFiles, path){
        var stats = fs.lstatSync(path);
        var file = new File(path, stats);
        if( stats.isFile() ){
            if( applyRules(file) ){
                if( extensions === null ){
                    emitter.emit(Events.FILE_ACCEPTED, file.getPath());
                    targetFiles.push(file);
                }
                else{
                    if( extensions.verifyExtensions(getExtensionOf(path)) ){
                        emitter.emit(Events.FILE_ACCEPTED, file.getPath());
                        targetFiles.push(file);
                    }
                    else{
                        emitter.emit(Events.FILE_IGNORED, file.getPath());
                    }
                }
            }
            else{
                emitter.emit(Events.FILE_IGNORED, file.getPath());
            }
        }
        else if( stats.isDirectory() ){
            if( applyRules(file) ){
                try{
                    var childFiles = fs.readdirSync(path);
                    emitter.emit(Events.DIR_ACCEPTED, file.getPath());
                    for( var i = 0; i < childFiles.length; i++ ){
                        var cPath = pth.join(path, childFiles[i]);
                        resolveRecursive(targetFiles, cPath);
                    }
                }
                catch(e){
                    emitter.emit(Events.ERROR, "Could not read directory: " + path);
                }
            }
            else{
                emitter.emit(Events.DIR_IGNORED, file.getPath());
            }
        }
    }


    /**
     * Applies all rules
     * @param file
     * @returns {boolean}
     */
    function applyRules(file){
        for( var i = 0; i < rules.length; i++ ){
            if( !rules[i].rule.apply(null, [file.getName(), file.getStats()].concat(rules[i].args)) ){
                return false;
            }
        }
        return true;
    }


    /**
     * Returns extension of given file
     * @param path
     * @returns {string}
     */
    function getExtensionOf(path){
        var tokens = path.split(".");
        return tokens[tokens.length - 1];
    }

}

module.exports = LineCounter;