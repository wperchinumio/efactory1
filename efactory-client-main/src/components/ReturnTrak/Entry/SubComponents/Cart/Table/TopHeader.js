import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import rmaConfig from '../../../../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'
import { getUserData } from '../../../../../../util/storageHelperFuncs'

const TopHeader = props => {
  const firstRun = useRef(true)
  const warehousesRef = useRef(getUserData('warehouses') || {})
  const warehousesOptionValuesRef = useRef(null)

  useEffect(
    () => {
      setWarehouseOptions()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      props.rmaEntryActions.setRootReduxStateProp({
        field: 'activeCartButton',
        value: 'auth'
      })
    },
    [props.rmaHeader.rma_type]
  )

  function setWarehouseOptions () {
    let warehousesOptionValues = []
    Object.keys(warehousesRef.current).forEach( ( aWarehouse, i1 ) => {
      warehousesRef.current[aWarehouse].forEach( ( invType, i2 ) => {
        Object.keys( invType ).forEach( ( anInvType, i3) => {
          let optionValue = `${aWarehouse}-${anInvType}`
          warehousesOptionValues.push( optionValue )
        } )
      } )
    } )
    warehousesOptionValuesRef.current = warehousesOptionValues
  }

  /*
  When search from an item numbers,
  use these rules based on the selected button
    [Auth/ ToShip]:

    a) "Auth" items should be searched ignoring the warehouse and
       presetting "Show 0 qty" to true. In the "items" dialog,
       when opened, the qty input fields should ALWAYS be editable;
       also hide the UNIT PRICE and NET AVAILABLE columns.

    b) "To Ship": It should behave like in Orderpoint (editable only
       if warehehouse matches "ACCOUNT # - SHIPPING WAREHOUSE" and preset
       "Show 0 qty" to false. */
  function onAddItem () {
    fetchItemsBasedOnActiveButton().then( ({
      isSuccess, items, totalItems
    }) => {
      if( isSuccess ){
        if( totalItems === 1 ){
          setItemSearchFilterValue('')
          addMatchedOneItemToCart(items[0])
        }else{
          setSearchFilterValue('')
          setItemSearchFilterValue('')
          global.$('#rma-edit-items').modal('show')
        }
      }else{
        console.error(
          `Something is wrong, check why fetchInventoryItems ` +
          `is not returning an error.`
        )
      }
    } )
  }

  function setItemSearchFilterValue (value) {
    props.rmaEntryActions.setRootReduxStateProp({ field: 'addItemSearchFilterValue', value })
  }

  function setWarehouseFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'warehouse', value })
  }

  function setSearchFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'searchFilter', value })
  }

  function fetchItems () {
    return props.inventoryActions.fetchInventoryItems()
  }

  function setOmitZeroQtyFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'omit_zero_qty', value })
  }

  function fetchItemsBasedOnActiveButton () {
    let {
      activeCartButton,
      accountShippingWarehouse,
      addItemSearchFilterValue
    } = props
    if( activeCartButton === 'ship' ){
      if( accountShippingWarehouse ){
        let locationDerived = accountShippingWarehouse.replace(/\d+\./,'')
        let matchedLocation = Object.keys(warehousesRef.current).filter(
          w => w.toLowerCase() === locationDerived.toLowerCase()
        )
        matchedLocation = matchedLocation.length ? matchedLocation[0]: ''
        if( matchedLocation ){
          let optionsMatched = warehousesOptionValuesRef.current.filter(
            o => o.toLowerCase().indexOf(matchedLocation.toLowerCase()) === 0
          )
          if( optionsMatched.length ){
            let matchedWarehouse = optionsMatched[0]
            setWarehouseFilterValue( matchedWarehouse )
            setSearchFilterValue(addItemSearchFilterValue)
            setOmitZeroQtyFilterValue(true)
            return fetchItems()
          }
        }
        console.error('There is no option matched selected accountShippingWarehouse')
        return Promise.resolve({ isSuccess: false })
      }
    }else{
      setWarehouseFilterValue('')
      setSearchFilterValue(addItemSearchFilterValue)
      setOmitZeroQtyFilterValue('')
      return fetchItems()
    }
  }

  /*
    this method is called when an item searched and
    api returned only one item as matched

    so that we add item to the cart and enable its quick edit option
  */
  function addMatchedOneItemToCart ({description, item_number}) {
    let { activeCartButton, rmaHeader, rmaEntryActions } = props
    let { rma_type } = rmaHeader
    let itemObject = { description, item_number }
    if( activeCartButton === 'auth' ){
      let isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
      if( isToShipButtonBlue ){
        rmaEntryActions.addRmaDetailItem({ fieldType : 'to_ship', itemObject })
      }
      rmaEntryActions.addRmaDetailItem({ fieldType : 'to_receive', itemObject }).then(
        ({ item_number, line_number }) => {
          setTimeout( () => {
            global.$(`#to_receive__${item_number}__${line_number}`).editable('show')
          }, 0 )
        }
      )
    }else{
      rmaEntryActions.addRmaDetailItem({ fieldType : 'to_ship', itemObject }).then(
        ({ item_number, line_number }) => {
          setTimeout( () => {
            global.$(`#to_ship__${item_number}__${line_number}`).editable('show')
          }, 0 )
        }
      )
    }
  }

  let {
    activeCartButton,
    addItemSearchFilterValue,
    accountShippingWarehouse
  } = props

  let {
    accountReceivingWarehouse,
    rma_type
  } = props.rmaHeader

  let isRmaTypeSelected = rma_type ? true : false

  let isAuthButtonRed = false
  let isToShipButtonBlue = false

  if( isRmaTypeSelected ){
    isAuthButtonRed = rmaConfig[ rma_type ][1][0] ? true : false
    isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
  }

  let { setRootReduxStateProp } = props.rmaEntryActions

  return (
    <div
      className="addr-type items-title"
      style={{height: "40px", verticalAlign: "middle", lineHeight: "33px", overflow: "hidden"}}
    >
      <div>
        <div  className="col-md-12" style={{display: "inline-block"}}>
          <form
            autoComplete="off"
            onSubmit={ event => {
              event.preventDefault()
              onAddItem()
            } }
          >
            <div className="input-icon" style={{display: "inline-block", textAlign: "center"}}>
              <i className="fa fa-tag" style={{marginTop: "9px"}}> </i>
              <input style={{minWidth:"220px"}}
                type="text"
                disabled={ !accountReceivingWarehouse || !isRmaTypeSelected }
                className="form-control input-circle input-sm search-item"
                placeholder="Add item..."
                value={ addItemSearchFilterValue }
                onChange={ event => setItemSearchFilterValue( event.target.value ) }
              />
            </div>&nbsp;&nbsp;
            <div className="btn-group btn-group-circle" data-toggle="buttons" >
              <label
                className={
                  classNames({
                    'btn btn-default btn-sm rt': true,
                    'active': activeCartButton === 'auth',
                    'disabled': !isRmaTypeSelected
                  })
                }
                onClick={ event => setRootReduxStateProp({
                  field: 'activeCartButton',
                  value: 'auth'
                }) }
              >
                <i className={ classNames({
                  'fa fa-arrow-down': true,
                  'font-red-soft': isRmaTypeSelected && isAuthButtonRed,
                  'font-dark': isRmaTypeSelected && !isAuthButtonRed,
                  'font-grey-salsa': !isRmaTypeSelected
                }) }></i>  Auth.&nbsp;&nbsp;
              </label>
              <label
                className={
                  classNames({
                    'btn btn-default btn-sm rt': true,
                    'active': activeCartButton === 'ship' && isToShipButtonBlue,
                    'disabled': !isToShipButtonBlue || !accountShippingWarehouse
                  })
                }
                onClick={ event => {
                  if( isRmaTypeSelected && isToShipButtonBlue && accountShippingWarehouse ){
                    setRootReduxStateProp({
                      field: 'activeCartButton',
                      value: 'ship'
                    })
                  }}
                }
              > &nbsp;&nbsp;To Ship
                <i className={ classNames({
                  'fa fa-arrow-up': true,
                  'font-blue-soft': isRmaTypeSelected && isToShipButtonBlue,
                  'font-grey-salsa': !( isRmaTypeSelected && isToShipButtonBlue )
                }) }></i>
              </label>
            </div>
            <a
              href="#rma-edit-items"
              className="addr-edit pull-right"
              data-toggle="modal"
              style={{paddingLeft: "15px"}}
              tabIndex="-1"
            ><i className="fa fa-search"> </i> Browse Items...</a>
          </form>
        </div>
      </div>
    </div>
  )
}

TopHeader.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  inventoryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    accountShippingWarehouse: state.returnTrak.entry.rmaHeader.accountShippingWarehouse,
    activeCartButton: state.returnTrak.entry.activeCartButton,
    addItemSearchFilterValue: state.returnTrak.entry.addItemSearchFilterValue,
    rmaHeader: state.returnTrak.entry.rmaHeader,
    rma_detail: state.returnTrak.entry.rma_detail
  })
)(TopHeader)