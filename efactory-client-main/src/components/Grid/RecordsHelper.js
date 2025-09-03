import React from 'react'
import { Link } from 'react-router-dom'
import { GridData } from './Commons'
import {
  orderStatusClass,
  orderStatus,
  orderTypeClass
} from '../_Helpers/OrderStatus'
import OrderType from '../_Helpers/OrderType'
import FormatDate from '../_Helpers/FormatDate'
import * as renderers from '../_Helpers/_Renderers'
import global from 'window-or-global'
import classNames from 'classnames'

/*----------  Commonly used grid components  ----------*/
export const RecordsHelper = {

  order: {}, // this has to be set with valid order data before get method is used

  get: (fieldName, order, align, render = "", invoiceActions, currentFilters, bundleActions) => {
    let [functionName, ...funcArgs] = render.split(","),
      functionObject = renderers[functionName]

    if (render && !functionObject) {
      console.error('The render function \'' + render + '\' for the field \'' + fieldName + '\' in _Helpers/_Renderers. It needs to be added there and exported')
    } else if (render && functionObject) {
      funcArgs = [order, fieldName].concat([...funcArgs])
      funcArgs[funcArgs.length] = invoiceActions
      funcArgs[funcArgs.length] = currentFilters
      funcArgs[funcArgs.length] = bundleActions
      return () => <GridData
        className={classNames({
          [`text-${align}`]: true,
          'order_backlog': order.is_back_order && render === 'fmtorderlink'
        })}
        key={order.id + fieldName}
      >
        {functionObject(...funcArgs)}
      </GridData>
    }

    if (typeof RecordsHelper[fieldName] === 'undefined') {
      return RecordsHelper['any'](fieldName, order, align)
    } else {
      return RecordsHelper[fieldName]
    }

  },

  any: (fieldName, order, align = 'left') => {

    align = align.trim()
    return ({ order, align }, field = fieldName) => <GridData className={`text-${align}`} key={order.id + field}>{RecordsHelper._getDotFieldValue(order, field)}</GridData>

  },

  getDateField: (fieldName, order, align = 'left') => {
    return ({ order, align }, field = fieldName) => <GridData className={`text-${align}`} key={order.id + fieldName}><FormatDate
      date={order[fieldName]} /></GridData>
  },

  empty: ({ i }) =>
    <GridData key={i + "fieldindex"} className="text-right text-muted"></GridData>,

  _getDotFieldValue: function (obj = {}, field) {
    // this function handles
    let fields = field.split('.'),
      value = fields.length === 1 ? obj[fields[0]] : RecordsHelper._getDotFieldValue(obj[fields[0]], fields.slice(1).join('.'))

    return value;
  },

  _index: ({ order, newIndex }) =>
    <GridData key={order.id + "fieldindex"} className="text-right text-muted">
      {newIndex}
    </GridData>,

  _secondFixed: ({ order }) =>
    <GridData className="order-type-wrapper" key={order.id + "fieldfixed"} >
      <div className="order-type-inner">
        <span className={orderTypeClass(order.order_type)}>
          {order.order_type}
        </span>
        <span className="pull-right order-wh">
          {order.location}
        </span>
      </div>
      <span className={orderStatusClass(order.order_status)}
        style={order.order_status === 1 ? { display: "none" } : { marginTop: "4px" }}>
        {orderStatus(order.order_status)}
      </span>
      <span aria-hidden="true"
        className="icon-bubble text-muted pull-right"
        style={order.shipping_instructions ? { display: "block", paddingTop: "1px" } : { display: "none" }}>
      </span>
    </GridData>,
  _thirdFixed: ({ order, invoiceActions }) =>
    <GridData key={order.id + "fieldfixed3"} >
      <span>
        {
          order['url_invoice'] &&
          <span>
            <a onClick={event => {
              if (order['url_invoice']) {
                invoiceActions.downloadDocument(`${order['doc_no']}I`)
              }
            }} title="Invoice (PDF format)"> <i className="fa fa-file-pdf-o font-red-soft"></i></a>
            <a onClick={event => {
              if (order['url_invoice']) {
                invoiceActions.downloadDocument(`${order['doc_no']}D`)
              }
            }} title="Invoice Detail (Excel format)"> <i className="fa fa-file-excel-o font-green-jungle pull-right"></i></a>
          </span>
        }
      </span>
    </GridData>,

  _flagsFixed: ({ order }) => {
    return <GridData className="text-center" key={"flags"} >
      {order.flags ? order.flags : ''}
    </GridData>
  },

  order_type: ({ order, align = 'left' }) =>
    <GridData className={`text-${align}`} key={order.id + "ordertype"}>
      <OrderType
        order_type={order.order_type}
        isGridCell={true}
      />
    </GridData>,


  order_number: ({ order, align = 'left' }) =>
    <GridData key={order.id + "order_number"} className={`bold text-nowrap text-${align}` + (order.is_back_order ? ' order_backlog' : '')}>
      <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(order.order_number)}&accountNum=${order.account_number ? order.account_number : ''}`}>
        {order.order_number}
      </Link>
    </GridData>,

  rma_number: ({ order, align = 'left' }) =>
    <GridData key={order.row_id + "rma_number"} className={`bold text-nowrap text-${align}`}>
      <Link to={`${global.window.location.pathname}?rmaNum=${encodeURIComponent(order.rma_number)}&accountNum=${order.account_number ? order.account_number : ''}`}>
        {order.rma_number}
      </Link>
    </GridData>

}
