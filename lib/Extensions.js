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

function Extensions(extType, extList){

    /**
     * Meaning the given extensions are targeted
     * @type {string}
     */
    const TARGET = "target";


    /**
     * Meaning all the extensions will be targeted except given extensions
     * @type {string}
     */
    const EXCEPT = "except";


    /**
     * Extension list
     * @type {Array}
     */
    var extensions = extList;


    /**
     * target|except
     */
    var type = extType;


    /**
     * @returns {string}
     */
    this.getType = function(){
        return type;
    };


    /**
     * @returns {Array} of extensions
     */
    this.getExtensions = function(){
        return extensions;
    };


    /**
     * @param ext string extension
     * @returns {boolean}
     */
    this.verifyExtensions = function(ext){
        if( type === TARGET ){
            return extensions.indexOf(ext) >= 0;
        }
        else{
            return extensions.indexOf(ext) < 0;
        }
    };

}

var Factory = (function(Extensions){

    function Factory(){}

    Factory.TARGET = "target";

    Factory.EXCEPT = "except";

    Factory.from = function(extensions){
        var extList = createExtensionArray(extensions);
        return new Extensions(Factory.TARGET, extList);
    };

    Factory.except = function(extensions){
        var extList = createExtensionArray(extensions);
        return new Extensions(Factory.EXCEPT, extList);
    };

    function createExtensionArray(extensions){
        var extList = [], i, ext;
        if( typeof extensions === 'string' ){
            var tokens = extensions.split(",");
            for( i = 0; i < tokens.length; i++ ){
                ext = tokens[i].trim();
                if( ext !== '' ){
                    extList.push(ext);
                }
            }
            return extList;
        }
        else if( Array.isArray(extensions) ){
            for( i = 0; i < extensions.length; i++ ){
                ext = extensions[i].trim();
                if( ext !== '' ){
                    extList.push(ext);
                }
            }
            return extList;
        }
        else{
            throw new Error("Invalid argument extensions");
        }
    }

    return Factory;

})(Extensions);

module.exports = Factory;