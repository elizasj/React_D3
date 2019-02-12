import React, { Component } from "react"
import * as d3 from "d3"

class Axis extends Component {
  state = {
    // d3 helpers
    xScale: this.props.xAxis,
    yScale: this.props.yScale
  }

  //create axis
  xAxis = d3
    .axisBottom()
    .scale(this.state.xScale)
    .tickFormat(d3.timeFormat("%b"))
  yAxis = d3
    .axisLeft()
    .scale(this.state.yScale)
    .tickFormat(d => `${d}`)

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps) return { ...prevState }
    const { xScale, yScale } = prevState

    xScale.domain(this.props.xExtent)
    yScale.domain([0, this.props.max])
  }

  // invoked immediately after updating. not called for the initial render.
  componentDidUpdate(prevProps, prevState) {
    // create axis'
    d3.select(this.refs.xAxis).call(this.state.xAxis)
    d3.select(this.refs.yAxis).call(this.state.yAxis)
  }

  render() {
    console.log(this.props.data)

    return (
      <g>
        <g
          ref="xAxis"
          transform={`translate(0, ${this.props.height -
            this.props.margin.bottom})`}
        />
        <g ref="yAxis" transform={`translate(${this.props.margin.left}, 0)`} />
      </g>
    )
  }
}

export default Axis
