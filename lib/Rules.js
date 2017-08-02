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

function Rules(){}

Rules.filePrefix = function(name, stats, token){
    if( stats.isFile() ){
        var r = new RegExp("^" + token);
        var result = r.exec(name);
        return result !== null && result.length > 0;
    }
    else{
        return true;
    }
};

Rules.filePostfix = function(name, stats, token){
    if( stats.isFile() ){
        var r = new RegExp(token + "$");
        name = name.split(".");
        name.pop();
        name = name.join("."); // remove extension
        var result = r.exec(name);
        return result !== null && result.length > 0;
    }
    else{
        return true;
    }
};

Rules.fileIgnorePrefix = function(name, stats, token){
    if( stats.isFile() ){
        var r = new RegExp("^" + token);
        var result = r.exec(name);
        return result === null || result.length === 0;
    }
    else{
        return true;
    }
};

Rules.fileIgnorePostfix = function(name, stats, token){
    if( stats.isFile() ){
        var r = new RegExp(token + "$");
        name = name.split(".");
        name.pop();
        name = name.join("."); // remove extension
        var result = r.exec(name);
        return result === null || result.length === 0;
    }
    else{
        return true;
    }
};

Rules.ignoreFile = function(name, stats, token){
    if( stats.isFile() ){
        return name !== token;
    }
    else{
        return true;
    }
};

Rules.ignoreDir = function(name, stats, token){
    if( stats.isDirectory() ){
        return name !== token;
    }
    else{
        return true;
    }
};

module.exports = Rules;