import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const NumberGenerationTemplate = props => {
  const firstRun = useRef(true)
  const [suffixError, setSuffixError] = useState('')
  const [prefixError, setPrefixError] = useState('')
  const [charLimitError, setCharLimitError] = useState('')
  
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      checkCharLimit()
    },
    [props.formData]
  )

  function checkCharLimit () {
    if (suffixError || prefixError) {
      return
    }
    let charLimitErrorNext = getResultingSample().length > 30
    charLimitErrorNext = charLimitErrorNext ? 'You have exceeded 30 characters limit.' : ''
    setCharLimitError(charLimitErrorNext)
  }

  function onFormFieldValueChange ({field, value}) {
    let { formData, onFormDataChange } = props
    if (field !== 'manual' ) value = value.trim()
    if (value.length > 29 ) return
    if (['minimum_number_of_digits','starting_number'].includes(field) && isNaN(value) ) return
    if (field === 'minimum_number_of_digits' && +value > 29 ) return
    formData = { ...formData, [field]: value }
    onFormDataChange(formData)
    let isCharsInvalid = value ? value.replace(/((([a-zA-Z0-9-])|\{(YY|YYYY|MM|DD)\}))+/,'').length > 0 : ''
    let errorMessage = isCharsInvalid  ? `'${field}' field has invalid characters` : ''
    if (field === 'prefix') {
      setPrefixError(errorMessage)
    }
    if (field === 'suffix') {
      setSuffixError(errorMessage)
    }
  }

  function getResultingSample () {
    let {
      suffix,
      prefix,
      minimum_number_of_digits,
      starting_number
    } = props.formData
    suffix = replaceKeywordsForSample(suffix)
    prefix = replaceKeywordsForSample(prefix)
    starting_number = starting_number ? String(starting_number) : ''
    minimum_number_of_digits = +minimum_number_of_digits
    let resulting_number = ''
    if (starting_number ){
      if (starting_number.length > minimum_number_of_digits ){
        resulting_number = starting_number
      }else{
        resulting_number = `${ '0'.repeat( minimum_number_of_digits - starting_number.length ) }${starting_number}`
      }
    }
    return `${prefix}${resulting_number}${suffix}`
  }

  function replaceKeywordsForSample (word = '') {
    if (!word ){
       return ''
    }
    [ 'YY', 'YYYY', 'MM', 'DD' ].forEach( keyword => {
      word = word ? word.replace( `{${keyword}}`, moment().format(keyword) ) : ''
    })
    return word
  }

  function onAckEmailChange (event) {
    let { formData, onFormDataChange } = props
    formData = { ...formData, ack_email : event.target.value.trim() }
    onFormDataChange( formData )
  }

  let { formData, title, className, isOrderPoints } = props
  let {
    manual = false,
    minimum_number_of_digits = '',
    prefix = '',
    starting_number = '',
    suffix = '',
    ack_email = ''
  } = formData
  let isErrorExist = prefixError || suffixError || charLimitError ? true : false
  return (
    <div className={className}>
      <div>
        <span style={{fontWeight: "600"}} className="font-blue-soft">
          { title }
        </span>
      </div>
      <hr className="border-grey-salsa" style={{marginTop: "0"}} />
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label className="col-md-4 control-label">
              Manual/Auto:
            </label>
            <div className="col-md-8" style={{marginTop: "8px"}}>
              <label className="mt-radio mt-radio-outline" style={{paddingRight: "20px"}}>
                Manual
                <input
                  type="radio"
                  checked={ manual }
                  onChange={ event => onFormFieldValueChange({
                    field : 'manual',
                    value : true
                  }) }
                />
                <span></span>
              </label>&nbsp;&nbsp;
              <label className="mt-radio mt-radio-outline"> Auto
                <input
                  type="radio"
                  checked={ !manual }
                  onChange={ event => onFormFieldValueChange({
                    field : 'manual',
                    value : false
                  }) }
                />
                <span></span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Prefix*:</label>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                disabled={manual}
                style={ prefixError ? {outline : "1px solid red"} : {} }
                value={ prefix ? prefix : '' }
                onChange={ event => onFormFieldValueChange({
                  field : 'prefix',
                  value : event.target.value
                }) }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">
              Starting number:
            </label>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                disabled={manual}
                value={ starting_number ? starting_number : '' }
                onChange={ event => onFormFieldValueChange({
                  field : 'starting_number',
                  value : event.target.value
                }) }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Minimum number of digits:</label>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                disabled={manual}
                value={minimum_number_of_digits ? minimum_number_of_digits : ''}
                onChange={ event => onFormFieldValueChange({
                  field : 'minimum_number_of_digits',
                  value : event.target.value
                }) }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Suffix*:</label>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                disabled={manual}
                value={suffix ? suffix : ''}
                style={ suffixError ? {outline : "1px solid red"} : {} }
                onChange={ event => onFormFieldValueChange({
                  field : 'suffix',
                  value : event.target.value
                }) }
              />
            </div>
          </div>
          {
            isOrderPoints &&
            [
              (
                <div key="arr-1">
                  <span style={{fontWeight: "600"}} className="font-blue-soft">
                    Order Acknowledgment
                  </span>
                </div>
              ),
              (
                <hr key="arr-2" className="border-grey-salsa" style={{marginTop: "0"}} />
              ),
              (
                <div key="arr-3" className="form-group">
                  <label className="col-md-4 control-label">Acknowledge Email:</label>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      value={ack_email ? ack_email : ''}
                      onChange={ onAckEmailChange }
                    />
                  </div>
                </div>
              )
            ]
          }
        </div>
        <div className="col-md-4">
          <div className="row form-group">
            <div className="col-md-12 font-blue-soft" style={{fontSize: "15px"}}>
              Sample:&nbsp;
              <strong>
                { !isErrorExist && getResultingSample() }
              </strong>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12" style={{paddingBottom:"10px"}}>
              <i>Allowed* keywords:</i>
            </div>
            <div className="col-md-11 col-md-push-1">
              <ul>
                <li><strong>{'{YYYY}'}</strong> (4-digit year)</li>
                <li><strong>{'{YY}'}</strong> (2-digit year)</li>
                <li><strong>{'{MM}'}</strong> (2-digit month)</li>
                <li><strong>{'{DD}'}</strong> (2-digit day)</li>
              </ul>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12 font-red-soft">
              { prefixError || suffixError || charLimitError || '' }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

NumberGenerationTemplate.propTypes = {
  formData: PropTypes.shape({
    expiration_days: PropTypes.any,
    manual: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    starting_number: PropTypes.any,
    minimum_number_of_digits: PropTypes.any
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  isOrderPoints: PropTypes.bool
}

export default NumberGenerationTemplate