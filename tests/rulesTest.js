/**
 * Created by ozgur on 31.07.2017.
 */

var assert = require('assert');
var Rules = require("../lib/Rules");
var fs = require("fs");
var path = require("path");

describe("File", function(){

    describe("#prefix()", function(){
        it("should return true", function(){
            assert.equal(true, Rules.prefix("fileName.ext", null, "fileN"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.prefix("fileName.ext", null, "file1N"));
        });
    });

    describe("#postfix()", function(){
        it("should return true", function(){
            assert.equal(true, Rules.postfix("fileName.ext", null, "eName"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.postfix("fileName.ext", null, "2eName"));
        });
    });

    describe("#ignorePrefix()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.ignorePrefix("fileName.ext", null, "fileN"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.ignorePrefix("fileName.ext", null, "file1N"));
        });
    });

    describe("#ignorePostfix()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.ignorePostfix("fileName.ext", null, "eName"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.ignorePostfix("fileName.ext", null, "2eName"));
        });
    });

});
