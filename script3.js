"use strict";
console.clear();
function log() {
  console.log("📄", ...arguments);
}
function warn() {
  console.warn("⚠", ...arguments);
}
function error() {
  console.error("❌", ...arguments);
}

// @ts-ignore
import * as d3 from "https://cdn.skypack.dev/d3@7";

/**
 * Render the passed data onto the svg canvas as a bar graph.
 * @param {Array} yearAgeCollection
 */
function render(yearAgeCollection) {
  const svg = document.querySelector(".canvas");
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  const padding = 50;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;
  const numBars = yearAgeCollection.length;
  const barWidth = innerWidth / numBars; // The width of the svg canvas, divided evenly between the number of bars we'll render.
  const xScale = d3
    .scaleLinear()
    .domain([2002, 2004])
    .range([padding, padding + innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 5])
    .range([innerHeight / 3, innerHeight]);
  // You need to select the svg container with d3 in order to append other d3 methods.
  d3.select("svg")
    .selectAll("rect")
    .data(yearAgeCollection)
    .enter()
    .append("rect")
    .attr("x", (pair, i) => i * barWidth + padding)
    .attr("y", pair => innerHeight + padding - yScale(pair[1]))
    .attr("width", barWidth)
    .attr("height", pair => yScale(pair[1]));
}

async function load() {
  try {
    const yearAge = [
      [2003, 1],
      [2004, 2],
      [2005, 3],
    ];
    render(yearAge);
  } catch (err) {
    error(err);
  }
}

load();

window.onresize = load;
