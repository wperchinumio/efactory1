import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const TableHead = props => {
  function toggleAllCheckedValue (event) {
    let { checked } = event.target
    let { po, poActions } = props
    let checkedRows = {}
    if (checked) {
      po.lines.forEach(line => {
        checkedRows[ line.item_number ] = true
      })
    }
    poActions.setRootReduxStateProp('checkedRows', checkedRows)
  }

  let { checkedRows, lines } = props.po
  let allChecked = false
  if (lines.length && Object.keys( checkedRows ).length === lines.length) {
    allChecked = true
  }

  return (
    <div>
      <div>
        <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
          <colgroup>
            <col style={{width: "65px"}}/>
            <col />
            <col style={{width: "60px"}}/>
            <col style={{width: "7px"}}/>
          </colgroup>
          <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th className="text-right cart-row">
                <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                  <input
                    type="checkbox"
                    disabled={ !lines.length }
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
                Qty
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
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default connect(
  state => ({
    checkedItems : state.returnTrak.entry.checkedItems
  })
)(TableHead)