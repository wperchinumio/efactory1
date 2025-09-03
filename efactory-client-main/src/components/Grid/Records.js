import React from 'react'
import PropTypes from 'prop-types'
import { GridTable, GridBody, GridRow } from './Commons'
import { RecordsHelper } from './RecordsHelper'
import classNames from 'classnames'

const TableBody = ({
  activateRow,
  activeRowIndex,
  activePagination,
  bundleActions,
  children,
  currentFilters,
  flagsColumnVisible,
  handleScroll,
  invoiceActions,
  invoiceAllColumnVisible,
  orderFields = [],
  orderTypeColumnVisible,
  rowsPerPage,
  viewFields,
}) => {
  function getDefaultFields (dataFields = [], order, newIndex) {
    dataFields.push(
      RecordsHelper['_index']({ order, newIndex })
    )
    if (orderTypeColumnVisible) {
      dataFields.push(
        RecordsHelper['_secondFixed']({ order })
      )
    }
    if (invoiceAllColumnVisible) {
      dataFields.push(
        RecordsHelper['_thirdFixed']({ order, invoiceActions })
      )
    }
    if (flagsColumnVisible) {
      dataFields.push(
        RecordsHelper['_flagsFixed']({ order })
      )
    }
    return dataFields
  }

  function getRowData (order, orderIndex) {
    let activePaginationFixed = !activePagination ? 1 : activePagination
    let newIndex = ((activePaginationFixed - 1) * rowsPerPage) + orderIndex + 1
    let isRowActive = activeRowIndex === order.row_id
    let dataFields = getDefaultFields([], order, newIndex)
    viewFields.forEach(
      view => {
        let align = view.align ? view.align : undefined
        let fieldFunction = RecordsHelper.get(view.field, order, align, view.render, invoiceActions, currentFilters, bundleActions)
        dataFields.push(fieldFunction({ order, align }))
      }
    )
    if (order.item_number) {
      newIndex = orderIndex
    }
    let rowData = <GridRow
      key={`${order.field}Row-${orderIndex}`}
      className={classNames({
        'clickable-row': true,
        'active': isRowActive
      })}
      onClick={() => activateRow(order, order.row_id)}
    >
      {dataFields}
    </GridRow>
    return rowData
  }

  function addLast (rows) {
    let _length = viewFields.length
    let colSpan = _length + 1
    if (invoiceAllColumnVisible) colSpan += 1
    if (orderTypeColumnVisible) colSpan += 1
    if (flagsColumnVisible) colSpan += 1
    if (_length > 0) {
      rows.push(
        <GridRow key="bottomRowKey" style={{ visibility: "collapse", height: "30px" }}>
          <td
            className="text-right text-muted"
            colSpan={colSpan}
          ></td>
        </GridRow>
      )
    }
  }

  function getRows () {
    let rows = orderFields.map(
      (order, orderIndex) => getRowData(order, orderIndex)
    )
    addLast(rows)
    return rows
  }

  let rows = viewFields.length ? getRows() : []

  return (
    <div onScroll={handleScroll}>
      <GridTable className="table table-striped table-hover table-bordered">
        {children}
        <GridBody>
          {rows}
        </GridBody>
      </GridTable>
    </div>
  )
}

TableBody.propTypes = {
  activePagination: PropTypes.any,
  activeRow: PropTypes.any,
  activeRowIndex: PropTypes.any,
  activateRow: PropTypes.any,
  children: PropTypes.any,
  orderDetails: PropTypes.any,
  orderFields: PropTypes.any,
  orderTypeColumnVisible: PropTypes.any,
  flagsColumnVisible: PropTypes.any,
  rowsPerPage: PropTypes.any,
  handleScroll: PropTypes.any,
  invoiceActions: PropTypes.any,
  bundleActions: PropTypes.any,
  invoiceAllColumnVisible: PropTypes.any,
  isSearchAvailable: PropTypes.any,
  viewFields: PropTypes.any,
  currentFilters: PropTypes.any
}

export default TableBody