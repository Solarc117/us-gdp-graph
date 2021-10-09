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

async function load() {
  try {
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then(USGDP => {
      render(USGDP.data);
    });
  } catch (err) {
    error(err);
  }
}

function render(timeGDPList) {
  const height = document.querySelector(".canvas").clientHeight,
    width = document.querySelector(".canvas").clientWidth;
  const padding = {
    top: 5,
    right: 10,
    bottom: 20,
    left: 40,
  };
  const innerWidth = width - padding.left - padding.right,
    innerHeight = height - padding.top - padding.bottom;

  const xValue = data => timeToDecimal(data[0]),
    yValue = data => data[1];

  // Maps time to the width of the canvas.
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(timeGDPList, timeGDPPair => xValue(timeGDPPair)),
      d3.max(timeGDPList, timeGDPPair => xValue(timeGDPPair)),
    ])
    .range([padding.left, width - padding.right]);
  // Maps GDP to the height of the canvas.
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(timeGDPList, timeGDPPair => yValue(timeGDPPair))])
    .range([padding.top, height - padding.bottom]);
  const yHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(timeGDPList, timeGDPPair => yValue(timeGDPPair))])
    .range([height - padding.bottom, padding.top]);

  const svg = d3.select("svg");

  const g = svg.append("g");

  g.selectAll("rect")
    .data(timeGDPList)
    .enter()
    .append("rect")
    .attr("class", "bar")
    // We simply map the data to the axis in the x and y attributes.
    .attr("x", timeGDPPair => xScale(xValue(timeGDPPair)))
    .attr("y", timeGDPPair => innerHeight - yScale(yValue(timeGDPPair)))
    // The width is the same for every bar - if we wanted a margin, we woulb subtract half of it after the division (**VERIFY**):
    // width / timeGDPList.length - 2 * margin
    .attr("width", innerWidth / timeGDPList.length)
    .attr("height", timeGDPPair => yScale(yValue(timeGDPPair)));
}

/**
 * Converts year-month-day format strings to years with decimals.
 * @param {string} time In year-month-day format.
 * @returns {number} The year, with a decimal corresponding to the month in the passed argument.
 */
function timeToDecimal(time) {
  if (typeof time === "string") {
    const [year, month] = time.split("-").map(unit => +unit);
    return year + (month - 1) / 12;
  } else {
    warn("timeToDecimal argument not of format year-month-day string: " + time);
    return time;
  }
}

load();

// Results in a bug where multiple bars are created.
// window.onresize = load;
