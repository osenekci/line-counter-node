/**
 * Created by ozgur on 24.07.2017.
 */

var assert = require("assert");
var path = require("path");
var LineCounter = require("../index").LineCounter;
var ExtensionsFactory = require("../index").ExtensionsFactory;

describe("LineCounterModule", function(){

    it("should run correctly", function(done){
        var lc = new LineCounter();
        lc.setPath(path.join(__dirname, "testIndex.js"));
        lc.setExtensions(ExtensionsFactory.from("js"));
        lc.getLines(function(result){
            assert.equal(1, result.files);
            assert.equal(23, result.lines);
            done();
        });
    });

});