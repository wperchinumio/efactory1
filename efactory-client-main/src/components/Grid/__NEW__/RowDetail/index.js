import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FixableGrid from '../FixableGrid'

const GridRowDetail = ({
  detailOpen,
  defaultHeight = 208,
  loadingRows_detailGrid,
  resizedFromOutside,
  rows_detailGrid = [],
  selectedViewFields_detailGrid,
}) => {
  const firstRun = useRef(true)
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (loadingRows_detailGrid) {
        global.$('#grids-wrapper-row-detail .selected-row').removeClass('selected-row')
      }
    },
    [loadingRows_detailGrid]
  )

  return (
    <div className="grid-row-detail-bottom-wrapper">
      <FixableGrid
        staticHeight={ detailOpen ? defaultHeight : 0 }
        id="row-detail"
        columns={ selectedViewFields_detailGrid }
        rows={ rows_detailGrid }
        defaultColumnsConfig={{
          columns : [],
          data    : { /* @todo : invoiceActions in the future */ }
        }}
        resizedFromOutside={ resizedFromOutside }
      />
    </div>
  )
}

GridRowDetail.propTypes = {
  detailOpen: PropTypes.bool.isRequired,
  defaultHeight: PropTypes.any,
  resizedFromOutside: PropTypes.any
}

export default connect(  
  state => ({
    selectedViewFields_detailGrid : state.grid.selectedViewFields_detailGrid,
    rows_detailGrid : state.grid.rows_detailGrid,
    loadingRows_detailGrid : state.grid.loadingRows_detailGrid,
  })
)(GridRowDetail)