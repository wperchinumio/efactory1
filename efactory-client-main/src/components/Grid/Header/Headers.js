import React from 'react'
import PropTypes from 'prop-types'
import { GridRow, GridHeader } from '../Commons'
import ColumnSort from '../_Helpers/ColumnSort'
import classNames from 'classnames'

const TableHeader = ({
  currentSort,
  flagsColumnVisible,
  invoiceAllColumnVisible,
  orderTypeColumnVisible,
  sort,
  viewFields,
}) => {
  function getHeaderTableDataJSX (viewFields = []) {
    return viewFields.map( 
      (field, fieldIndex) => {
        return (
          <GridHeader
            key={`header${field.field}`}
            className={ classNames('draggable', {
              'sortable' : field.sortable,
              'not-sortable' : !field.sortable,
              'text-left' : !field.align || field.align === 'left',
              'text-right' : field.align === 'right',
              'text-center' : field.align === 'center'
            }) }
            draggable='true'
            data-sort-index={fieldIndex}
            onClick={ event => {
              if ( 
                !event.target.className.includes('header-resize') && 
                !global.window.resizeActive && 
                field.sortable 
              ) {
                let sortForField = currentSort[ field.field ] 
                if( sortForField ){
                  sort({ [field.field]: sortForField === 'desc' ? 'asc' : 'desc' })
                }else{
                  sort({ [field.field]: 'desc' })
                }
              }
            } }
          >
            { 
              field.sortable &&
              <ColumnSort
                activeSort={currentSort}
                field={field.field}
              />
            }
            { field.alias }
            <ResizeHeader
              resizeIndex={fieldIndex + ( orderTypeColumnVisible || invoiceAllColumnVisible || flagsColumnVisible ? 2 : 1 ) }
              minWidth={field.min_width}
              field={field.field}
            />
          </GridHeader>
        )
      } 
    )
  }

  return (
    <GridRow className="uppercase noselect table-header-1" style={{whiteSpace: "nowrap"}} >
      <GridHeader key="headerIndex">
        #
      </GridHeader>
      {
        orderTypeColumnVisible &&
        <GridHeader key="headerFixedSecond" />
      }
      {
        flagsColumnVisible &&
        <GridHeader key="flagsHeader" />
      }
      {
        invoiceAllColumnVisible &&
        <GridHeader key="headerFixedThird" />
      }
      { 
        getHeaderTableDataJSX(viewFields)
      }
      <GridHeader key="lastColumnHeader" />
    </GridRow>
  )
}

function ResizeHeader ({ resizeIndex, minWidth, field }) {
  return (
    <span
      className="header-resize"
      key={`header-resize-${resizeIndex}`}
      onMouseDown={ 
        event => {
          event.preventDefault()
          global.window.firstScreenX = event.screenX
          global.window.minWidth = 50
          global.window.resizeField = field
          global.window.resizeActive = true
          global.window.resizeIndex = resizeIndex
          global.$('body').addClass('resize-active')
        }
      }
    >
      { ' ' }
    </span>
  )
}

TableHeader.propTypes = {
  className: PropTypes.string,
  orderTypeColumnVisible: PropTypes.bool,
  flagsColumnVisible: PropTypes.any,
  currentSort: PropTypes.object.isRequired,
  invoiceAllColumnVisible: PropTypes.bool
}

export default TableHeader