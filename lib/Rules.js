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

/**
 * Looks for matches file prefix
 * @param name
 * @param stats
 * @param token
 * @returns {boolean}
 */
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


/**
 * Looks for matches file postfix (only file name without extension)
 * @param name
 * @param stats
 * @param token
 * @returns {boolean}
 */
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


/**
 * Ignores matches file prefix
 * @param name
 * @param stats
 * @param token
 * @returns {boolean}
 */
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


/**
 * Ignores matches file postfix
 * @param name
 * @param stats
 * @param token
 * @returns {boolean}
 */
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


/**
 * Ignores given file names
 * @returns {boolean}
 */
Rules.ignoreFile = function(){
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


/**
 * @deprecated use ignoreFile instead
 * @returns {boolean}
 */
Rules.ignoreFiles = function(){
    return Rules.ignoreFile.apply(this, arguments);
};


/**
 * Ignores given directory names
 * @returns {boolean}
 */
Rules.ignoreDir = function(){
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


/**
 * @deprecated use ignoreDir instead
 * @returns {boolean}
 */
Rules.ignoreDirs = function(){
    return Rules.ignoreDir.apply(this, arguments);
};


/**
 * Ignores all dot files
 * @param name
 * @returns {boolean}
 */
Rules.ignoreHidden = function(name){
    if( name === "." ){
        return true
    }
    else{
        return name.indexOf(".") !== 0;
    }
};


/**
 * Looks for regex matches of files (with extension)
 * @param name
 * @param stats
 * @param expression
 * @returns {boolean}
 */
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


/**
 * Looks for regex matches of directories
 * @param name
 * @param stats
 * @param expression
 * @returns {boolean}
 */
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


/**
 * Ignores given extensions
 * @returns {boolean}
 */
Rules.ignoreExt = function(){
    var name = arguments[0];
    var stats = arguments[1];
    if( stats.isDirectory() || arguments.length < 3 ){
        return true;
    }
    else{
        var ext = getExtension(name);
        for( var i = 2; i < arguments.length; i++ ){
            if( ext === arguments[i] ){
                return false;
            }
        }
        return true;
    }
};


/**
 * Development option. Ignores dot files, some vendor directories and some extensions
 * @param name
 * @param stats
 * @returns {boolean|*}
 */
Rules.dev = function(name, stats){
    if( stats.isDirectory() ) {
        return Rules.ignoreHidden(name) &&
            Rules.ignoreDir.apply(this, [name, stats, "node_modules", "bower_components", "vendor", "out", "build", "proguard"]);
    }
    else{
        return Rules.ignoreHidden(name) &&
            Rules.ignoreExt.apply(this, [name, stats, "log", "ini", "iml", "db", "yml", "md", "json", "conf"]);
    }
};

function getExtension(fileNameWithExtension){
    fileNameWithExtension = fileNameWithExtension.split(".");
    if( fileNameWithExtension.length > 1 ){
        return fileNameWithExtension[fileNameWithExtension.length - 1];
    }
    else{
        return "";
    }
}

function getFileName(fileNameWithExtension){
    fileNameWithExtension = fileNameWithExtension.split(".");
    fileNameWithExtension.pop();
    return fileNameWithExtension.join("."); // remove extension
}

module.exports = Rules;