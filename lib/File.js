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

function File(path){

    var fs = require("fs");

    /**
     * Gives total lines in a file asynchronously
     * @param callback
     */
    this.getLines = function(callback){
        var lines = 0;
        var stream = fs.createReadStream(path, { encoding: "utf8" });
        stream.on("end", function(){
            callback(lines);
        });
        stream.on("data", function(chunk){
            lines += chunk.split("\n").length;
        });
    };

    /**
     * Returns given path
     * @returns {string}
     */
    this.getPath = function(){
        return path;
    };

}

module.exports = File;