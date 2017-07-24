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
        if( fs.lstatSync(path).isFile() ){
            if( extensions === null ){
                targetFiles.push(new File(path));
            }
            else{
                if( extensions.hasExtension(getExtensionOf(path)) ){
                    targetFiles.push(new File(path));
                }
            }
        }
        else if( fs.lstatSync(path).isDirectory() ){
            var childFiles = fs.readdirSync(path);
            for( var i = 0; i < childFiles.length; i++ ){
                var cPath = pth.join(path, childFiles[i]);
                resolveRecursive(targetFiles, cPath);
            }
        }
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