import React from 'react'
import history from '../../../history'
import { formatNumber } from '../../_Helpers/FormatNumber'

const InventoryTableBody = ({
  items,
  startTableIndexNumbersFrom,
  invoiceActions
}) => {
	return (
    <tbody>
      {
        items.map(
          (item, k) => {
            return (
              <tr key={k} className="odd gradeX">
                <td>{k + 1 + startTableIndexNumbersFrom}</td>
                <td className="bold text-center">
                  {item.warehouse}
                </td>
                <td className="bold text-nowrap">
                  <a onClick={ event => {
                    invoiceActions.setRootReduxStateProp({
                      field : 'navigationHidden',
                      value : true
                    }).then( () => {
                      history.push(`/overview?itemNum=${encodeURIComponent(item.item_number)}`)
                    } )
                  } }>
                    {item.item_number}
                  </a>
                </td>
                <td className="">
                  {item.description}
                </td>

                <td className="bold text-center"> {item.flags} </td>
                <td className="text-right">
                  { formatNumber(item.qty_onhand, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_onhold, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_committed, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_inproc, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_onff, 0) }
                </td>
                <td className="bold text-right">
                  { formatNumber(item.qty_net, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_min, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_dcl, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_openwo, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_openpo, 0) }
                </td>
                <td className="text-right">
                  { formatNumber(item.qty_openrma, 0) }
                </td>
              </tr>
            )
          }
        )
      }
    </tbody>
  )
}

export default InventoryTableBody
