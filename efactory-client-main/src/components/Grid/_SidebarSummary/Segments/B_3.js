import React from 'react'
import AddressTemplate from './_AddressTemplate'

const SummarySegmentB3 = ({
  detail
}) => {
  let {  
    company = '',
    attention = '',
    address1 = '',
    address2 = '',
    city = '',
    state_province = '',
    postal_code = '',
    country = ''
  } = detail.shipping_address || {}
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Shipping </div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Ship Days:</div>
          <div className="col-md-7">{ detail.das }</div>
        </div>
        <AddressTemplate 
          company={ company }
          attention={ attention }
          address1={ address1 }
          address2={ address2 }
          city={ city }
          state_province={ state_province }
          postal_code={ postal_code }
          country={ country }
          isShipping={ true }
        />
        <div className="portlet-body">
          <div className="row">
            <div className="col-md-10 col-md-offset-1 well padding-5">
              <h6 className="font-green-seagreen"><i className="fa fa-fire "></i>
                <span className="sbold uppercase">
                  Shipping Instructions
                </span>
              </h6>
              { detail.shipping_instructions }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentB3