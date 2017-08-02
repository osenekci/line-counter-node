/**
 * Created by ozgur on 24.07.2017.
 */

var assert = require('assert');
var ExtensionFactory = require("../lib/Extensions");

describe("Extensions", function(){

    describe("#getType()", function(){
        it("should match with factory types", function(){
            var ext = ExtensionFactory.except("");
            assert.equal(ExtensionFactory.EXCEPT, ext.getType());
            ext = ExtensionFactory.from("");
            assert.equal(ExtensionFactory.TARGET, ext.getType());
            ext = ExtensionFactory.except([]);
            assert.equal(ExtensionFactory.EXCEPT, ext.getType());
            ext = ExtensionFactory.from([]);
            assert.equal(ExtensionFactory.TARGET, ext.getType());
        })
    });

    describe("#getExtensions()", function(){
        var expected = ["js", "php", "swift"];
        it("should create extension array correctly", function(){
            var ext = ExtensionFactory.except("js, php, swift");
            assert.deepStrictEqual(expected, ext.getExtensions());
            ext = ExtensionFactory.except(["js", "php", "swift"]);
            assert.deepStrictEqual(expected, ext.getExtensions());
        });
    });

    describe("#hasExtensions()", function(){
        it("should accept given extensions", function(){
            var ext = ExtensionFactory.from("js, php, swift");
            assert.equal(true, ext.verifyExtensions("js"));
            assert.equal(true, ext.verifyExtensions("php"));
            assert.equal(true, ext.verifyExtensions("swift"));
        });
        it("should accept all extensions except given ones", function(){
            var ext = ExtensionFactory.except("js, php, swift");
            assert.equal(false, ext.verifyExtensions("js"));
            assert.equal(false, ext.verifyExtensions("php"));
            assert.equal(false, ext.verifyExtensions("swift"));
            assert.equal(true, ext.verifyExtensions("java"));
        });
    });

});