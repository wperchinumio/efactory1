import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUserData } from '../../../../../../util/storageHelperFuncs'

const TopHeader = props => {
  const warehousesRef = useRef(getUserData('warehouses') || {})
  const warehousesOptionValuesRef = useRef(null)

  useEffect(
    () => {
      setWarehouseOptions()
    },
    []
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

  function determineInvParams (location) {
    let matchedLocation = Object.keys(warehousesRef.current).filter(
      w => w.toLowerCase() === location.toLowerCase()
    )
    matchedLocation = matchedLocation.length ? matchedLocation[0] : ''
    let optionsMatched = warehousesOptionValuesRef.current.filter(
      o => o.toLowerCase().indexOf(matchedLocation.toLowerCase()) === 0
    )
    if (!optionsMatched.length) {
      return console.error('There is no option matched given location')
    }
    let matchedWarehouse = optionsMatched[0] // "EX-ZCLC"
    let inv_type   = matchedWarehouse.replace(/[a-zA-Z]+-/, '')
    let inv_region = matchedWarehouse.replace(/-[a-zA-Z]+/, '')
    return { inv_type, inv_region }
  }

  function addToCartIfNotExist ({ description, item_number }) {
    let { po, poActions } = props
    let { lines  = [] } = po
    lines = lines.filter( l => l.item_number === item_number )

    if (!lines.length) { 
      poActions.setRootReduxStateProp_multiple({
        lines : [
          ...po.lines,
          {
            line_number : po.lines.length + 1,
            item_number,
            description,
            quantity : 1
          }
        ],
        form_dirty : true
      }).then( () => {
        setTimeout( () => {
          global.$(`#po-${item_number}`).editable('show')
        }, 500 )
      } )
      
    } else {
      global.$(`#po-${item_number}`).editable('show')
    }
  }

  function onAddItem () {
    let { po, poActions } = props
    let { inv_region, inv_type } = determineInvParams(po.location)
    poActions.setRootReduxStateProp_multiple({
        fetchInventoryParams: {
          filter: { and: [
            { field: 'omit_zero_qty',oper: '=', value: false },
            { field: 'inv_type', oper: '=', value: inv_type },
            { field: 'inv_region', oper: '=', value: inv_region },
            { field: 'name', oper: '=', value: po.addItemSearchFilterValue }
          ]},
          page_num: 1,
          modalSearchFilter: ''
        },
      }).then( () => {
        poActions.fetchInventoryItems().then( ({  
          isSuccess, rows, total
        }) => {
          if (isSuccess) {
            if (total === 1) {
              addToCartIfNotExist( rows[0] )
            } else {
              global.$('#browse-items-po').modal('show')
            }
          }
        })
      }
    )
  }

  function onSearchInputChange (event) {
    props.poActions.setRootReduxStateProp('addItemSearchFilterValue', event.target.value)
  }

  let {
    account_number = '',
    location = '',
    addItemSearchFilterValue = ''
  } = props.po

  let isSearchDisabled = !account_number || !location

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
                disabled={ isSearchDisabled }
                className="form-control input-circle input-sm search-item"
                placeholder="Add item..."
                value={ addItemSearchFilterValue ? addItemSearchFilterValue : '' }
                onChange={ onSearchInputChange }
              />
            </div>&nbsp;&nbsp;
            <a
              href="#browse-items-po"
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
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default connect(
  state => ({
    addItemSearchFilterValue : state.returnTrak.entry.addItemSearchFilterValue,
    rmaHeader : state.returnTrak.entry.rmaHeader,
    rma_detail : state.returnTrak.entry.rma_detail
  })
)(TopHeader)