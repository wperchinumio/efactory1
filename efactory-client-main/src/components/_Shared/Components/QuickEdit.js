import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
momentLocalizer(moment)

const QuickEdit = props => {
  const firstRun = useRef(true)
  const parentId = useRef('key' + createGuid())
  const inputEl = useRef(null)
  const positionStyle = useRef(props.position ?  createPositionStyle() : {})
  const [touched, setTouched] = useState(false)
  const [modalOpen, setModalOpen] = useState(Boolean(props.modalOpen))
  const [value, setValue] = useState(props.value || '')
  const [error, setError] = useState('')

  const checkClickEvent = useCallback(
    () => {
      if (!global.$(event.target).closest('#'+parentId.current).length) {
        if (modalOpen) {
          setModalOpen(false)
        }
      }   
    },
    []
  )
  
  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      setTimeout(
        () => {
          if (modalOpen) {
            global.$(document).on('click', checkClickEvent)
            selectAndFocusInputField()
            return
          }
          global.$(document).off('click', checkClickEvent)
        },
        100
      )
    },
    [modalOpen]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      setValue(props.value)
    },
    [props.value]
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      if (props.modalOpen) {
        setModalOpen(true)
        setValue(props.value)
        setTimeout( () => selectAndFocusInputField(), 100 )
      }
      setValue(props.value)
    },
    [props.modalOpen]
  )

  function createPositionStyle () {
    let { position } = props
    let positionStyle = {}
    Object.keys(position).forEach( p => {
      positionStyle[p] = position[p]
    } )
    return positionStyle
  }

  function createGuid () {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }

  function isDefaultValidations () {
    let { validations = [] } = props
    let value_ = value ? value : ''
    value_ = String(value_).trim()
    let validation = ''
    if (validations.includes('number')) {
      validation = isNaN(value_) ? 'This field should be Number a type.' : false
    }
    if (!validation && validations.includes('required')) {
      validation = value_.length ? validation : 'This field is required.'
    }
    return validation
  }

  function onCurrentQuickEditSave (event) {
    event.preventDefault()
    let { validate } = props
    if (validate) {
      let userValidation = validate(value)
      if (userValidation ) return setError(userValidation)
    }
    let defaultValidations = isDefaultValidations()
    if (defaultValidations )  return setError(defaultValidations)
    props.onSave(value)
    if (!touched) setTouched(true)
    resetComponentState() // modalOpen to false and error to ''
  }

  function resetComponentState () {
    setModalOpen(false)
    setError('')
  }

  function onDismissButtonClicked () {
    resetComponentState()
  }

  function onQuickEditInputChange (event) {
    setValue(event.target.value)
  }

  function onDateQuickEditInputChange (date) {
    setValue(date)
  }

  function onOpenModalTriggered () {
    setModalOpen( m => !m )
    setValue(props.value)
  }

  function onDatePickerChange (dateObj) {
    let formattedDate = moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
    onDateQuickEditInputChange(formattedDate)
  }

  function selectAndFocusInputField () {
    if (!props.dateType) {
      inputEl.current.select()
      inputEl.current.focus()
    }
  }

  function onClearInputClicked () {
    setValue('')
    setTimeout( () => selectAndFocusInputField(), 100 )
  }

  let {
    disabled = false,
    dateType = false,
    inline,
    isRightAligned = false,
    showDateFormatCB,
    title
  } = props

  return (
    <div 
      className="react-quick-edit" 
      id={parentId.current}
      style={ inline ? { display:'inline-block' } : {} }
    >
      <div className={ classNames({
        'qe-modal': true,
        'open' : modalOpen
      }) }>
        <div className="qe-modal-wrapper-outer">
          <div 
            className="qe-modal-wrapper"
            style={positionStyle.current}
          >
            <span className="field-title">
              { title }
            </span>
            {
              dateType && modalOpen && 
              <span className='single-date-quick-edit'>
                <DatePicker 
                  format="YYYY-MM-DD"
                  initialView={'month'}
                  name="startDate"
                  onChange={ onDatePickerChange }
                  time={false}
                  value={ value ? moment(value).toDate()  : moment().toDate() }
                  open={ 'calendar' }
                  onToggle={ isOpen => {} }
                />
              </span>
            }
            {
              !dateType &&
              <form 
                role="form" 
                autoComplete="off"
                style={{ display: 'inline', position:'relative' }}
                onSubmit={ onCurrentQuickEditSave }
              >
                <input 
                  type="text"
                  ref={inputEl.current}
                  value={ value ? value : '' }
                  onChange={ onQuickEditInputChange } 
                  className={ classNames({
                    'qe-input-el' : true,
                    'error' : error
                }) }  
                />
                <span 
                  className={ classNames({
                    'clear-input' : true,
                    'hidden' : !value
                  }) }
                  onClick={ onClearInputClicked } 
                >x</span>
                <span className="clear-input-bg"></span>
              </form>
            }
            <span style={ dateType ? { float:'right' } : {} }>
              <button 
                className="qe-button approve"
                disabled={disabled}
                onClick={ onCurrentQuickEditSave }
              >
                <i className="fa fa-check"></i>
              </button>
              <button 
                className="qe-button cancel"
                disabled={disabled}
                onClick={ onDismissButtonClicked }
              >
                <i className="fa fa-times"></i>
              </button>
            </span>
              
            <span className="qe-error">
              { error ? error : '' }
            </span>
          </div>
        </div>
      </div>
      <div 
        className={ classNames({
          'right-aligned' : isRightAligned,
          'qe-displayed' : true
        }) }
        onClick={ onOpenModalTriggered }
      >
        <span className={ classNames({
          'current-value' : true,
          'touched' : touched,
          'empty' : !props.value,
        }) }>
          { 
            dateType && showDateFormatCB &&
            showDateFormatCB(props.value)
          } 
          { 
            !dateType && (props.value ? props.value : 'Empty' )
          }
        </span>
      </div>
    </div>
  )
}

QuickEdit.propTypes = {
  disabled: PropTypes.bool,
  inline: PropTypes.bool,
  dateType: PropTypes.bool,
  isRightAligned: PropTypes.bool,
  modalOpen: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  position: PropTypes.shape({
    bottom: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
    top: PropTypes.string
  }),
  showDateFormatCB: PropTypes.func,
  title: PropTypes.string.isRequired,
  validate: PropTypes.func,
  validations: PropTypes.arrayOf( 
    PropTypes.oneOf(['required','number']) 
  ),
  value: PropTypes.any,
}

export default QuickEdit