"use strict";
console.clear();
function log() {
  console.log("📄", ...arguments);
}
function error() {
  console.error("❌", ...arguments);
}

log(.25 + 0.11);