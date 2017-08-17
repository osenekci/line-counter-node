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

function File(filePath, stats){

    const fs = require("fs");
    const path = require("path");

    /**
     * Returns stats object of the given file
     * @returns {*}
     */
    this.getStats = function(){
        return stats;
    };

    /**
     * Returns only file name
     */
    this.getName = function(){
        return path.basename(filePath);
    };

    /**
     * Gives total lines in a file asynchronously
     * @param callback
     */
    this.getLines = function(callback){
        var lines = 0;
        var stream = fs.createReadStream(filePath, { encoding: "utf8" });
        stream.on("end", function(){
            callback(lines, null);
        });
        stream.on("data", function(chunk){
            lines += chunk.split("\n").length;
        });
        stream.on("error", function(r){
            callback(0, true);
        });
    };

    /**
     * Returns given path
     * @returns {string}
     */
    this.getPath = function(){
        return filePath;
    };

}

module.exports = File;