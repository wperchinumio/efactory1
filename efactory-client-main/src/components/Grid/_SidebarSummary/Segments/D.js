import React from 'react'
import AddressTemplate from './_AddressTemplate'

const SummarySegmentD = ({
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
  } = detail.billing_address || {}

  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">
          Billing
        </div>
      </div>
      <div className="portlet-body">
        <AddressTemplate 
          company={ company }
          attention={ attention }
          address1={ address1 }
          address2={ address2 }
          city={ city }
          state_province={ state_province }
          postal_code={ postal_code }
          country={ country }
          isShipping={ false }
        />
        <div className="row">
          <div className="col-md-10 col-md-offset-1 well padding-5">
            <h6 className="font-green-seagreen">
              <i className="fa fa-fire"/>
              <span className="sbold uppercase">Comments</span>
            </h6>
            { detail.comments }
          </div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentD