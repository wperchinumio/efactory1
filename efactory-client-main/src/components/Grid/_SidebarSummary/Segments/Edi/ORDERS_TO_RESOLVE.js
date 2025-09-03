import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'
import { formatNumber } from '../../../../_Helpers/FormatNumber'
import AddressTemplate from '../_AddressTemplate'

const OrdersToResolve = ({
  detail
}) => {
  let {
    // header_id ,
    sender_id ,
    receiver_id ,
    sender_code ,
    receiver_code ,
    partner ,
    order_number ,
    received_date ,
    gs_number ,
    ts_purpose ,
    po_type ,
    po_number ,
    po_total ,
    processing_status ,
    processing_date ,
    shipping_carrier ,
    shipping_service ,
    shipping_address,
    billing_address,
    ship_to_code ,
    bill_to_code ,
    seller_name ,
    seller_code ,
    approved_by ,
    approval_status ,
    approval_date ,
    routing_status ,
    routing_date ,
    branch_plant ,
    location ,
    account_number ,
    an8 ,
    dcl_customer ,
    updated_date
  } = detail

  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Order</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Acct #:</div>
          <div className="col-md-7">{ account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Order #:</div>
          <div className="col-md-7">{ order_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receipt Date:</div>
          <div className="col-md-7">{ formatDate( received_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sender ID:</div>
          <div className="col-md-7">{ sender_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receiver ID:</div>
          <div className="col-md-7">{ receiver_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sender Code:</div>
          <div className="col-md-7">{ sender_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receiver Code:</div>
          <div className="col-md-7">{ receiver_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">GS Number:</div>
          <div className="col-md-7">{ gs_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">TS Purpose:</div>
          <div className="col-md-7">{ ts_purpose }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO Type:</div>
          <div className="col-md-7">{ po_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">{ po_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO Total:</div>
          <div className="col-md-7">{ formatNumber( po_total, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Proc. Status:</div>
          <div className="col-md-7">{ processing_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Proc. Date:</div>
          <div className="col-md-7">{ formatDate( processing_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Carrier:</div>
          <div className="col-md-7">{ shipping_carrier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Service:</div>
          <div className="col-md-7">{ shipping_service }</div>
        </div>
        <AddressTemplate
          { ...shipping_address }
          isShipping={ true }
        />
        <AddressTemplate
          { ...billing_address }
          isShipping={ false }
        />
        <div className="row">
          <div className="col-md-5 seg-label">Ship To Code:</div>
          <div className="col-md-7">{ ship_to_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Bill To Code:</div>
          <div className="col-md-7">{ bill_to_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Seller Name:</div>
          <div className="col-md-7">{ seller_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Seller Code:</div>
          <div className="col-md-7">{ seller_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Approved By:</div>
          <div className="col-md-7">{ approved_by }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Appr. Status:</div>
          <div className="col-md-7">{ approval_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Appr. Date:</div>
          <div className="col-md-7">{ formatDate( approval_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Routing Status:</div>
          <div className="col-md-7">{ routing_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Routing Date:</div>
          <div className="col-md-7">{ formatDate( routing_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Branch Plant:</div>
          <div className="col-md-7">{ branch_plant }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Addr. Book #:</div>
          <div className="col-md-7">{ an8 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Customer:</div>
          <div className="col-md-7">{ dcl_customer }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Updated Date:</div>
          <div className="col-md-7">{ formatDate( updated_date ) }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve