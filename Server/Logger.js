"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = function (msg) {
    console.log(msg);
};
exports.info = function (msg) {
    console.log("[INFO] " + msg + "\x1b[0m");
};
exports.important = function (msg) {
    console.log("\x1b[33m[I] " + msg + "\x1b[0m");
};
exports.vimportant = function (msg) {
    console.log("\x1b[35m[VI] " + msg + "\x1b[0m");
};
exports.debug = function (msg) {
    console.log("\x1b[36m[DEBUG] " + msg + "\x1b[0m");
};
