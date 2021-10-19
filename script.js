'use strict';
console.clear();
function log() {
  console.log('📄', ...arguments);
}
function error() {
  console.error('❌', ...arguments);
}
// This line throws an error, but with it I get d3 working, so I'll ignore the error message.
// @ts-ignore
import * as d3 from 'https://cdn.skypack.dev/d3@7';

function timeToDecimal(yearMonthDay) {
  const [year, month] = yearMonthDay.split('-').map(item => +item);
  const decimal = (month - 1) / 12;
  return year + decimal;
}

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then(data => {
  const width = document.querySelector('.canvas').clientWidth,
    height = document.querySelector('.canvas').clientHeight,
    padding = 50,
    innerWidth = width - 2 * padding,
    innerHeight = height - 2 * padding;

  const svg = d3.select('svg');

  const dateGDPList = data.data;

  const timeScale = d3
      .scaleLinear()
      .domain([
        d3.min(dateGDPList, item => timeToDecimal(item[0])),
        d3.max(dateGDPList, item => timeToDecimal(item[0])),
      ])
      .range([padding, padding + innerWidth]),
    GDPScale = d3
      .scaleLinear()
      .domain([0, d3.max((data = data[1]))])
      .range([padding + innerHeight, padding]),
    GDPAxisScale = d3
      .scaleLinear()
      .domain([0, d3.max((data = data[1]))])
      .range([padding, padding + innerHeight]);

  svg
    .selectAll('rect')
    .data(dateGDPList)
    .enter()
    .append('rect')
    .attr('x', item => timeScale(item[0]))
    .attr('y', item => padding + innerHeight - GDPScale(item[1]))
    .attr('width', 50)
    .attr('height', 50);
});
