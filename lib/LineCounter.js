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
                targetFiles[i].getLines(function(lines){
                    totalLines += lines;
                    completed++;
                    if( completed === len ){
                        callback({
                            files: len,
                            lines: totalLines
                        });
                    }
                });
            }
        }
    };


    /**
     * Resolves the files that will be counted
     * @returns {Array}
     */
    this.resolveTargetFiles = function(){
        if( !fs.existsSync(path) ){
            throw new Error("Directory does not exist");
        }
        var targetFiles = [];
        resolveRecursive(targetFiles, path);
        return targetFiles;
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
                    targetFiles.push(file);
                }
                else{
                    if( extensions.verifyExtensions(getExtensionOf(path)) ){
                        targetFiles.push(file);
                    }
                }

            }
        }
        else if( stats.isDirectory() ){
            if( applyRules(file) ){
                var childFiles = fs.readdirSync(path);
                for( var i = 0; i < childFiles.length; i++ ){
                    var cPath = pth.join(path, childFiles[i]);
                    resolveRecursive(targetFiles, cPath);
                }
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