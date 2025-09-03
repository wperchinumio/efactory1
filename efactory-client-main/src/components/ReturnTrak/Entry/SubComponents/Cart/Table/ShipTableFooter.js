import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const TableFooter = props => {
  const toShipTotalExtPriceRef = useRef(null)
  const propsRef = useRef(null)
  propsRef.current = props

  function removeSelectedItems () {
    let { checkedItems, rma_detail, rmaEntryActions } = props
    let {  to_receive = [], to_ship  } = rma_detail
    
    if( checkedItems.allChecked ){
      rmaEntryActions.setRootReduxStateProp({
        field : 'checkedItems',
        value : {
          allChecked : false,
          to_receive : {},
          to_ship : {}
        }
      })
      rmaEntryActions.setRootReduxStateProp({
        field : 'dirty',
        value : true
      })
      rmaEntryActions.setRootReduxStateProp({
        field : 'rma_detail',
        value : {
          to_ship : to_ship.filter( shipItem => {
            if( shipItem.detail_id === 0 ) return false
            shipItem.voided = true
            return true
          } ),
          to_receive : to_receive.filter( authItem => {
            if( authItem.detail_id === 0 ) return false
            authItem.voided = true
            return true
          } )
        }
      })
      return
    }
    to_receive = to_receive.filter( authItem => {
      let isAuthItemSelected = checkedItems[ 'to_receive' ][ `${authItem.item_number}__${authItem.line_number}`  ]
      if( !isAuthItemSelected ) return true
      else{
        // that is how we determine if item should be removed or voided
        let isAuthItemDetailZero = authItem.detail_id === 0
        if( isAuthItemDetailZero ) return false
        authItem.voided = true
        return true
      }
    } )
    to_ship = to_ship.filter( shipItem => {
      let isShipItemSelected = checkedItems[ 'to_ship' ][ `${shipItem.item_number}__${shipItem.line_number}` ]
      if( !isShipItemSelected ) return true
      else{
        // that is how we determine if item should be removed or voided
        let isShipItemDetailZero = shipItem.detail_id === 0
        if( isShipItemDetailZero ) return false
        shipItem.voided = true
        return true
      }
    } )
    // rearrange line numbers
    let line_number_receive = 1
    let line_number_ship = 1

    to_receive = to_receive.map( ( authItem, index ) => ({
      ...authItem,
      line_number : authItem.voided ? 0 : line_number_receive++
    }) )
    to_ship = to_ship.map( ( shipItem, index ) => ({
      ...shipItem,
      line_number : shipItem.voided ? 0 : line_number_ship++
    }) )
    rmaEntryActions.setRootReduxStateProp({
      field : 'dirty',
      value : true
    })
    rmaEntryActions.setRootReduxStateProp({
      field : 'checkedItems',
      value : {
        allChecked : false,
        to_receive : {},
        to_ship : {}
      }
    })
    rmaEntryActions.setRootReduxStateProp({
      field : 'rma_detail',
      value : { to_ship, to_receive }
    }).then( () => {
      propsRef.current.rma_detail.to_receive.forEach( item => {
        let el = global.$(`#serial__${item.line_number}`)
        el.editable('setValue','',true)
        el.addClass('editable-empty')
        el.removeClass('editable-unsaved')
      } )
    } )
  }

  let { rma_type, accountReceivingWarehouse } = props.rmaHeader
  let { to_ship, to_receive } = props.rma_detail
  let toShipTotalLines = 0, toShipTotalQty = 0, toShipTotalExtPrice = 0
  let authTotalLines = 0, authTotalQty = 0
  to_ship.forEach( shipItem => {
    if( !shipItem.voided ) toShipTotalLines += 1
    toShipTotalQty += +shipItem.quantity
    toShipTotalExtPrice += +shipItem.unit_price * +shipItem.quantity
  } )
  to_receive.forEach( returnItem => {
    if( !returnItem.voided ) authTotalLines += 1
    authTotalQty += +returnItem.quantity
  } )
  toShipTotalExtPrice = (+toShipTotalExtPrice).toFixed(2)
  if( toShipTotalExtPriceRef.current !== toShipTotalExtPrice ){
    let { setRootReduxStateProp } = props.rmaEntryActions
    let { amounts } = props
    setTimeout( () => {
      amounts = { ...amounts }
      amounts.total_due = +amounts.shipping_handling + +amounts.sales_tax + +amounts.international_handling + +toShipTotalExtPrice
      amounts.net_due_currency = +amounts.total_due - +amounts.amount_paid
      setRootReduxStateProp({
        field : 'amounts',
        value : {
          ...amounts,
          order_subtotal : toShipTotalExtPrice
        }
      })
    }, 0 )
    toShipTotalExtPriceRef.current = toShipTotalExtPrice
  }
  let { checkedItems } = props
  let removeSelectedItemsButtonDisabled = !accountReceivingWarehouse ||
      !rma_type ||
      (
        Object.keys( checkedItems[ 'to_receive' ] ).filter( i => checkedItems[ 'to_receive' ][ i ] ).length +
        Object.keys( checkedItems[ 'to_ship' ] ).filter( i => checkedItems[ 'to_ship' ][ i ] ).length === 0 &&
        !checkedItems[ 'allChecked' ]
      )
  return (
    <div className="op-cart-footer">
      <table>
        <tbody>
          <tr>
            <td style={{width: "100%", verticalAlign: "top"}}>
              <button
                className="btn red-soft btn-xs"
                disabled={ removeSelectedItemsButtonDisabled }
                onClick={ event => {
                  if( !removeSelectedItemsButtonDisabled ){
                    removeSelectedItems()
                  }
                } }
              >
                Remove selected items
              </button>
            </td>
            <td style={{minWidth: "25px", verticalAlign: "top"}}><i className="fa fa-arrow-down font-red-soft"></i></td>
            <td style={{minWidth: "180px", verticalAlign: "top"}} className="small">
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Lines:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ authTotalLines }</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Qty:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ authTotalQty }</strong>
                </div>
              </div>
            </td>
            <td style={{minWidth: "50px", padding: "0 25px", verticalAlign: "top"}}><div style={{borderLeft: "1px solid #ccc", height: "50px"}}>&nbsp;</div></td>
            <td style={{minWidth: "25px", verticalAlign: "top"}}><i className="fa fa-arrow-up font-blue-soft"></i></td>
            <td style={{minWidth: "180px"}} className="small">
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Lines:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ toShipTotalLines }</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Qty:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ toShipTotalQty }</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Ext Price:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ toShipTotalExtPrice }</strong>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

TableFooter.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    amounts: state.returnTrak.entry.amounts,
    checkedItems: state.returnTrak.entry.checkedItems,
    rmaHeader: state.returnTrak.entry.rmaHeader,
    rma_detail: state.returnTrak.entry.rma_detail
  })
)(TableFooter)