import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ContentBar = props => {
  function onHideZeroQuantityClicked (event) {
    let { fulfillmentActions, dont_show_zero_qty } = props
    fulfillmentActions.setRootReduxStateProp_multiple({
      dont_show_zero_qty: !dont_show_zero_qty
    })
  }

  let { fulfillmentActions, dont_show_zero_qty } = props
  return (
    <div className="portlet-title tabbable-line">
      <div className="caption caption-md">
        <i className="icon-bar-chart font-green-seagreen"></i>
        <span className="caption-subject font-green-seagreen bold uppercase">
          Fulfillment
        </span>
        <div style={{ position: 'relative', top: '5px' }}>
          <div 
            className={ classNames({
              'bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-mini bootstrap-switch-id-test bootstrap-switch-animate' : true,
              'bootstrap-switch-off' : !dont_show_zero_qty,
              'bootstrap-switch-on' : dont_show_zero_qty
            }) }
            style={{width: '70px'}}
            onClick={ onHideZeroQuantityClicked }
          >
            <div 
              className="bootstrap-switch-container" 
              style={{width: 102, marginLeft: dont_show_zero_qty ? '0px' : '-34px'}}
            >
              <span className="bootstrap-switch-handle-on bootstrap-switch-primary" style={{width: 34}}>
                ON
              </span>
              <span className="bootstrap-switch-label" style={{width: 34}}>&nbsp;</span>
              <span className="bootstrap-switch-handle-off bootstrap-switch-default" style={{width: 34}}>
                OFF
              </span>
              <input type="checkbox" defaultChecked className="make-switch" id="test" data-size="mini" />
            </div>
          </div>
          <span style={{ fontSize : '10px', marginLeft: '8px' }}>
            Hide zero qty
          </span>
        </div>
      </div>
      <div className="actions">
        <a 
          className="btn btn-circle btn-icon-only btn-dashboard" 
          onClick={
            event => {
              event.preventDefault()
              fulfillmentActions.getFulfillmentsAsync( false, false, true )
            }
          }
        >
         <i className="icon-reload"></i>
        </a>
      </div>
    </div>
  )
}

ContentBar.propTypes = {
  fulfillmentActions: PropTypes.object.isRequired,
  dont_show_zero_qty: PropTypes.any
}

export default ContentBar