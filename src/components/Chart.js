import React, { useState, useLayoutEffect } from "react"
import * as d3 from "d3"
import throttle from "lodash/throttle"
import Axis from "./Axis"
import Line from "./Line"
import ToolTip from "./ToolTip"

function Chart({ chartLocale, chartData }) {
  const [svgDimensions, setDimensions] = useState({ width: 450, height: 250 })
  const [ratio, setRatio] = useState(svgDimensions.width / svgDimensions.height)

  const margin = { top: 20, right: 60, bottom: 20, left: 65 }
  const colors = ["#FF5733", "#33FF61", "#4633FF"]

  // d3 helpers
  const xScale = d3
    .scaleTime()
    .range([margin.left, svgDimensions.width - margin.right])
  const yScale = d3
    .scaleLinear()
    .range([svgDimensions.height - margin.bottom, margin.top])
  const lineGenerator = d3.line()
  const timeParse = d3.timeParse("%Y-%m-%d")

  // create arr for SVG paths & points
  let lineArr = []
  let tipsArr = []
  // D3 math
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

    tipsArr.push(
      line.map(l => {
        return {
          cx: xScale(timeParse(l.date)),
          cy: yScale(l.value),
          r: 5
        }
      })
    )
  })
  const legend = Object.keys(chartData)

  // Use a timer so the chart is not constantly redrawn while window is being resized.
  useLayoutEffect(() => {
    const updateChartDimensions = throttle(function(e) {
      const current_width = window.innerWidth
      const current_height = window.innerHeight
      const current_ratio = current_width / current_height
      let h, w
      // Check if height is limiting factor
      if (current_ratio > ratio) {
        h = current_height
        w = h * ratio
        // Else width is limiting
      } else {
        w = current_width
        h = w / ratio
      }
      setDimensions({
        width: w - margin.left - margin.right,
        height: h - margin.top - margin.bottom
      })
    }, 500)
    updateChartDimensions()

    window.addEventListener("resize", updateChartDimensions)

    return () => {
      console.log("yolo")
      window.removeEventListener("resize", updateChartDimensions)
    }
  }, [])

  return (
    <div>
      <p>{chartLocale}</p>

      <ul style={{ listStyle: "none" }}>
        {legend.map((item, index) => (
          <li key={index} style={{ color: colors[index] }}>
            {item}
          </li>
        ))}
      </ul>

      <svg width={svgDimensions.width} height={svgDimensions.height}>
        {tipsArr.map((tip, index) =>
          tip.map((t, i) => <ToolTip key={i} tip={t} color={index} />)
        )}

        {lineArr.map((line, index) => (
          <Line key={index} line={line} index={index} />
        ))}

        <Axis
          chartData={chartData}
          svgDimensions={svgDimensions}
          margin={margin}
        />
      </svg>
    </div>
  )
}

export default Chart
