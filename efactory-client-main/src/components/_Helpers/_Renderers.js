/**
 * This is a special Helper in DCL framework
 * The functions here are being used in render property of Views API fields in Orders/Items pags
 * @link src/components/Grid/RecordsHelper.js RecordsHelper (where it is implemented)
 * All the render functions are supposed to be placed as a function in this files to work
 * All of the functions in this files have to have the following parameters as being the first 2:
 *  * @param {object} obj
 *  * @param {string} fieldName
  */

import React from 'react'
import OrderStage from './OrderStage'
import FormatNumber from './FormatNumber'
import FormatDate from './FormatDate'
import classNames from 'classnames'
import rmaConfig from '../ReturnTrak/Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'
import { Link } from 'react-router-dom'
import FilterLink from '../_Shared/FilterLink'

/**
 * @desc A wrapper function around @link OrderStage component
 * @return {ReactComponent}
 * @param {object} order
 * @param {string} fieldName
 * @returns {ReactComponent}
 */

let fmtorderstage = (order, fieldName) => {

  let props = { 'order_stage': order[fieldName], 'stage_description': order.stage_description }
  return <OrderStage {...props} />

}

/**
 * @return {ReactComponent}
 * @param {object} order
 * @param {string} fieldName
 */

let fmtshipto = (order, fieldName) => {
  let shipping_address = order.shipping_address || {};
  return <div className={`ship-to-outer`} key={order.id + "shipto"}>
    <i className="font-blue-soft">
      {`${shipping_address.company || ''} ${shipping_address.company && shipping_address.attention ? '|' : ''} ${shipping_address.attention || ''}`}
    </i><br />
    {`${shipping_address.city || ''}, ${shipping_address.state_province || ''} ${shipping_address.postal_code || ''} - ${shipping_address.country || ''}`}
  </div>
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} decimals Defines the number of the decimals for a number
 * @param {strong} boolean (as string). Defines if the number must be displayed in bold
 * @param {dimZero} boolean (as string). Defines if the number must be displayed in gray (dimmed)
 * @returns {ReactComponent}
 */

let fmtnumber = (obj, fieldName, decimals, strong = 'false', dimZero = 'false', hideNull = 'false', redIfOne = null) => {
  let props = { 'obj': obj, 'number': obj[fieldName], 'decimals': decimals, 'strong': strong, 'dimZero': dimZero, 'hideNull': hideNull, 'redIfOne': redIfOne }
  return <FormatNumber {...props} />
}

let fmtstrong = (obj, fieldName) => {
  return (
    <strong>
      {obj[fieldName]}
    </strong>
  )
}

let fmtmain = (obj, fieldName) => {
  return (
    <span className="text-primary bold">
      {obj[fieldName]}
    </span>
  )
}

let fmtorderstatus = (obj, fieldName) => {
  let label = null;
  switch (obj.order_status) {
    case 0:
      label = <span className="font-red-soft sbold ">On Hold</span>
      break;
    case 1:
      label = <span>Normal</span>
      break;
    case 2:
      label = <span className="font-purple-plum sbold">Rush</span>
      break;
    default:
      label = <span>Unknown</span>
      break;
  }
  return (
    label
  )
}

let warehousecode = (warehousename) => {
  return (
    warehousename.split('-')[1].trim()
    + (warehousename.split('-')[1].trim().slice(-1) !== 'C' ? 'C' : '')
    + '.'
    + warehousename.split('-')[0].trim()
  )
}

let fmtorderlink = (obj, fieldName) => {
  return (
    <span className="text-primary bold">
      {
        fieldName === 'order_number' &&
        <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(obj.order_number)}&accountNum=${obj.account_number ? obj.account_number : ''}`}>
          {obj.order_number}
        </Link>
      }
      {
        fieldName === 'original_order_number' &&
        <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(obj.original_order_number)}&accountNum=${obj.original_account_number ? obj.original_account_number : ''}`}>
          {obj.original_order_number}
        </Link>
      }
      {
        fieldName === 'replacement_order_number' &&
        <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(obj.replacement_order_number)}&accountNum=${obj.shipping_account_number ? obj.shipping_account_number : ''}`}>
          {obj.replacement_order_number}
        </Link>
      }
    </span>
  )
}

let fmtorderorrmalink = (obj, fieldName) => {
  return (
    <span className="text-primary bold">
      {
        fieldName === 'reference_number' && obj.dcl_process_source === 0 &&
        <Link to={`${global.window.location.pathname}?rmaNum=${encodeURIComponent(obj.reference_number)}&accountNum=${obj.account_number ? obj.account_number : ''}`}>
          {obj.reference_number}
        </Link>
      }
      {
        fieldName === 'reference_number' && obj.dcl_process_source !== 0 &&
        <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(obj.reference_number)}&accountNum=${obj.account_number ? obj.account_number : ''}`}>
          {obj.reference_number}
        </Link>
      }
    </span>
  )
}

