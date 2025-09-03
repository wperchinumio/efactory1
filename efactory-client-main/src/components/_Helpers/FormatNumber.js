import React from 'react'

const
  formatNumber = (number, decimals = 2) => {
    if (typeof number === 'number' || !isNaN(number)) {
      number = Number(number)
      decimals = decimals < 0 ? 0 : decimals

      var parts = number.toFixed(decimals).toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      number = parts.join(".");

      // Does not work if decimaml >= 4
      //number = number.toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return number
  }

const
  formatNumbers = (numbers, decimals = 2) => {
    Object.keys(numbers).forEach(function(key) {
      let number = numbers[key]
      if (typeof number === 'number' || !isNaN(number)) {
        number = Number(number)
        decimals = decimals < 0 ? 0 : decimals
        number = number.toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        numbers[key] = number
      }
    })
    return numbers
  }

export default function FormatNumber (props) {
  return (
    <span className={(props.strong === 'true' ? 'bold' : '')
     + (props.dimZero === 'true' && props.number === 0? ' zero-value' : '')
     + (props.hideNull === 'true' && props.number === null ? ' hide' : '')
     + (props.redIfOne && props.obj[props.redIfOne] === 1? ' font-red-soft': '')
    }>
      {formatNumber(props.number, props.decimals)}
    </span>
  )
}
export { formatNumber, formatNumbers}
