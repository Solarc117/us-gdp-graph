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

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    );
    const data = await response.json();
    const coordinates = data.data; // An array containing hundreds of arrays, each in a ['1947-01-01', 243.1] format.
    const canvasHeight = document.querySelector(".canvas").clientHeight;
    const canvasWidth = document.querySelector(".canvas").clientWidth;
    const canvasPadding = 20;
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(coordinates, data => {
          if (data[0] === undefined) log("undefined data at xScale.domain()");
          data[0].split("-")[0]
        }),
        d3.max(coordinates, data => {
          data[0].split("-")[0]}),
      ])
      // Why do I need to subtract 10 from the canvasWidth to show the full data? 
      .range([canvasPadding, canvasWidth - canvasPadding]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(coordinates, data => data[1]),
        d3.max(coordinates, data => data[1]),
      ])
      .range([canvasPadding, canvasHeight - canvasPadding]);

    const svg = d3.select("svg").style("background", "pink");
    svg
      .selectAll("rect")
      .data(coordinates)
      .enter()
      .append("rect")
      .attr(
        // Need to scale the year of the data point, plus .0, .25, .5, or .75, depending on the quarter.
        "x",
        data => {
          if (data[0] === undefined) {log("undefined data at svg.attr()")};
          const month = data[0].split("-")[1];
          const decimal =
            month === "01"
              ? 0
              : month === "04"
              ? 0.25
              : month === "07"
              ? 0.5
              : 0.75;
              if (typeof parseInt(data[0].split("-")[0]) + decimal !== "number") {log(typeof (parseInt(data[0].split("-")[0]) + decimal));}
                return xScale(parseInt(data[0].split("-")[0]) + decimal);
        }
      )
      .attr("y", data => canvasHeight - yScale(data[1]))
      .attr("width", 5)
      .attr("height", data => yScale(data[1]))
      .attr("class", "bar")
      .append("title")
      .text(
        data => {
          if (data[0] === undefined) log("undefined at svg.text()");
          return `$${data[1]}B,
      ${data[0].split("-")[0]} ${
          data[0].split("-")[1] === "01"
            ? "Q1"
            : data[0].split("-")[1] === "04"
            ? "Q2"
            : data[0].split("-")[1] === "07"
            ? "Q3"
            : "Q4"
        }`}
      );
    svg
      .selectAll("text")
      .data(coordinates)
      .enter()
      .append("text")
      .attr("x", xScale(data[0].split("-")[0]) + 5)
      .attr("y", data => canvasHeight - data[1] / 48 - 3)
      .text(data => data[1])
      .style("font-size", 10);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${canvasHeight - canvasPadding})`)
        .call(xAxis);
    svg.append("g")
        .attr("transform", `translate(${canvasPadding}, 0)`)
        .call(yAxis)
  } catch (err) {
    error(err);
  }
});
