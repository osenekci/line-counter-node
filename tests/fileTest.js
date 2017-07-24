/**
 * Created by ozgur on 24.07.2017.
 */

var assert = require('assert');
var File = require("../lib/File");
var fs = require("fs");
var path = require("path");

describe("File", function(){

    describe("#getPath()", function(){
        it("should return the path passed to the constructor", function(){
            var file = new File("test/path");
            assert.equal("test/path", file.getPath());
        });
    });

    describe("#getLines()", function(){
        before(function(){
            fs.writeFileSync(path.join(__dirname, "file1.java"), "line1\nline2");
            fs.writeFileSync(path.join(__dirname, "file2.java"), "line1\nline2\nline3");
        });

        it("should give 2", function(done){
            var file = new File(path.join(__dirname, "file1.java"));
            file.getLines(function(lines){
                assert.equal(2, lines);
                done();
            });
        });

        it("should give 3", function(done){
            var file = new File(path.join(__dirname, "file2.java"));
            file.getLines(function(lines){
                assert.equal(3, lines);
                done();
            });
        });

        after(function(){
            fs.unlinkSync(path.join(__dirname, "file1.java"));
            fs.unlinkSync(path.join(__dirname, "file2.java"));
        });
    });

});
