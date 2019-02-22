import React from "react"

const colors = ["#FF5733", "#33FF61", "#4633FF"]

function ToolTip({ tip, color }) {
  return (
    <React.Fragment>
      <circle
        cx={tip.cx}
        cy={tip.cy}
        r={tip.r}
        fill={colors[color]}
        stroke={colors[color]}
      />
    </React.Fragment>
  )
}

export default ToolTip
