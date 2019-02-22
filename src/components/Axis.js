import React, { useEffect } from "react"
import * as d3 from "d3"

function Axis({ chartData, svgDimensions, margin }) {
  // svg dimensions
  const { height, width } = svgDimensions
  // d3 helpers
  const xScale = d3.scaleTime().range([margin.left, width - margin.right])
  const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top])
  const timeParse = d3.timeParse("%Y-%m-%d")

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat("%b"))
  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(d => `${d}`)

  //refs
  let xAxisElt = React.createRef()
  let yAxisElt = React.createRef()

  // D3 math
  // for each  line on a chart, get data points
  Object.values(chartData).forEach(line => {
    // map date to x position  - get min & max of the date
    const xExtent = d3.extent(line, l => l.date).map(l => timeParse(l))
    xScale.domain(xExtent)

    // map values to y position - get max of value
    const max = d3.max(line, l => l.value)
    yScale.domain([0, max])
  })

  // invoked on every render
  useEffect(() => {
    // create axis'
    d3.select(xAxisElt).call(xAxis)
    d3.select(yAxisElt).call(yAxis)
  })

  return (
    <g>
      <g
        ref={elt => (xAxisElt = elt)}
        transform={`translate(0, ${height - margin.bottom})`}
      />
      <g
        ref={elt => (yAxisElt = elt)}
        transform={`translate(${margin.left}, 0)`}
      />
    </g>
  )
}

export default Axis
