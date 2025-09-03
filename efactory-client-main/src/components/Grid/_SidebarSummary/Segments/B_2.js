import React from 'react'
import { formatDate } from '../../../_Helpers/OrderStatus'
import AddressTemplate from './_AddressTemplate'

const SummarySegmentB2 = ({
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
        <div className="row">
          <div className="col-md-5 seg-label">Carrier:</div>
          <div className="col-md-7">{ detail.shipping_carrier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Service:</div>
          <div className="col-md-7">{ detail.shipping_service }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship Date:</div>
          <div className="col-md-7">{ formatDate(detail.shipped_date)  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Tracking #:</div>
          <div className="col-md-7">
            {
              detail.trl &&
              <a href={detail.trl} target="_blank">{ detail.tr }</a>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Int. Code:</div>
          <div className="col-md-7">{ detail.international_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Freight Act:</div>
          <div className="col-md-7">{ detail.freight_account }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Consignee #:</div>
          <div className="col-md-7">{ detail.consignee_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Incoterms:</div>
          <div className="col-md-7">{ detail.terms }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">FOB:</div>
          <div className="col-md-7">{ detail.fob }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Payment Type:</div>
          <div className="col-md-7">{ detail.payment_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Insurance:</div>
          <div className="col-md-7">{ detail.insurance }</div>
        </div>
        <div className="portlet-body">
          <div className="row">
            <div className="col-md-10 col-md-offset-1 well padding-5">
              <h6 className="font-green-seagreen"><i className="fa fa-fire "></i>
                <span className="sbold uppercase">Shipping Instructions</span>
              </h6>
              { detail.shipping_instructions }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentB2