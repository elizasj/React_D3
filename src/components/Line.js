import React from "react"

const colors = ["#FF5733", "#33FF61", "#4633FF"]

function Line({ line, index }) {
  return (
    <React.Fragment>
      <path d={line} fill={"none"} stroke={colors[index]} strokeWidth="2" />
    </React.Fragment>
  )
}

export default Line
