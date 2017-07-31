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

Rules.prefix = function(name, stats, token){
    var r = new RegExp("^" + token);
    var result = r.exec(name);
    return result !== null && result.length > 0;
};

Rules.postfix = function(name, stats, token){
    var r = new RegExp(token + "$");
    name = name.split(".");
    name.pop();
    name = name.join("."); // remove extension
    var result = r.exec(name);
    return result !== null && result.length > 0;
};

Rules.ignorePrefix = function(name, stats, token){
    var r = new RegExp("^" + token);
    var result = r.exec(name);
    return result === null || result.length === 0;
};

Rules.ignorePostfix = function(name, stats, token){
    var r = new RegExp(token + "$");
    name = name.split(".");
    name.pop();
    name = name.join("."); // remove extension
    var result = r.exec(name);
    return result === null || result.length === 0;
};

Rules.ignore = function(name, stats, token){
    return name !== token;
};

module.exports = Rules;