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
  const barWidth = width / numBars; // The width of the svg canvas, divided evenly between the number of bars we'll render.
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(yearAgeCollection, pair => pair[0]),
      d3.max(yearAgeCollection, pair => pair[0]),
    ])
    .range([padding, padding + innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(yearAgeCollection, pair => pair[1]),
      d3.max(yearAgeCollection, pair => pair[1]),
    ])
    .range([innerHeight + padding, padding]);
  // You need to select the svg container with d3 in order to append other d3 methods.
  d3.select("svg")
    .selectAll("rect")
    .data(yearAgeCollection)
    .enter()
    .append("rect")
    .attr("x", pair => xScale(pair[0]))
    .attr("y", pair => height - padding - yScale(pair[1]))
    .attr("width", 50)
    .attr("height", 50);
}

async function load() {
  try {
    const yearAge = [
      [2002, 0],
      [2003, 1],
      [2004, 2],
    ];
    render(yearAge);
  } catch (err) {
    error(err);
  }
}

window.onload = load;
