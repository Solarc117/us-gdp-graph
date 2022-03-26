import * as d3 from 'https://cdn.skypack.dev/d3@7'
'use strict'

function timeToDecimal(yearMonthDay) {
  const [year, month] = yearMonthDay.split('-').map(item => +item),
    decimal = (month - 1) / 12
  
  return year + decimal
}

async function load() {
  try {
    const { data: dateGDPList, display_url: source } = await d3.json(
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
    )

    const { clientWidth: width, clientHeight: height } =
        document.querySelector('.canvas'),
      padding = 75,
      innerWidth = width - 2 * padding,
      innerHeight = height - 2 * padding,
      barWidth = innerWidth / dateGDPList.length

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
        .range([padding + innerHeight, padding])

    // Need a function to return the height of each rect within the innerWidth & innerHeight. Without this, either the axis or the bars would be inverted.
    function barHeight(GDP) {
      const scale = d3
        .scaleLinear()
        .domain([0, d3.max(dateGDPList, data => data[1])])
        .range([0, innerHeight])

      return scale(GDP)
    }

    // I found rendering the axes first, then the bars one part at a time (x, width, height, y) quite helpful.

    // ***Axes***
    const timeAxis = d3.axisBottom(timeScale),
      GDPAxis = d3.axisLeft(GDPScale)

    const svg = d3.select('.canvas')

    // In the case of a window resize, removes the previous rects and axes before adding the new ones.
    svg.selectAll('rect').remove()
    svg.selectAll('g').remove()

    svg
      .append('g')
      .attr('transform', `translate(0, ${padding + innerHeight})`)
      .call(timeAxis)
    svg.append('g').attr('transform', `translate(${padding}, 0)`).call(GDPAxis)

    // ***Rectangles***
    svg
      .selectAll('rect')
      .data(dateGDPList)
      .enter()
      .append('rect')
      .attr('x', item => timeScale(timeToDecimal(item[0])))
      .attr('y', item => padding + innerHeight - barHeight(item[1]))
      .attr('width', barWidth)
      .attr('height', item => barHeight(item[1]))

    // This whole section is to toggle the info on the left of the graph upon rect hover, and fade it out when the user mouses out.
    let clearTooltipTimer
    document.querySelectorAll('rect').forEach(rect => {
      const tooltip = document.querySelector('.tooltip')

      rect.addEventListener('mouseover', event => {
        clearTimeout(clearTooltipTimer)

        const [year, month] = rect.__data__[0].split('-'),
          quarter =
            month === '01'
              ? 'Q1'
              : month === '04'
              ? 'Q2'
              : month === '07'
              ? 'Q3'
              : 'Q4'

        tooltip.innerHTML = `$${rect.__data__[1]}B<br>${year} ${quarter}`
        tooltip.style.top = `${event.clientY - 30}px`
      })
      rect.addEventListener(
        'mouseout',
        () =>
          (clearTooltipTimer = setTimeout(() => {
            tooltip.animate(
              [
                {
                  opacity: 0,
                },
              ],
              500
            )
            setTimeout(() => (tooltip.innerHTML = ''), 300)
          }, 1000))
      )
    })

    document.querySelector(
      'footer'
    ).innerHTML = `<a target='_blank' href="https://github.com/Solarc117">Carlos Bernal</a>, project idea by
        <a target='_blank' href="https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart">fCC</a>. Source: <a target='_blank' href='${source}'>${source}</a>`
  } catch (error) {
    console.error(error)
  }
}

load()
window.onresize = load
