import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentH = ({
  detail
}) => {
  return (
      <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Freight</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Ship Date:</div>
          <div className="col-md-7">{ formatDate(detail.shipped_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Package #:</div>
          <div className="col-md-7">{ detail.package_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Freight:</div>
          <div className="col-md-7">{ formatNumber(detail.freight_price,2)  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Actual Weight:</div>
          <div className="col-md-7">{ formatNumber(detail.weight,2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Rated Weight:</div>
          <div className="col-md-7">{ formatNumber(detail.rated_weight,2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Dimensions:</div>
          <div className="col-md-7">{ detail.dimension }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Insurance:</div>
          <div className="col-md-7">{ formatNumber(detail.insurance,2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship to zip:</div>
          <div className="col-md-7">{ detail.shipping_address && detail.shipping_address.postal_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship to country:</div>
          <div className="col-md-7">{ detail.shipping_address && detail.shipping_address.country }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Carrier:</div>
          <div className="col-md-7">{ detail.shipping_carrier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Service:</div>
          <div className="col-md-7">{ detail.shipping_service }</div>
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
          <div className="col-md-5 seg-label">Int. code:</div>
          <div className="col-md-7">{ detail.international_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Freight Act.:</div>
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
      </div>
    </div>
  )
}

export default SummarySegmentH