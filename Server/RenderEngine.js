"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function renderEngine(filePath, optionsOBJ, callback) {
    var rendered;
    fs.readFile(filePath, function (err, data) {
        if (err)
            return callback(new Error(err.message));
        rendered = data.toString();
        if (optionsOBJ.options != null && optionsOBJ.skeleton == null) {
            Object.keys(optionsOBJ.options).forEach(function (value) {
                if (value != "settings" && value != "_locals" && value != "cache") {
                    var toReplace = "##" + value.toString() + "##";
                    var re = new RegExp(toReplace, 'g');
                    rendered = rendered.replace(re, optionsOBJ.options[value].toString());
                }
            });
        }
        if (optionsOBJ.skeleton != null) {
            fs.readFile(optionsOBJ.skeleton, function (err, data) {
                if (err)
                    return callback(new Error(err.message));
                var skeleton = data.toString();
                var cssText = "";
                var cssToAdd = rendered.match(/###\s*(?:css|Css)\s*=((?:\s*\"[\s\S]*?\")*?)\s*###/);
                if (cssToAdd != null) {
                    Array.from(cssToAdd[1].matchAll(/\"([\s\S]+?)\"/g)).forEach(function (e) {
                        cssText += "		<link rel='stylesheet' href='" + e[1] + "' />\n";
                    });
                }
                var scriptText = "";
                var scriptToAdd = rendered.match(/###\s*(?:Scripts|scripts)\s*=((?:\s*\"[\s\S]*?\")*?)\s*###/);
                if (scriptToAdd != null) {
                    Array.from(scriptToAdd[1].matchAll(/\"([\s\S]+?)\"/g)).forEach(function (e) {
                        scriptText += "	<script src='" + e[1] + "'> </script>\n";
                    });
                }
                var titleToAdd = rendered.match(/###\s*(?:Title|title)\s*=\s*\"([\s\S]+?)\"\s*###/);
                var titleText = titleToAdd != null ? titleToAdd[1] : "";
                var contentToAdd = rendered.match(/###\s*(?:Content|content)\s*=\s*([\s\S]*?)\s*###/);
                var contentText = contentToAdd != null ? contentToAdd[1] : "";
                skeleton = skeleton.replace(/###\s*(?:Replace|replace)\s*:\s*(?:Css|css)\s*###/, cssText);
                skeleton = skeleton.replace(/###\s*(?:Replace|replace)\s*:\s*(?:Scripts|scripts)\s*###/, scriptText);
                skeleton = skeleton.replace(/###\s*(?:Replace|replace)\s*:\s*(?:Title|title)\s*###/, titleText);
                skeleton = skeleton.replace(/###\s*(?:Replace|replace)\s*:\s*(?:Content|content)\s*###/, contentText);
                rendered = skeleton;
                if (optionsOBJ.options != null) {
                    Object.keys(optionsOBJ.options).forEach(function (value) {
                        if (value != "settings" && value != "_locals" && value != "cache") {
                            var toReplace = "##" + value.toString() + "##";
                            var re = new RegExp(toReplace, 'g');
                            rendered = rendered.replace(re, optionsOBJ.options[value].toString());
                        }
                    });
                }
                return callback(null, rendered);
            });
        }
        else
            return callback(null, rendered);
    });
}
exports.renderEngine = renderEngine;
