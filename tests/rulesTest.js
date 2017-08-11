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

    describe("#ignoreFiles()", function(){
        it("should return false", function(){
            assert.equal(false, Rules.ignoreFiles("fileName.ext", stats, "fileName.ext", "fileName2.ext"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.ignoreFiles("fileName2.ext", stats, "fileName.ext", "fileName2.ext"));
        });
        it("should return true", function(){
            assert.equal(true, Rules.ignoreFiles("fileName.ext", stats, "fileName2.ext", "fileName3.ext"));
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

    describe("#ignoreDirs()", function(){
        it("should return false", function(){
            assert.equal(false, Rules.ignoreFiles("dirName", stats, "dirName", "dirName2"));
        });
        it("should return false", function(){
            assert.equal(false, Rules.ignoreFiles("dirName2", stats, "dirName", "dirName2"));
        });
        it("should return true", function(){
            assert.equal(true, Rules.ignoreFiles("dirName", stats, "dirName2", "dirName3"));
        });
    });

    describe("#ingoreHidden()", function(){
        it("should not accept dotfiles", function(){
            assert.equal(false, Rules.ignoreHidden(".dirName", stats));
            assert.equal(true, Rules.ignoreHidden("dirName", stats));
        });
    });

    describe("#regexFile()", function(){
        it("should allow given regex", function(){
            assert.equal(true, Rules.regexFile("fileName.txt", stats, "^file[a-zA-Z]+\.txt$"));
            assert.equal(false, Rules.regexFile("fileName.txt", stats, "^file[a-zA-Z]\.txt$"));
        });
    });

    describe("#regexDir()", function(){
        it("should allow given regex", function(){
            assert.equal(true, Rules.regexFile("dirName", stats, "^dir[a-zA-Z]+$"));
            assert.equal(false, Rules.regexFile("dirName", stats, "^dir[a-zA-Z]$"));
        });
    });

});
