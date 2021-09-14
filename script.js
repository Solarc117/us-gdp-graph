"use strict";
console.clear();
function log() {
  console.log("📄", ...arguments);
}
function error() {
  console.error("❌", ...arguments);
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const data = await fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then(res => res.json());
    Object.keys(data).forEach(key => {});
  } catch (err) {
    error(err);
  }
});
