/**
 * Created by ozgur on 24.07.2017.
 */

var assert = require('assert');
var fs = require("fs");
var path = require("path");
var LineCounter = require("../lib/LineCounter");
var ExtensionsFactory = require("../lib/Extensions");
var Rules = require("../lib/Rules");

describe("LineCounter", function(){

    before(function(){
        var dir = __dirname;
        fs.mkdirSync(path.join(dir, "dir"));
        fs.mkdirSync(path.join(dir, "dir", "dir2"));
        fs.mkdirSync(path.join(dir, "dir", "dir3"));
        fs.writeFileSync(path.join(dir, "dir", "file1.java"), "line1\nline2");
        fs.writeFileSync(path.join(dir, "dir", "file1.js"), "line1\nline2\nline3");
        fs.writeFileSync(path.join(dir, "dir", "dir2", "file3.php"), "line1\nline2");
        fs.writeFileSync(path.join(dir, "dir", "dir2", "file4.swift"), "line1\nline2");
        fs.writeFileSync(path.join(dir, "dir", "dir3", "file5.java"), "line1\nline2");
        fs.writeFileSync(path.join(dir, "dir", "dir3", "file6.js"), "line1\nline2");
    });

    describe("#resolveTargetFiles()", function(){
        it("should return allowed extensions", function(){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.setExtensions(ExtensionsFactory.from("js"));
            var result = lc.resolveTargetFiles();
            var expected = [ path.join(__dirname, "dir", "dir3", "file6.js"), path.join(__dirname, "dir", "file1.js") ];
            for( var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], result[i].getPath());
            }
        });

        it("should return all except disallowed ones", function(){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.setExtensions(ExtensionsFactory.except("java, swift, php"));
            var result = lc.resolveTargetFiles();
            var expected = [ path.join(__dirname, "dir", "dir3", "file6.js"), path.join(__dirname, "dir", "file1.js") ];
            for( var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], result[i].getPath());
            }
        });

        it("should return all", function(){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            var result = lc.resolveTargetFiles();
            var expected = [ path.join(__dirname, "dir", "dir2", "file3.php"), path.join(__dirname, "dir", "dir2", "file4.swift"),
                path.join(__dirname, "dir", "dir3", "file5.java"), path.join(__dirname, "dir", "dir3", "file6.js"),
                path.join(__dirname, "dir", "file1.java"), path.join(__dirname, "dir", "file1.js")];
            for( var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], result[i].getPath());
            }
        });
    });

    describe("#getLines()", function(){
        it("should count all files correctly", function(done){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.getLines(function(result){
                assert.equal(6, result.files);
                assert.equal(13, result.lines);
                done();
            });
        });
        it("should count only js files", function(done){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.setExtensions(ExtensionsFactory.from("js"));
            lc.getLines(function(result){
                assert.equal(2, result.files);
                assert.equal(5, result.lines);
                done();
            });
        });
    });

    describe("#addRule()", function(){
        it("should return only the files starts with file1", function(){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.addRule(Rules.filePrefix, "file1");
            var result = lc.resolveTargetFiles();
            var expected = [ path.join(__dirname, "dir", "file1.java"), path.join(__dirname, "dir", "file1.js") ];
            for( var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], result[i].getPath());
            }
        });
        it("should ignore dir2 and dir3 directories", function(){
            var lc = new LineCounter();
            lc.setPath(path.join(__dirname, "dir"));
            lc.addRule(Rules.ignoreDir, "dir2");
            lc.addRule(Rules.ignoreDir, "dir3");
            var result = lc.resolveTargetFiles();
            var expected = [ path.join(__dirname, "dir", "file1.java"), path.join(__dirname, "dir", "file1.js") ];
            for( var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], result[i].getPath());
            }
        });
    });

    after(function(){
        var dir = __dirname;
        fs.unlinkSync(path.join(dir, "dir", "dir3", "file6.js"));
        fs.unlinkSync(path.join(dir, "dir", "dir3", "file5.java"));
        fs.unlinkSync(path.join(dir, "dir", "dir2", "file4.swift"));
        fs.unlinkSync(path.join(dir, "dir", "dir2", "file3.php"));
        fs.unlinkSync(path.join(dir, "dir", "file1.js"));
        fs.unlinkSync(path.join(dir, "dir", "file1.java"));
        fs.rmdirSync(path.join(dir, "dir", "dir2"));
        fs.rmdirSync(path.join(dir, "dir", "dir3"));
        fs.rmdirSync(path.join(dir, "dir"));
    });

});