import React from 'react'

const OrderType = props => {
  function typeClass (order_type) {
    switch (order_type) {
      case "EDE":
        return "order_type bg-purple-plum font-white";
      case "EDI":
        return "order_type bg-red-soft font-white";
      case "REST":
      case "SOAP":
      case "RTRE":
      case "RTSO":
        return "order_type bg-grey-mint font-white";
      case "AMZN":
      case "BIGP":
      case "CHAD":
      case "MAGP":
      case "MAGS":
      case "SHOP":
      case "SHST":
      case "STLS":
      case "WOOP":
        return "order_type bg-blue-steel font-white";
      case "OPEF":
      case "RTEF":
        return "order_type bg-green-haze font-white";
      default:
        return "order_type bg-grey-cascade font-white";
    }
  }

  return (
    <div>
      {
        props.order_type && !props.isGridCell &&
        <span className={typeClass(props.order_type)}>{props.order_type}</span>
      }
      {
        props.order_type && props.isGridCell &&
        <span>{props.order_type}</span>
      }
    </div>
  )
}

export default OrderType