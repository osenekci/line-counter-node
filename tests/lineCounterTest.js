/**
 * Created by ozgur on 24.07.2017.
 */

var assert = require('assert');
var fs = require("fs");
var path = require("path");

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