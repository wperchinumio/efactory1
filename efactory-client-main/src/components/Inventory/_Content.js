import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Pagebar from './PageBar'
import Pagebody from './PageBody'
import OrderDetails from '../DetailPages/OrderDetail/_Content'

const Inventory = ({
  location: { search }
}) => {
  return (
    <div>
      <div style={ search.includes("?orderNum=") ? {display : 'none'} : {}}>
        <Pagebar/>
        <Pagebody/>
      </div>
      { 
        search.includes("?orderNum=") &&
        <OrderDetails 
          queryNumber={search.slice(search.indexOf("=") + 1)} 
        />
      }
    </div>
  )
}

export default withRouter(Inventory)