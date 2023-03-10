"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.log = void 0;
function log(...args) {
    console.log("⟦KYATSU LOG⟧", ...args);
}
exports.log = log;
function test(...args) {
    console.log("⟦KYATSU TEST⟧", ...args);
}
exports.test = test;
