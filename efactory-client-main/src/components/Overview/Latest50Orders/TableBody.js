import React from 'react'
import history from '../../../history'
import OrderStage from '../../_Helpers/OrderStage'
import OrderType from '../../_Helpers/OrderType'
import FormatDate from '../../_Helpers/FormatDate'

const OverviewOrdersTableBody = ({
  orders,
  pathname,
  startTableIndexNumbersFrom,
  invoiceActions
}) => {
	return (
    <tbody>
      {
        orders.map(
          (order, k) => {
            return (
              <tr key={k} className="odd gradeX">
                <td>{k + 1 + startTableIndexNumbersFrom}</td>
                <td className="bold text-nowrap" style={{ minWidth:"120px", fontSize:"13px" }}>
                  <a onClick={ event => {
                    invoiceActions.setRootReduxStateProp({
                      field : 'navigationHidden',
                      value : true
                    }).then( () => {
                      history.push(`/overview?orderNum=${encodeURIComponent(order.order_number)}`)
                    } )
                  } }>
                    {order.order_number}
                  </a>
                </td>
                <td style={{ minWidth:"155px", fontSize:"12px" }}>
                  <FormatDate date={ order.received }/><br />
                <div className="pull-left">
                    <OrderType order_type={order.order_type}/>
                </div>
                </td>
                <td style={{fontSize:"12px", minWidth:"140px"}}>
                    <OrderStage order_stage={order.order_stage} stage_description={order.stage_description} />
                </td>
                <td style={{fontSize:"12px", maxWidth:"230px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}} ><i className="font-blue-soft">{order.ship_to}</i><br />{order.ship_address}</td>
                <td style={{minWidth:"155px",fontSize:"12px"}} >
                  <FormatDate date={ order.shipped }/><br />
                </td>
                <td style={{fontSize:"11px"}} className="uppercase"><span style={{whiteSpace:"nowrap"}}><strong >{order.carrier}</strong> {order.service} </span><br />
                  <a href={order.tracking_url} target="_blank" > {order.tracking_no} </a>
                </td>
              </tr> 
            )
          }
        )
      }
    </tbody>
  )
}

export default OverviewOrdersTableBody