import React, { Component } from "react"
import * as d3 from "d3"

let width = 950
let height = 400
let margin = { top: 20, right: 60, bottom: 20, left: 65 }
const colors = ["#FF5733", "#33FF61", "#4633FF"]

class ClassFnChart extends Component {
  state = {
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line()
  }

  // create axis
  xAxis = d3
    .axisBottom()
    .scale(this.state.xScale)
    .tickFormat(d3.timeFormat("%b"))
  yAxis = d3
    .axisLeft()
    .scale(this.state.yScale)
    .tickFormat(d => `${d}`)

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.chartData) return { ...prevState }
    const { chartData } = nextProps
    const { xScale, yScale, lineGenerator } = prevState
    //let { lineArr, dotsArr } = prevState

    // create arr for SVG paths & points
    let lineArr = []
    let dotsArr = []
    // D3 math
    const timeParse = d3.timeParse("%Y-%m-%d")

    // for each  line on a chart, get data points
    Object.values(chartData).forEach((line, index) => {
      // console.log("without hooks", line)
      line.sort((a, b) => d3.ascending(a.date, b.date))

      // map date to x position  - get min & max of the date
      const xExtent = d3.extent(line, l => l.date).map(l => timeParse(l))
      xScale.domain(xExtent)

      // map values to y position - get max of value
      const max = d3.max(line, l => l.value)
      yScale.domain([0, max])

      lineGenerator.x(l => xScale(timeParse(l.date))).y(l => yScale(l.value))
      const lineGen = lineGenerator(line)

      lineArr.push(lineGen)

      dotsArr.push(
        line.map(l => {
          return {
            cx: xScale(timeParse(l.date)),
            cy: yScale(l.value),
            r: 5
          }
        })
      )
    })

    return { ...prevState, lineArr, dotsArr }
  }

  // invoked on every render
  componentDidMount() {
    // create axis'
    d3.select(this.xAxisElt).call(this.xAxis)
    d3.select(this.yAxisElt).call(this.yAxis)
  }

  render() {
    const data = this.state.lineArr
    const legend = Object.keys(this.props.chartData)
    const dots = this.state.dotsArr

    return (
      <div>
        <p>{this.props.chartLocale}</p>

        <ul style={{ listStyle: "none" }}>
          {legend.map((item, index) => (
            <li key={index} style={{ color: colors[index] }}>
              {item}
            </li>
          ))}
        </ul>

        <svg ref="svg" width={width} height={height}>
          {data.map((line, index) => (
            <path
              key={index}
              d={line}
              fill={"none"}
              stroke={colors[index]}
              strokeWidth="2"
            />
          ))}

          {dots.map((dot, index) =>
            dot.map((d, i) => (
              <circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r={d.r}
                fill={colors[index]}
                stroke={colors[index]}
              />
            ))
          )}

          <g>
            <g
              ref={elt => (this.xAxisElt = elt)}
              transform={`translate(0, ${height - margin.bottom})`}
            />
            <g
              ref={elt => (this.yAxisElt = elt)}
              transform={`translate(${margin.left}, 0)`}
            />
          </g>
        </svg>
      </div>
    )
  }
}

export default ClassFnChart
