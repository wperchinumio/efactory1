import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as inventoryActions from '../BrowseItems/redux'

const TopHeader = props => {
  function onAddItem (event) {
    event.preventDefault()
    fetchItemsForSearch().then(
      ({ isSuccess, items, totalItems }) => {
        if( isSuccess ){
          if( totalItems === 1 ){
            setItemSearchFilterValue('')
            addMatchedOneItemToCart(items[0])
          }else{
            setSearchFilterValue('')
            setItemSearchFilterValue('')
            global.$('#browse-items-po').modal('show')
          }
        }else{
          console.error(
            `Something is wrong, check why fetchInventoryItems ` +
            `is not returning an error.`
          )
        }
      }
    )
  }

  function fetchItemsForSearch () {
    setWarehouseFilterValue('')
    setSearchFilterValue(props.addItemSearchFilterValue)
    setOmitZeroQtyFilterValue('')
    return fetchItems()
  }

  function setItemSearchFilterValue (value) {
    props.poRmaActions.setRootReduxStateProp('addItemSearchFilterValue', value)
  }

  function setWarehouseFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({field: 'warehouse', value})
  }

  function setSearchFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({field: 'searchFilter', value})
  }

  function fetchItems () {
    return props.inventoryActions.fetchInventoryItems()
  }

  function setOmitZeroQtyFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({field: 'omit_zero_qty', value})
  }

  /*
    this method is called when an item searched and
    api returned only one item as matched
    so that we add item to the cart and enable its quick edit option
  */
  function addMatchedOneItemToCart ({description, item_number}) {
    let itemObject = { description, item_number }
    props.poRmaActions.addItemToCart( {...itemObject, qty_now: 1 } ).then(
      ({ item_number, line_number, index }) => {
        setTimeout( () => {
          global.$(`#qty_now_${ index }`).editable('show')
        }, 500 )
      }
    )
  }

  let { addItemSearchFilterValue, header, searched } = props.poRmaState
  let { om_number, rma_number } = header

  return (
    <div
      className="addr-type items-title"
      style={{height: "40px", verticalAlign: "middle", lineHeight: "33px", overflow: "hidden"}}
    >
      <div>
        <div  className="col-md-12" style={{display: "inline-block"}}>
          <form autoComplete="off" onSubmit={onAddItem}>
            <div className="input-icon" style={{display: "inline-block", textAlign: "center"}}>
              <i className="fa fa-tag" style={{marginTop: "9px"}}> </i>
              <input style={{minWidth:"220px"}}
                type="text"
                disabled={ !searched }
                className="form-control input-circle input-sm search-item"
                placeholder="Add item..."
                value={ addItemSearchFilterValue }
                onChange={ event => setItemSearchFilterValue( event.target.value ) }
              />
            </div>&nbsp;&nbsp;
            {
              searched &&
              <span className="font-dark">
                <span>
                  RMA #: <span style={{ fontWeight: '400'  }}> { rma_number } </span>
                </span>  
                <span style={{ marginLeft: '20px' }}>
                  DCL PO #: <span style={{ fontWeight: '400' }}> { om_number } </span> 
                </span>  
              </span>
            }
            {
              searched 
              ? <a
                  href="#browse-items-po"
                  className="addr-edit pull-right"
                  data-toggle="modal"
                  style={{paddingLeft: "15px"}}
                  tabIndex="-1"
                ><i className="fa fa-search"> </i> Browse Items...
                </a>
              : <span className="addr-edit pull-right" style={{paddingLeft: "15px", fontSize: '11px', color: '#5d5d5d' }}> <i className="fa fa-search"> </i> Browse Items...</span>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

TopHeader.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default connect(
  state => ({
    addItemSearchFilterValue: state.services.utilities.poRma.addItemSearchFilterValue,
  }),
  dispatch => ({
    inventoryActions: bindActionCreators(inventoryActions, dispatch)
  })
)(TopHeader)