let fmtdemandqty = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    account_number: [
      { field: 'account_number', value: obj['account_number'], oper: '=' }
    ],
    location: [
      { field: 'location', value: obj['location'].split('-')[0].trim(), oper: '=' }
    ],
    d_voided: [
      { field: 'd_voided', value: '0', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/order-lines/open?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtdemandqty2 = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    location: [
      { field: 'location', value: obj['location'].split('-')[0].trim(), oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: obj['location'].split('-')[1].trim() + '.' +  obj['location'].split('-')[0].trim(), oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/order-lines/open?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtitemlink = (obj, fieldName) => {
  return (
    <span className="text-primary bold">
      {
        fieldName === 'item_number' &&
        <Link to={`${global.window.location.pathname}?itemNum=${encodeURIComponent(obj.item_number)}`}>
          {obj.item_number}
        </Link>
      }
      {
        fieldName === 's_item_number' &&
        <Link to={`${global.window.location.pathname}?itemNum=${encodeURIComponent(obj.s_item_number)}`}>
          {obj.s_item_number}
        </Link>
      }
    </span>
  )
}

let fmtbundlelink = (obj) => {
  return (
    <span className="text-primary bold">
        <Link to={`${global.window.location.pathname}?itemNum=${encodeURIComponent(obj.bundle_item_number)}`}>
          {obj.bundle_item_number}
        </Link>
    </span>
  )
}

let fmtbundletypelink = (obj, fieldName, _invoiceActions, currentFilters, _bundleActions) => {
  return (
    <span className="text-primary bold">
        <i className="fa fa-edit"></i> <a onClick={ event => {
          _bundleActions.getBundleData(true, obj['bundle_item_id'], obj['inv_type']).then( () => {
                global.$('#bundle').modal('show')
              } ).catch( e => {} )
            }}
        > {obj[fieldName] === 1?  'Assembled' : (obj[fieldName] === 2? 'Bundled':  (obj[fieldName] === 9? 'Expired': 'Configured'))}  </a>
    </span>
  )
}

let fmtqonhandlink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: '0M', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/trsummary?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqonholdlink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), oper: '=' }
    ],
    show_all: [
      { field: 'show_all', value: false, oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/onhold?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqonfflink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    location: [
      { field: 'location', value: obj['inv_type'].split('-')[0].trim(), key: obj['inv_type'], oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/order-lines/open?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqopenpolink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), oper: '=' }
    ],
    consigned: [
      { field: 'consigned', value: true, oper: '=' }
    ],
    returns: [
      { field: 'returns', value: false, oper: '=' }
    ],
    dcl_purchased: [
      { field: 'dcl_purchased', value: true, oper: '=' }
    ],
    status: [
      { field: 'status', value: "to_receive", oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/receiving?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqopenrmalink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), oper: '=' }
    ],
    return_status: [
      { field: 'return_status', value: 'open', key: 'Open', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/returns?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqopenwolink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    wo_stage: [
      { field: 'wo_stage', value: '95', oper: '<' }
    ],
    wo_status: [
      { field: 'wo_status', value: 'open', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/assembly?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtbeginbalancelink = (obj, fieldName) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: '-1M', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/trsummary?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtsalesqtylink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    tr_type: [
      { field: 'tr_type', value: 'IF', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/transactions?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtreceiptslink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    received_date: [
      { field: 'received_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    consigned: [
      { field: 'consigned', value: true, oper: '=' }
    ],
    returns: [
      { field: 'returns', value: false, oper: '=' }
    ],
    dcl_purchased: [
      { field: 'dcl_purchased', value: false, oper: '=' }
    ],
    status: [
      { field: 'status', value: "received", oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/receiving?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtassembledqtylink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    build_date: [
      { field: 'completion_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    wo_stage: [
      { field: 'wo_stage', value: '89', oper: '>' }
    ],
    wo_status: [
      { field: 'wo_status', value: 'complete', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/assembly?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmttransferqtylink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    tr_type: [
      { field: 'tr_type', value: 'IM,ID,II,IR', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/transactions?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtadjustedqtylink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    tr_type_and: [
      { field: 'tr_type_and', value: 'IF,OV,IM,ID', oper: '<>' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/transactions?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtreturnqtylink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    tr_type: [
      { field: 'tr_type', value: 'OV', oper: '=' }
    ],
    doc_type: [
      { field: 'doc_type', value: 'OC', oper: '<>' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/transactions?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtcountadjustedlink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    inv_type_region: [
      { field: 'inv_type_region', value: warehousecode(obj['inv_type']), key: obj['inv_type'], oper: '=' }
    ],
    transaction_date: [
      { field: 'transaction_date', value: currentFilters.find(({ field }) => field === 'transaction_date').value, oper: currentFilters.find(({ field }) => field === 'transaction_date').oper }
    ],
    tr_type: [
      { field: 'tr_type', value: 'PI', oper: '=' }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/inventory/items/transactions?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqtyshippedlink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    account_number: [
      { field: 'account_number', value: obj['account_number'], oper: '=' }
    ],
    location: [
      { field: 'location', value: obj['location'].split('-')[0].trim(), oper: '=' }
    ],
    shipped_date: [
      { field: 'shipped_date', value: currentFilters.find(({ field }) => field === 'shipped_date').value, oper: currentFilters.find(({ field }) => field === 'shipped_date').oper }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/order-lines/shipped?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmtqtyalllink = (obj, fieldName, _invoiceActions, currentFilters) => {
  let qf = {
    item_number: [
      { field: 'item_number', value: obj['item_number'], oper: '=' }
    ],
    account_number: [
      { field: 'account_number', value: obj['account_number'], oper: '=' }
    ],
    location: [
      { field: 'location', value: obj['location'].split('-')[0].trim(), oper: '=' }
    ],
    received_date: [
      { 
        field: 'received_date', 
        value: currentFilters.find(
          ({ field }) => field === 'received_date'
        ).value, 
        oper: currentFilters.find(
          ({ field }) => field === 'received_date'
        ).oper 
      }
    ]
  }

  let queryfiltersforurl = encodeURIComponent(JSON.stringify(qf))

  return (obj[fieldName] === 0) ? (
    <FormatNumber
      obj={obj}
      fieldName={fieldName}
      number={obj[fieldName]}
      decimals={0}
      dimZero={'true'}
    />
  )
    :
    (
      <FilterLink
        to={`/order-lines/all?query_filters_exist=true&queryfilters=${queryfiltersforurl}`}
        filters={qf}
        className="text-primary bold"
      >
        {fmtnumber(obj, fieldName, 0, false, true)}
      </FilterLink>
    )
}

let fmttracking = (obj, fieldName) => {
  return (
    <>
      {
        fieldName === 'trl' &&
        obj.trl &&
        <span className="text-primary bold">
          <Link 
            to={{ pathname: obj.trl }}
            target={"_blank"}
          >
            {obj.tr}
          </Link>
        </span>
      }
      {
        fieldName === 'trl' &&
        !obj.trl &&
        <span>{obj.tr}</span>
      }
    </>
  )
}

let fmtrmatype = (obj, fieldName) => {
  return (
    <span>
      <i className={classNames({
        'fa fa-arrow-down': true,
        'font-red-soft': rmaConfig[obj['rma_type_code']][1][0]
      })}></i>
      <i className={classNames({
        'fa fa-arrow-up': true,
        'font-grey-salsa': !rmaConfig[obj['rma_type_code']][1][1],
        'font-blue-soft': rmaConfig[obj['rma_type_code']][1][1]
      })}></i>&nbsp;

      <span className="bold">{obj['rma_type_code']}</span> : <span className="small">{obj['rma_type_name']}</span>
    </span>
  )
}
let fmtdate = (obj, fieldName) => {
  return (obj[fieldName]) ? (
    <FormatDate date={obj[fieldName]} noTime="true" />
  ) : '';
}

let fmtdatetime = (obj, fieldName) => {
  return (obj[fieldName]) ? (
    <FormatDate date={obj[fieldName]} noTime="false" />
  ) : '';
}

let fmtcarrier = (obj, fieldName) => {
  let addOriginalCarrierService = obj['order_stage'] >= 50 && obj['requested_carrier'] &&
      (
         obj['requested_carrier'].toUpperCase() !== obj['shipping_carrier'].toUpperCase() ||
         obj['requested_service'].toUpperCase() !== obj['shipping_service'].toUpperCase()
      );
  let originalCarrierService = '';
  if (addOriginalCarrierService) {
    originalCarrierService = (
      <div className="selectship">
        <span className="bold">{obj['requested_carrier']}</span> - <span>{obj['requested_service']}</span>
      </div>
    )
  }
  return (
    <>
    {originalCarrierService}
    <span className='carrier_summary'>
      <span className="bold">{obj['shipping_carrier']}</span> - <span>{obj['shipping_service']}</span>
      <span className='tr_summary'>
      {obj['trl'] ?
        <a href={obj['trl']} target="_blank">{obj['tr']}</a> : <span>{obj['tr']}</span>
      }
      </span>
    </span>
    </>
  )
}

let fmtrtlink = (obj, fieldName) => {
  return (
    <span>
      {obj['return_label_url'] ?
        <a href={obj['return_label_url']} target="_blank">{obj['return_label_tracking_number']}</a> : <span>{obj['return_label_tracking_number']}</span>
      }
    </span>
  )
}

let fmtinv = (obj, fieldName, invoiceActions) => {
  return (
    <span>
      <span
        className="text-primary bold"> {obj['doc_no']}
        {
          obj['pay_item'] !== '001' &&
          <span style={{ fontSize: "11px", color: "#999" }}> / {obj['pay_item']}</span>
        }
      </span>
    </span>
  )
}

let fmtinvlinks = (obj, fieldName, invoiceActions) => {

  return (
    <span>
      {
        obj['url_invoice'] &&
        <span>
          <a onClick={event => {
            if (obj['url_invoice']) {
              invoiceActions.downloadDocument(`${obj['doc_no']}I`)
            }
          }}> <i className="fa fa-file-pdf-o font-red-soft"></i></a>
          <a onClick={event => {
            if (obj['url_invoice']) {
              invoiceActions.downloadDocument(`${obj['doc_no']}D`)
            }
          }}> <i className="fa fa-file-excel-o font-green-jungle pull-right"></i></a>
        </span>
      }
    </span>
  )
}

let fmtwarning = (obj, fieldName) => {
  return (
    <span className="font-red-soft sbold">{obj[fieldName]}</span>
  )
}

let fmtbool = (obj, fieldName) => {
  return (
    <span> {obj[fieldName] ? '1' : '0'} </span>
  )
}

let fmtbundletype = (obj, fieldName) => {
  return (
    <span> {obj[fieldName] === 1?  'Assembled' : (obj[fieldName] === 2? 'Bundled':  (obj[fieldName] === 9? 'Expired': 'Configured'))} </span>
  )
}

let fmtbundlepl = (obj, fieldName) => {
  return (
    <span> {obj[fieldName] === 0?  '' : 'Print'} </span>
  )
}

export {
  fmtorderstage, fmtorderlink, fmtorderorrmalink, fmtshipto, fmtnumber, fmtstrong, fmtmain,
  fmtitemlink, fmtbundlelink, fmtqonhandlink, fmtqonholdlink, fmtqonfflink, fmtqopenpolink, fmtqopenrmalink, fmtqopenwolink,
  fmtbeginbalancelink, fmtsalesqtylink, fmtreceiptslink, fmtassembledqtylink, fmttransferqtylink, fmtadjustedqtylink,
  fmtreturnqtylink, fmtcountadjustedlink,
  fmtqtyshippedlink,
  fmtqtyalllink,
  fmtdate, fmtdatetime, fmtcarrier, fmtrtlink, fmttracking, fmtinv, fmtwarning, fmtinvlinks, fmtrmatype, fmtorderstatus,
  fmtbool, fmtdemandqty, fmtdemandqty2, fmtbundletype, fmtbundletypelink, fmtbundlepl
}
