import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Select2React = props => {
  const firstRun = useRef([true, true, true])
  const parentId = useRef('key' + createGuid())
  const filterNode = useRef(null)
  const wrapperNode = useRef(null)
  const optionsFilteredRef = useRef(null)
  const [active, setActive] = useState(false)
  const [options, setOptions] = useState(props.options || {})
  let [selected, setSelected] = useState(props.selected ? String(props.selected) : '')
  const [filter, setFilter] = useState('')
  const [boxOpen, setBoxOpen] = useState(false)
  const boxOpenRef = useRef(null)
  boxOpenRef.current = boxOpen

  const checkClickEvent = useCallback(
    event => {
      if (!global.$(event.target).closest('#'+parentId.current).length) {
        if (boxOpenRef.current) {
          setBoxOpen(false)
        }
      }   
    },
    []
  )

  const onKeyDown = useCallback(
    event => {
      if (event.which === 27 || event.which === 9) {
        setBoxOpen(false)
      }
    },
    []
  )

  useEffect(
    () => {
      return () => {
        global.$(document).off('click', checkClickEvent)
        global.$(document).off('keydown', onKeyDown)
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
      setOptions(props.options)
    },
    [props.options]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      setSelected(props.selected)
    },
    [props.selected]
  )
  
  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      setTimeout(
        () => {
          if (boxOpen) {
            global.$(document).on('click', checkClickEvent)
            global.$(document).on('keydown', onKeyDown)
            filterNode.current.focus()
            return
          }
          global.$(document).off('click', checkClickEvent)
          global.$(document).off('keydown', onKeyDown)
        },
        100
      )
    },
    [boxOpen]
  )
  
  function createGuid () {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }

  function handleOptionClicked (optionKey, boxOpen = false) {
    props.onChangeHandler(optionKey)
    setSelected(optionKey)
    setFilter('')
    setBoxOpen(boxOpen)
  }

  function filterOptions (options) {
    let optionsFiltered = {}
    const filterNext = filter.toLowerCase()
    Object.keys(options).forEach( o => {
      let optionValue = options[o]
      if (optionValue.toLowerCase().includes( filterNext ) || o.toLowerCase().includes( filterNext )) {
        optionsFiltered[ o ] = optionValue
      }
    })
    return optionsFiltered
  }

  function onOptionMouseOver (optionKey) {
    setActive(optionKey)
  }

  function mapOptions (optionsFiltered) {
    optionsFiltered = { ...optionsFiltered }
    let options = []
    let { topOptions = [], topOptionsTitle, optionsTitle } = props
    if (topOptions.length) {
      if (topOptionsTitle) {
        options.push( <h3 
            key={'topOptionsTitle-key'} 
            className="select2-group-title"
          >
            {topOptionsTitle}
          </h3> 
        )
      
      }
      topOptions.forEach( topOption => {
        if (optionsFiltered[topOption]) {
          options.push( (
            <Option 
              isSelected={ selected === topOption }
              optionKey={topOption}
              key={ `select2-react-${topOption}` }
              onOptionClicked={handleOptionClicked}
              onOptionMouseOver={onOptionMouseOver} // @todo
              active={ topOption === active }
              optionText={ formatOptionText( topOption, optionsFiltered[topOption], props.isoFormat ) }
            />
          ) )
          delete optionsFiltered[topOption]
        }
      })
    }
    if (options.length && !optionsTitle) {
      options.push( (
        <div key="option-seperator" className="option-seperator"></div>
      ) )
    }
    let { orderOfOptionKeys = [] } = props
    if (orderOfOptionKeys.length) {
      orderOfOptionKeys = orderOfOptionKeys.filter( o => optionsFiltered[ o ] )
      if (orderOfOptionKeys.length && optionsTitle) {
        options.push( <h3 
              key={'optionsTitle-key'} 
              className="select2-group-title"
            >
              {optionsTitle}
            </h3> 
        )  
      }
      orderOfOptionKeys.forEach( orderedOptionKey => {
        let orderedOptionValue = optionsFiltered[ orderedOptionKey ]
        options.push( (
          <Option 
            isSelected={ selected === orderedOptionKey }
            optionKey={ orderedOptionKey }
            key={ `select2-react-${orderedOptionKey}` }
            onOptionClicked={ optionKey => handleOptionClicked(optionKey) }
            onOptionMouseOver={onOptionMouseOver} // @todo
            active={ orderedOptionKey === active }
            optionText={ formatOptionText( orderedOptionKey, orderedOptionValue, props.isoFormat ) }
          />
        ))
      })
    } else {
      if (Object.keys( optionsFiltered ).length && optionsTitle) {
        options.push( <h3 
              key={'optionsTitle-key'} 
              className="select2-group-title"
            >
              {optionsTitle}
            </h3> 
        ) 
      }
      Object.keys( optionsFiltered ).forEach( o => {
        options.push( (
          <Option 
            isSelected={selected === o}
            optionKey={o}
            key={ `select2-react-${o}` }
            optionValue={optionsFiltered[o]}
            onOptionClicked={handleOptionClicked}
            isoFormat={props.isoFormat}
            onOptionMouseOver={onOptionMouseOver} // @todo
            active={ o === active }
            optionText={ formatOptionText(o, optionsFiltered[o], props.isoFormat) }
          />
        ) )
      } )
    }
    return options
  }

  function handleScrollBehaviour () {
    var active = wrapperNode.current.querySelector('.select2-option.active')
    if (active) {
      let activeOffsetTop = active.offsetTop
      let optionsScrolled = wrapperNode.current.querySelector('.select2-options').scrollTop
      if (activeOffsetTop > ( 175 + optionsScrolled )) {
        wrapperNode.current.querySelector('.select2-options').scrollTop = activeOffsetTop - 175
      } else if (( activeOffsetTop - 35 ) < optionsScrolled) {
        wrapperNode.current.querySelector('.select2-options').scrollTop = activeOffsetTop - 35
      }
    }
  }

  function keyDownHandler (event, optionsFiltered) {
    optionsFiltered = { ...optionsFiltered }
    let { topOptions = [] } = props
    topOptions = topOptions.filter( t => {
      if (optionsFiltered[t]) {
        delete optionsFiltered[t] 
        return true
      }
      return false
    } )
    let activeNext
    switch(event.which) {

        case 40: // down
          if (active) {
            if (topOptions.includes( active )) {
              let index = topOptions.indexOf(active)
              if (index !== topOptions.length - 1) {
                activeNext = topOptions[index + 1]
              } else {
                if (Object.keys(optionsFiltered).length) {
                  activeNext = Object.keys(optionsFiltered)[0]
                }
                
              }
            } else {
              let index
              Object.keys(optionsFiltered).some( (o,i,arr) => {
                if (o === active) {
                  index = arr.length - 1 === i ? i : i + 1
                  return true
                }
                return false
              } )
              activeNext = Object.keys(optionsFiltered)[index]
            }
            //Object.keys(optionsFiltered).filter( ( op, i ) => op === state.active )
          } else {
            if (topOptions.length) {
              activeNext = topOptions[0]
            } else if(Object.keys(optionsFiltered).length) {
              activeNext = Object.keys(optionsFiltered)[0]
            }
          }
        break

        case 38: // up
          if (active) {
            if (topOptions.includes( active )) {
              let index = topOptions.indexOf(active)
              if (index !== 0) {
                activeNext = topOptions[ index - 1 ]
              }
            } else {
              let index
              Object.keys(optionsFiltered).some( (o,i,arr) => {
                if (o === active) {
                  index = i === 0 ? -1 : i - 1
                  return true
                }
                return false
              } )
              if (index !== -1) {
                activeNext = Object.keys(optionsFiltered)[index]
              } else {
                if (topOptions.length) {
                  activeNext = topOptions[ topOptions.length - 1 ]
                }
              }
              
            }
            //Object.keys(optionsFiltered).filter( ( op, i ) => op === state.active )
          } else {
            if (topOptions.length) {
              activeNext = topOptions[0]
            } else if(Object.keys(optionsFiltered).length) {
              activeNext = Object.keys(optionsFiltered)[0]
            }
          }
        break

        case 13: // enter
          if (active) {
            handleOptionClicked(active)
          }
          break
        default:
    }
    if (activeNext) {
      setActive(activeNext)
      setTimeout( () => handleScrollBehaviour(), 100 )
    }
  }

  function handleFilterInput (event) {
    setFilter(event.target.value)
    setTimeout(
      () => {
        if (optionsFilteredRef.current && Object.keys(optionsFilteredRef.current).length) {
          let { topOptions = [] } = props
          topOptions = topOptions.filter( t => optionsFilteredRef.current[t] )
          let activeNext = {}
          if (topOptions.length) {
            activeNext = topOptions[0]
          } else {
            activeNext = Object.keys(optionsFilteredRef.current)[0]
          }
          setActive(activeNext)
          setTimeout( () => handleScrollBehaviour(), 100 )
        }
      },
      100
    )
  }

  function formatOptionText (key, value, isoFormat) {
    if (isoFormat) {
      return `${value} - ${key}`
    }
    return `${value}`
  }

  let { disabled, boxHeight } = props
  let optionsFiltered = { ...options }
  if (filter ) { 
    optionsFiltered = filterOptions( options ) 
    optionsFilteredRef.current = optionsFiltered
  }

  selected = String(selected)

  return (
    <div 
      className={ classNames({
        'select2-react-wrapper-parent' : true
      }) }
      style={{ height: props.height }}
      id={ parentId.current }
      ref={wrapperNode}
    >
      <input 
        type="text" className="hidden-input-react"
        onFocus={ event => setBoxOpen(true) }
      />
      <div 
        className={
          classNames({
            'select2-react-wrapper' : true,
            'closed': !boxOpen,
            'disabled': disabled
          })
        }
      >
        <div 
          className={ classNames({
            'selected-placeholder': true,
            'nothing-selected': !selected
          }) } 
          onClick={ event => {  
            if (!disabled) {
              setBoxOpen(true)
            }
          }}
        >
          {
            selected && options[selected] &&
            <span className="selected" style={{ height: props.height, lineHeight: props.height }} >

              { formatOptionText( selected, options[selected], props.isoFormat ) }
            </span>
          }
          {
            !selected &&
            <span className="selected font-grey-salt" style={{ height: props.height, lineHeight: props.height }} >
              { props.placeholder ? props.placeholder : 'Select...' }
            </span>
          }
          <span className="controls">
            <span 
              className="selected-clear"
              onClick={ event => {  
                if (!disabled) {
                  handleOptionClicked('', true)
                }
              } }
            >×</span>
            <span className="selected-arrow">
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </span> 
          </span>
        </div>
        <div className={ classNames({
          'open-box': true,
          'no-results': !Object.keys(optionsFiltered).length
        }) } >
          <input 
            type="text" 
            className="filter-input"
            value={ filter }
            onChange={handleFilterInput}
            onKeyDown={ event => keyDownHandler( event, optionsFiltered ) }
            ref={filterNode}
          />
          <div className="no-results-message">
            No results found
          </div>
          <div className="select2-options" style={ boxHeight ? { maxHeight: boxHeight } : {} }>
            { mapOptions( optionsFiltered ) }
          </div>
        </div>
      </div>
    </div>
  )
}

function Option ({
	active = false,
	isoFormat = false,
	isSelected = false,
	onOptionClicked,
	onOptionMouseOver,
	optionKey = '',
	optionText = ''
}) {
	return (
		<div 
			className={ classNames({
				'select2-option': true,
				'selected': isSelected,
				'active': active
			}) }
			onMouseDown={ event => {
				event.preventDefault()
				onOptionClicked(optionKey)
			}  }
			onMouseEnter={ event => onOptionMouseOver( optionKey ) }
		>
			{ optionText }
		</div>
	)
}

Select2React.propTypes = {
  boxHeight: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  optionsTitle: PropTypes.string,
    orderOfOptionKeys: PropTypes.array,
  onChangeHandler: PropTypes.func.isRequired,
  isoFormat: PropTypes.bool,
  selected: PropTypes.any,
  topOptions: PropTypes.array,
  topOptionsTitle: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.string,
}

Select2React.defaultProps = {
  isoFormat: false,
  height: '35px'
}

export default Select2React