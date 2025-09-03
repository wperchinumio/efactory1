import React, { useState } from 'react'
import classNames from 'classnames'	
import { connect } from 'react-redux'
import {
  getThemeData,
  setThemeData,
  getLayoutData,
  setLayoutData,
  getMultiSelection,
  setMultiSelection
} from '../../../util/storageHelperFuncs'
import { useForceUpdate } from '../hooks'

const ChangeTheme = props => {
  const forceUpdate = useForceUpdate()
  const [multiSelection, setMultiSelection_] = useState(getMultiSelection())

  function changeTheme (event) {
    event.preventDefault()
    let themeFilename = event.currentTarget.getAttribute('data-theme-filename')
    let currentTheme = getThemeData()
    if (currentTheme !== themeFilename) {
      global.$('#theme').attr('href', global.$('#theme').attr('href').replace(currentTheme, themeFilename))
      setThemeData( themeFilename )
      let currentLogoEl = global.$('#dcl_logo')
      let currentLogoPathname = currentLogoEl.attr('src').match(/-(\w+)\./)[1]
      currentLogoEl.attr('src', currentLogoEl.attr('src').replace( currentLogoPathname , themeFilename ) )
      forceUpdate()
      // for instance froala listens to this event
      let event = new Event('themeChange')
      global.document.dispatchEvent(event)
    }
  }

  function changeLayout (event) {
    event.preventDefault()
    let layoutName = event.currentTarget.getAttribute('data-layout-name')
    let currentLayout = getLayoutData()
    if (currentLayout !== layoutName) {
      let bodyEl = global.$('body'),
        pageHeaderInnerEl = global.$('.page-header-inner'),
        pageContainerEl = global.$('#pageContainer')
      /* toggle classes */
      bodyEl.toggleClass( 'page-boxed' )
      pageHeaderInnerEl.toggleClass( 'container' )
      pageContainerEl.toggleClass( 'container' ).toggleClass( 'page-container' )
      setLayoutData( layoutName )
      forceUpdate()
    }
  }

  function changeMultiSelection (value = false) {
    let currentMultiSelection = getMultiSelection()
    if (currentMultiSelection !== value) {
      setMultiSelection(value)
      setMultiSelection_(value)
    }
  }

  let isMultiSelectionActive = false
  let {grid, analytics} = props

  if (grid && grid.fetchRowsParams && grid.fetchRowsParams.filter && grid.fetchRowsParams.filter.and) {
    let filters = grid.fetchRowsParams.filter.and || []
    if (filters.length > 0) {
      isMultiSelectionActive = filters.some(f => f.value && typeof(f.value) === 'string' && f.value.includes(','))
    }
  }
  if (analytics && analytics.filter && analytics.filter.location && analytics.filter.location.length > 0) {
    isMultiSelectionActive = analytics.filter.location[0].value && typeof(analytics.filter.location[0].value) === 'string' && analytics.filter.location[0].value.includes(',')
  }
  if (analytics && analytics.filter && analytics.filter.account_number && analytics.filter.account_number.length > 0) {
    isMultiSelectionActive = analytics.filter.account_number[0].value && typeof(analytics.filter.account_number[0].value) === 'string' && analytics.filter.account_number[0].value.includes(',')
  }
  if (analytics && analytics.filter && analytics.filter.order_type && analytics.filter.order_type.length > 0) {
    isMultiSelectionActive = analytics.filter.order_type[0].value && typeof(analytics.filter.order_type[0].value) === 'string' && analytics.filter.order_type[0].value.includes(',')
  }
  if (analytics && analytics.filter && analytics.filter.carrier && analytics.filter.carrier.length > 0) {
    isMultiSelectionActive = analytics.filter.carrier[0].value && typeof(analytics.filter.carrier[0].value) === 'string' && analytics.filter.carrier[0].value.includes(',')
  }
  if (analytics && analytics.filter && analytics.filter.service && analytics.filter.service.length > 0) {
    isMultiSelectionActive = analytics.filter.service[0].value && typeof(analytics.filter.service[0].value) === 'string' && analytics.filter.service[0].value.includes(',')
  }

  let currentLayout = getLayoutData()
  let currentTheme = getThemeData()

  let {
    isLayoutHidden
  } = props

  return (
    <div className="themes-wrapper">
      <h4 className="font-green-seagreen">
        Themes
      </h4>
      <div>
        <ul className="themes-name">
        {
          [
            { name: 'Default',   filename: 'darkblue' },
            { name: 'Light',     filename: 'light' },
            { name: 'Blue',      filename: 'blue' },
            { name: 'Dark',      filename: 'default' }
          ].map( ({ filename, name }) => {
            return (
              <li 
                className={ classNames(
                  filename, 
                  { 'active' : currentTheme === filename, 'theme': true}) 
                }
                key={ filename }
               >
                <a
                  href="#" 
                  data-theme-filename={ filename }
                  onClick={ changeTheme }
                >
                  { name }
                </a>
              </li>
            )
          })
        }
        </ul>
      </div>
      {
        !isLayoutHidden &&
        <h4 className="font-green-seagreen" style={{marginTop: 0}}>Layout</h4>  
      }
      {
        !isLayoutHidden &&
        <div>
          <ul className="themes-format">
          {
            [
              { name : 'fluid',   type : 'fluid' },
              { name : 'boxed',   type : 'boxed' }
            ].map( ({ type, name }) => {
              return (
                <li 
                  className={ classNames({
                    'active': currentLayout === type
                  }) }
                  key={ type }
                >
                  <a 
                    href="#" 
                    data-layout-name={ name }
                    onClick={ changeLayout }>
                    { name }
                  </a>
                </li>
              )
            })
          }
          </ul>
        </div>
      }
      <h4 className="font-green-seagreen">Quick Filter Multi Selection</h4>  
      <p>
        <label className="mt-checkbox mt-checkbox-outline mr-2">
          <input
            type="checkbox"
            disabled={isMultiSelectionActive}
            checked={ multiSelection }
            onChange={ () => changeMultiSelection(!multiSelection) }
            />
          <span></span>
        </label>
        <span>Enable</span>
        {isMultiSelectionActive && <span className="text-danger small"> &nbsp;Disable MULTI filters first.</span>}
      </p>
    </div>
  )
}

export default connect(
  state => ({
    grid: state.grid,
    analytics: state.analytics
  })
)(ChangeTheme)
