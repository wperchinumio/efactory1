import React from 'react'

const ShipMethods = ({
  detail
}) => {
  let {
    partner,
    ship_name,
    ship_via,
    ship_type,
    carrier_id,
  } = detail

  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Invoice</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship Name:</div>
          <div className="col-md-7">{ ship_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship Via:</div>
          <div className="col-md-7">{ ship_via }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship Type:</div>
          <div className="col-md-7">{ ship_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Carrier ID:</div>
          <div className="col-md-7">{ carrier_id }</div>
        </div>
      </div>
    </div>
  )
}
export default ShipMethods