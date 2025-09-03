import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const TableHead = props => {
  function toggleAllCheckedValue (event) {
    const value = event.target.checked
    let { checkedItems } = props
    checkedItems = { ...checkedItems, allChecked: value }
    props.rmaEntryActions.setRootReduxStateProp({
      field : 'checkedItems',
      value : checkedItems
    })
  }

  let { allChecked } = props.checkedItems
  return (
    <div>
      <div>
        <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
          <colgroup>
            <col style={{width: "65px"}}/>
            <col />
            <col style={{width: "60px"}}/>
            <col style={{width: "160px"}}/>
            <col style={{width: "65px"}}/>
            <col style={{width: "85px"}}/>
            <col style={{width: "7px"}}/>
          </colgroup>
          <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th className="text-right cart-row">
                <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                  <input
                    type="checkbox"
                    checked={ allChecked }
                    onChange={ toggleAllCheckedValue }
                    className="pull-right"
                  />
                  <div style={{minWidth: "18px"}}>
                    #
                  </div>
                  <span className="bg-grey"></span>
                </label>
              </th>
              <th className="text-left">
                Item # / Description
              </th>
              <th className="text-right">
                Auth.<br/>Qty
              </th>
              <th className="text-center">
                Auth.<br/> Serial #
              </th>
              <th className="text-right">
                Ship Qty
              </th>
              <th className="text-right">
                Unit Price
              </th>
              <th className="text-left">
                &nbsp;
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

TableHead.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    checkedItems : state.returnTrak.entry.checkedItems
  })
)(TableHead)