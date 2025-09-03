import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDebounce } from '../hooks'

function TextInput ({ value, setValue, ...props }) {
  const [inputValue, setInputValue] = useState(value || '')
  const debouncedValue = useDebounce(inputValue || '', 500)

  useEffect(
    () => {
      if ( !value && !debouncedValue ) {
        return
      }
      if (value === debouncedValue) {
        return
      }
      setValue(debouncedValue)
    },
    [debouncedValue]
  )

  useEffect(
    () => {
      if (!value && !debouncedValue) { 
        // prevent from undefined to '' change
        // to trigger setInputValue
        return 
      }
      if (value !== debouncedValue) {
        setInputValue(value)
      }
    },
    [value]
  )

  function onChange (event) {
    const {value} = event.currentTarget
    setInputValue(value)
  }

  return (
    <input 
      type="text"
      value={inputValue}
      onChange={onChange}
      {...props}
    />
  )
}

TextInput.propTypes = {
  value: PropTypes.any,
  setValue: PropTypes.func.isRequired
}

export default TextInput