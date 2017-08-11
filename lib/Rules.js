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
        name = getFileName(name);
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
        name = getFileName(name);
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

Rules.ignoreFiles = function(){
    var name = arguments[0];
    var stats = arguments[1];
    if( stats.isFile() ){
        var matched = false;
        for( var i = 2; i < arguments.length; i++ ){
            if( arguments[i] === name ){
                matched = true;
                break;
            }
        }
        return !matched;
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

Rules.ignoreDirs = function(){
    var name = arguments[0];
    var stats = arguments[1];
    if( stats.isDirectory() ){
        var matched = false;
        for( var i = 2; i < arguments.length; i++ ){
            if( arguments[i] === name ){
                matched = true;
                break;
            }
        }
        return !matched;
    }
    else{
        return true;
    }
};

Rules.ignoreHidden = function(name){
    if( name === "." ){
        return true
    }
    else{
        return name.indexOf(".") !== 0;
    }
};

Rules.regexFile = function(name, stats, expression){
    if( stats.isFile() ){
        var r = new RegExp(expression);
        var result = r.exec(name);
        return result !== null && result.length > 0;
    }
    else{
        return true;
    }
};

Rules.regexDir = function(name, stats, expression){
    if( stats.isDirectory() ){
        var r = new RegExp(expression);
        var result = r.exec(name);
        return result !== null && result.length > 0;
    }
    else{
        return true;
    }
};

function getFileName(fileNameWithExtension){
    fileNameWithExtension = fileNameWithExtension.split(".");
    fileNameWithExtension.pop();
    return fileNameWithExtension.join("."); // remove extension
}

module.exports = Rules;