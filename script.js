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
)
  .then(data => {
    const svg = d3.select('svg');

    const dateGDPList = data.data;
    log(data);


    const width = document.querySelector('.canvas').clientWidth,
      height = document.querySelector('.canvas').clientHeight,
      padding = 50,
      innerWidth = width - 2 * padding,
      innerHeight = height - 2 * padding,
      barWidth = innerWidth / dateGDPList.length;

    const timeScale = d3
        .scaleLinear()
        .domain([
          d3.min(dateGDPList, item => timeToDecimal(item[0])),
          d3.max(dateGDPList, item => timeToDecimal(item[0])),
        ])
        .range([padding, padding + innerWidth]),
      GDPScale = d3
        .scaleLinear()
        .domain([0, d3.max(dateGDPList, data => data[1])])
        .range([padding + innerHeight, padding]);

    /**
     * Returns what the height of the bar should be based on its GDP.
     * @param {number} GDP
     * @returns Bar height in px.
     */
    function barHeight(GDP) {
      const scale = d3
        .scaleLinear()
        .domain([0, d3.max(dateGDPList, data => data[1])])
        .range([0, innerHeight]);
      return scale(GDP);
    }

    // I found rendering the axes first, then the bars one part at a time (x, width, height, y) quite helpful.

    // ***Axes***
    const timeAxis = d3.axisBottom(timeScale),
      GDPAxis = d3.axisLeft(GDPScale);

    svg
      .append('g')
      .attr('transform', `translate(0, ${padding + innerHeight})`)
      .call(timeAxis);
    svg
      .append('g')
      .attr('transform', `translate(${padding}, 0)`)
      .call(GDPAxis);
    // *Axes*
    // ***Rectangles***
    svg
      .selectAll('rect')
      .data(dateGDPList)
      .enter()
      .append('rect')
      .attr('x', item => timeScale(timeToDecimal(item[0])))
      .attr('y', item => padding + innerHeight - barHeight(item[1]))
      .attr('width', barWidth)
      .attr('height', item => barHeight(item[1]));
  })
  .catch(err => error(err));
