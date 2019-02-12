const response = async function getData() {
  const response = await fetch(`${process.env.PUBLIC_URL || ""}/data.json`)
  let dashData = await response.json()

  const selectedCategory = "views"
  const rowKeys = Object.keys(dashData[selectedCategory])

  // charts per a category
  const charts = rowKeys.map((r, index) => {
    const lineData = dashData[selectedCategory][r]
    const countries = Object.keys(lineData)

    return countries.map(c => ({ name: c, ...lineData[c] }))
  })

  return charts
}

export default response
