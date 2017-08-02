/**
 * Created by ozgur on 31.07.2017.
 */

var assert = require('assert');
var Rules = require("../lib/Rules");
var fs = require("fs");
var path = require("path");

describe("File", function(){

    var stats = {
        isFile: function(){
            return true;
        },
        isDirectory: function(){
            return true;
        }
    };

    describe("#filePrefix()", function(){
        it("should return true", function(){
            assert.equal(true, Rules.filePrefix("fileName.ext", stats, "fileN"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.filePrefix("fileName.ext", stats, "file1N"));
        });
    });

    describe("#filePostfix()", function(){
        it("should return true", function(){
            assert.equal(true, Rules.filePostfix("fileName.ext", stats, "eName"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.filePostfix("fileName.ext", stats, "2eName"));
        });
    });

    describe("#fileIgnorePrefix()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.fileIgnorePrefix("fileName.ext", stats, "fileN"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.fileIgnorePrefix("fileName.ext", stats, "file1N"));
        });
    });

    describe("#fileIgnorePostfix()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.fileIgnorePostfix("fileName.ext", stats, "eName"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.fileIgnorePostfix("fileName.ext", stats, "2eName"));
        });
    });

    describe("#ignoreFile()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.ignoreFile("fileName.ext", stats, "fileName.ext"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.ignoreFile("fileName.ext", stats, "fileName2.ext"));
        });
    });

    describe("#ignoreDir()", function(){
        it("should return true", function(){
            assert.equal(false, Rules.ignoreDir("dirName", stats, "dirName"));
        });
        it("should return false", function(){
            assert.equal(true, Rules.ignoreDir("dirName", stats, "dirName2"));
        });
    });

});
