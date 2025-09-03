import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ThirtyDays = ({
  visible,
  customizeEdiActions,
  customizeEdiState,
}) => {
  function onSwitchClicked (event) {
    let { current_areas = [] } = customizeEdiState
    current_areas = current_areas.map( 
      area => ({
        ...area,
        visible : area.name === 'summary' ? !area.visible : area.visible
      })
    )
    customizeEdiActions.setRootReduxStateProp_multiple({
      current_areas,
      saved_view : false
    })
  }

  return (

    <div 
      className="portlet light bordered my-10 overview-custom"
    >
      <div className="portlet-title">
        <div className="caption caption-md">
          <span>Component:</span> &nbsp; 
          <span className="customize-overview-title">SUMMARY</span>
        </div>
        <div className="actions">

          <span className="rounded-slider-input">
            <span className="font-grey-gallery">
              Visible:
            </span> &nbsp;&nbsp;
            
            <div 
              className={ classNames({
                'bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-mini bootstrap-switch-id-test bootstrap-switch-animate' : true,
                'bootstrap-switch-off' : !visible,
                'bootstrap-switch-on' : visible
              }) }
              style={{width: '70px'}}
              onClick={ onSwitchClicked }
            >
              <div 
                className="bootstrap-switch-container" 
                style={{width: 102, marginLeft: visible ? '0px' : '-34px'}}
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

          </span>


          <span 
            className="font-24 pull-right font-grey-gallery" 
            style={{ marginTop: '-6px', marginLeft: '10px' }}
          >
            <i className="fa fa-bars"></i>
          </span>


        </div>
      </div>
      <div className="portlet-body no-drag">
        <div className="font-grey-mint font-35 margin-b-15 padding-tb-20 text-center">
          <i className="fa fa-table"></i>
        </div>
      </div>
    </div>
  )
}

ThirtyDays.propTypes = {
  visible: PropTypes.any,
  customizeEdiActions: PropTypes.object.isRequired,
  customizeEdiState: PropTypes.object.isRequired,
}

export default ThirtyDays