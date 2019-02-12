import React, { Component } from "react"

import "./App.css"
import getData from "./helpers/DataHandling"

import Chart from "./components/Chart"

class App extends Component {
  state = { charts: null }

  // async wrapper for asynchronous flow w/ await/fetch
  async componentDidMount() {
    const data = await getData()
    // this.setState({
    //   data
    // })

    let row, chartsObjs, locale, linesData

    let charts = []
    // for each row get chart(locales) &  lines(values/dates)
    data.forEach((rowArr, index) => {
      rowArr.forEach((chartObj, index) => {
        row = rowArr[index] // row per category-subject
        chartsObjs = row // chart per local

        const { name, ...lineNames } = chartsObjs
        locale = chartsObjs.name
        linesData = lineNames

        charts.push({ locale, linesData })
      })
    })

    this.setState({
      data,
      charts
    })
  }

  render() {
    if (!this.state.charts) {
      return <div />
    }

    const charts = this.state.charts

    return (
      <div className="App">
        {charts.map((chart, index) => (
          <Chart
            key={index}
            chartLocale={chart.locale}
            chartData={chart.linesData}
          />
        ))}
      </div>
    )
  }
}

export default App
