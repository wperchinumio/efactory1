import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { GridTable, GridHead } from '../Commons'
import Filters from './Filters'
import Headers from './Headers'



const TableHeader = ({
  children,
  currentFilters,
  currentSort,
  flagsColumnVisible,
  invoiceAllColumnVisible,
  orderTypeColumnVisible,
  orderSummaryVisible,
  quickfilters,
  queryFilters,
  resource,
  sort,
  toggleFilters,
  viewFields,
}) => {
  return (
    <div
      className={ classNames({
        "table-container-header gridview-header table-container-header-rr repaint-node" : true,
        "order-summary-open" : orderSummaryVisible
      }) }
      style={{ width : 'auto !important' }}
    >
      <GridTable className="table table-striped table-hover table-condensed table-bordered">
        {children}
        <GridHead>
          <Headers
            viewFields={viewFields}
            orderTypeColumnVisible={orderTypeColumnVisible}
            flagsColumnVisible={flagsColumnVisible}
            invoiceAllColumnVisible={invoiceAllColumnVisible}
            currentSort={currentSort}
            sort={sort}
          />
          <Filters
            viewFields={ viewFields }
            orderTypeColumnVisible={ orderTypeColumnVisible }
            flagsColumnVisible={flagsColumnVisible}
            invoiceAllColumnVisible={invoiceAllColumnVisible}
            quickfilters={ quickfilters }
            currentFilters={ currentFilters }
            toggleFilters={toggleFilters}
            resource={ resource }
            queryFilters={ queryFilters }
          />
        </GridHead>
      </GridTable>
    </div>
  )
}

TableHeader.propTypes = {
  orderSummaryVisible : PropTypes.bool,
  orderTypeColumnVisible : PropTypes.bool,
  quickfilters : PropTypes.object.isRequired,
  sort : PropTypes.func.isRequired,
  currentSort : PropTypes.object.isRequired,
  currentFilters : PropTypes.array.isRequired,
  toggleFilters : PropTypes.func.isRequired,
  viewFields : PropTypes.array,
  resource : PropTypes.string,
  flagsColumnVisible : PropTypes.any,
  queryFilters : PropTypes.object
}

TableHeader.defaultProps = {
  orderSummaryVisible : false,
  orderTypeColumnVisible : false,
  quickfilters : {},
  currentSort : {},
  viewFields : []
}

export default TableHeader