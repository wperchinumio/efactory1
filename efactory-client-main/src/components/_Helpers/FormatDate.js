import React from 'react'
import moment from 'moment'

// Date or Date/Time is expressed in ISO8601.
// User can decide to display the date (or date/time) as they wish.
// Default format is MM/dd/yyyy h:mma
// User format should be loaded from localStorage (from user settings)
export function formatDate (date = '', noTime) {
  // http://stackoverflow.com/questions/15109894/new-date-works-differently-in-chrome-and-firefox#comment30743352_15110385
  if( !date ){
    return ''
  }
  // date += "Z"
  if (noTime === "true"){
    date = date.substr(0, 10)
  }

  if (!date) {
    return ""
  }

  // Check if date is in long format or short format
  // Temporary, let's rely on moment library.

  //let dateTime = new Date( date )
  let dateTimeFormat
  if (date.length === 10){// Short date
    dateTimeFormat = "MM/DD/YYYY"
  }else {
    dateTimeFormat = "MM/DD/YYYY h:mmA"
  }
  return moment.utc(date).format( dateTimeFormat )
}

export default function FormatDate (props) {
  return (
    <span>
      {formatDate(props.date, props.noTime)}
    </span>
  )
}
