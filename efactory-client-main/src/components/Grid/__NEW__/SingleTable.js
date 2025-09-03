import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header/_Content'
import Body from './Body/_Content'

const GridSingleWrapper = ({
  changeFieldWidth,
  columns,
  currentSort,
  defaultColumnsConfig,
  fixColumn, 
  fixedColumns,
  header_filters,
  headerDoubleLinePattern,
  id,
  isColumnsFixed,
  isDefaultColumnsExistForFixedGrid,
  isWithCheckboxes,
  multiple_selected_active_rows,
  onCheckAllItemsStatusChanged,
  onHeaderFilterValueChange,
  onHeaderFilterSubmitted,
  onRowCheckboxStatusChanged,
  onRowClicked,
  onSortChange,
  resetGrid,
  rows,
  scrollbarWidth,
  shouldStretch,
  unFixColumn, 
  updateReorderedColumns,
}) => {
  if( ( isColumnsFixed && !unFixColumn ) || ( !isColumnsFixed && !fixColumn ) ){
    console.error('fixColumn or unFixColumn is required.')
    return <div></div>
  }

  return (

    <div 
      className={ `grid scroll-bar-width-${scrollbarWidth}` }
      id={id} 
      style={ isColumnsFixed ? { borderRight: '4px solid #d0d0d0', overflow: 'visible' } : {} }
    >
      
      <Header 
        fixedColumns={ fixedColumns }
        isColumnsFixed={ isColumnsFixed }
        columns={ columns }
        id={ id }
        fixColumn={ fixColumn }
        unFixColumn={ unFixColumn }
        changeFieldWidth={ changeFieldWidth }
        updateReorderedColumns={ updateReorderedColumns }
        shouldStretch={ shouldStretch }
        scrollbarWidth={ scrollbarWidth }
        onHeaderFilterValueChange={ onHeaderFilterValueChange }
        onHeaderFilterSubmitted={ onHeaderFilterSubmitted }
        defaultColumnsConfig={ defaultColumnsConfig }
        currentSort={ currentSort }
        onSortChange={ onSortChange }
        headerDoubleLinePattern={ headerDoubleLinePattern }
        resetGrid={ resetGrid }
        header_filters={ header_filters }
        isWithCheckboxes={ isWithCheckboxes }
        multiple_selected_active_rows={ multiple_selected_active_rows }
        onCheckAllItemsStatusChanged={ onCheckAllItemsStatusChanged }
      />
      
      <Body 
        fixedColumns={ fixedColumns }
        isColumnsFixed={ isColumnsFixed }
        columns={ columns }
        rows={ rows }
        id={ id }
        shouldStretch={ shouldStretch }
        scrollbarWidth={ scrollbarWidth }
        defaultColumnsConfig={ defaultColumnsConfig }
        isDefaultColumnsExistForFixedGrid={ isDefaultColumnsExistForFixedGrid }
        onRowClicked={ onRowClicked }
        isWithCheckboxes={ isWithCheckboxes }
        multiple_selected_active_rows={ multiple_selected_active_rows }
        onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
      />

    </div>
  )
}

GridSingleWrapper.propTypes = {
  columns : PropTypes.arrayOf( PropTypes.shape({
    width : PropTypes.any,
    alias : PropTypes.string,
    field : PropTypes.string
  }) ),
  rows    : PropTypes.arrayOf( PropTypes.object ),// including fields of columns
  id      : PropTypes.string,
  isColumnsFixed : PropTypes.bool,
  fixColumn    : PropTypes.func,
  unFixColumn  : PropTypes.func,
  fixedColumns : PropTypes.array,
  changeFieldWidth : PropTypes.func,
  updateReorderedColumns : PropTypes.func,
  shouldStretch : PropTypes.bool.isRequired,
  scrollbarWidth : PropTypes.any.isRequired,
  onHeaderFilterValueChange : PropTypes.func.isRequired,
  onHeaderFilterSubmitted : PropTypes.func.isRequired,
  defaultColumnsConfig : PropTypes.shape({
    columns : PropTypes.arrayOf( PropTypes.string ),
    data    : PropTypes.object
  }),
  currentSort : PropTypes.object,
  onSortChange: PropTypes.func,
  isDefaultColumnsExistForFixedGrid : PropTypes.bool,
  onRowClicked : PropTypes.func,
  headerDoubleLinePattern : PropTypes.string,
  resetGrid : PropTypes.any,
  header_filters : PropTypes.object.isRequired,
  isWithCheckboxes : PropTypes.any,
  multiple_selected_active_rows : PropTypes.any,
  onRowCheckboxStatusChanged : PropTypes.func,
  onCheckAllItemsStatusChanged : PropTypes.func,
}

export default GridSingleWrapper