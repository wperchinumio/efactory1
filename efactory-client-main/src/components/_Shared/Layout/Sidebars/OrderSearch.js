import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import history from '../../../../history'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gridActions from '../../../Grid/redux'
import * as invoiceActions from '../../../Invoices/Open/redux'

const SidebarOrderSearch = props => {
  const [searchInput, setSearchInput] = useState('')

  function handleSearchInput (event) {
    setSearchInput(event.target.value)
  }

  function handleSearchSubmit (event) {
    event.preventDefault()
    let trimmedSearchInput = searchInput.trim()
    if (trimmedSearchInput.length) {
      let { detailType, invoiceActions, location, gridActions } = props
      gridActions.setRootReduxStateProp_multiple({ activeRow: {}, activeRowIndex: '' })
      invoiceActions.setRootReduxStateProp({ field: 'navigationHidden', value: true }).then(
        () => history.push(`${location.pathname}?${detailType}Num=${trimmedSearchInput}`)
      )
    }
  }

  let typeKeyword = ''
  switch( props.detailType ){
    case 'order':
      typeKeyword = 'Order'
      break
    case 'item':
      typeKeyword = 'Item'
      break
    case 'rma':
      typeKeyword = 'RMA'
      break
    default:
      break
  }
  return (
    <form 
      className="sidebar-search sidebar-search-bordered sidebar-search-solid "
      autoComplete="off"
      onSubmit={handleSearchSubmit}
    >
      <a className="remove">
        <i className="icon-close"/>
      </a>
      <span className="input-group">
        <input  
          placeholder={ `Search for ${typeKeyword} #...`}
          value={searchInput}
          onChange={handleSearchInput}
          spellCheck="false"
          className="text-uppercase form-control" 
        />
        <span className="input-group-btn">
          <a className="btn">
            <i className="icon-magnifier" onClick={handleSearchSubmit} />
          </a>
        </span>
      </span>
    </form>
  )
}

SidebarOrderSearch.propTypes = {
  detailType: PropTypes.oneOf([ 'order', 'item', 'rma' ]).isRequired
}

export default withRouter(
  connect( 
    state => ({
      orderNumber: state.overview.sidebar.orderNumber,
      orderDetails: state.overview.orderDetails,
    }),
    dispatch => ({
      gridActions: bindActionCreators( gridActions, dispatch ),
      invoiceActions: bindActionCreators( invoiceActions, dispatch )
    })
  )(SidebarOrderSearch)
)