import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import calculateCellWidth from '../_helpers/calculateCellWidth'
import * as renderMethods from './RenderMethods'

const GridRowCell = ({
  col,
  row,
  shouldStretch
}) => {
  function createFlexStyleWithPrefixes ( width ) {
    return {
      width : `${width}px`,
      WebkitBoxFlex : width,
      MsFlexPositive : width,
      flexGrow : width,
      MsFlexNegative : 1,
      flexShrink : 1,
    }
  }

  let {
    width,
    field,
    sortable,
    render,
    align
  } = col
  let renderArgs = []
  if( render && render.startsWith('fmtnumber') && render.includes(',') ){
    renderArgs = render.split(',').slice(1)
    render = 'fmtnumber'
  }
  let widthStyleObj = {}
  width = calculateCellWidth( width, sortable )
  if( shouldStretch ){
    widthStyleObj = createFlexStyleWithPrefixes( width )
  }else{
    widthStyleObj = { width : width }
  }
  return (
    <div 
      className={ classNames({
        'grid-row-cell' : true,
        [ `text-${ align ? align : 'temp' }` ] : align
      }) }
      style={ widthStyleObj }
    >
      {
        render
        ? renderMethods[ render ]
          ? renderMethods[ render ]( row, field, ...renderArgs )
          : row[ field ]
        : field.includes('.')
          ? row[ field.slice(0, field.indexOf('.') ) ] ? row[ field.slice(0, field.indexOf('.') ) ][ field.slice( field.indexOf('.') + 1 ) ] : ''
          : row[ field ]
      }
    </div>
  )
}

GridRowCell.propTypes = {
  col: PropTypes.shape({
    width: PropTypes.any,
    alias: PropTypes.string,
    field: PropTypes.string,
    filterable: PropTypes.bool,
    sortable: PropTypes.bool
  }),
  row: PropTypes.object,
  shouldStretch: PropTypes.bool.isRequired
}

export default GridRowCell