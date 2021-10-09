"use strict";
console.clear();
function log() {
  console.log("📄", ...arguments);
}
function error() {
  console.error("❌", ...arguments);
}
// This line throws an error, but with it I get d3 working, so I'll ignore the error message.
// @ts-ignore
import * as d3 from "https://cdn.skypack.dev/d3@7";

/*
  1. Fetch the data in a try catch block, and log it to the console.
  2. Add an svg canvas to the container div.
  3. Set up the scale in the canvas.
  4. Within the canvas, render a point for every data point received.
*/

/**
 * Asynchronously fetches data from the provided url.
 * @param {string} url The url to fetch data from.
 * @returns {Promise} The resolved promise.
 */
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const USGDP = await fetchData(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );
    const coordinates = USGDP.data; // An array containing hundreds of arrays, each in a ['1947-01-01', 243.1] format.
    const canvasHeight = document.querySelector(".canvas").clientHeight;
    const canvasWidth = document.querySelector(".canvas").clientWidth;
    const canvasPadding = 50;
    // The scale for the time.
    const xScale = d3
      .scaleLinear()
      .domain([
        // parseFloat since the first items of the arrays are strings.
        // parseFloat(month) - 1 / 12 yields the decimal of the year based off of the month string.
        d3.min(coordinates, data => {
          const [year, month] = data[0].split("-");
          return parseFloat(year) + (parseFloat(month) - 1) / 12;
        }),
        d3.max(coordinates, data => {
          const [year, month] = data[0].split("-");
          return parseFloat(year) + (parseFloat(month) - 1) / 12;
        }),
      ])
      .range([canvasPadding, canvasWidth - canvasPadding]);
    // The scale for the GDP.

    const yScale = d3
      .scaleLinear()
      .domain([
        // No parseInt required for the second value in the array.
        d3.min(coordinates, data => data[1]),
        d3.max(coordinates, data => data[1]),
      ])
      .range([canvasPadding, canvasHeight - canvasPadding]);

    const svg = d3.select("svg");
    svg
      .selectAll("rect")
      .data(coordinates)
      .enter()
      .append("rect")
      .attr(
        // Need to scale the year of the data point, plus .0, .25, .5, or .75, depending on the quarter.
        "x",
        data => {
          const [year, month] = data[0].split("-");
          return xScale(parseFloat(year) + (parseFloat(month) - 1) / 12);
        }
      )
      .attr("y", data => canvasHeight - yScale(data[1]) - canvasPadding)
      // Exclude padding on both sides, and divide by 275 - so every rectangle shares an equal portion of the available space.
      .attr("width", (canvasWidth - 2 * canvasPadding) / 275)
      .attr("height", data => yScale(data[1]))
      .attr("class", "bar")
      .append("title")
      .text(data => {
        return `$${data[1]}B,
      ${data[0].split("-")[0]} ${
          data[0].split("-")[1] === "01"
            ? "Q1"
            : data[0].split("-")[1] === "04"
            ? "Q2"
            : data[0].split("-")[1] === "07"
            ? "Q3"
            : "Q4"
        }`;
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${canvasHeight - canvasPadding})`)
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${canvasPadding}, 0)`)
      .call(yAxis);
  } catch (err) {
    error(err);
  }
});
