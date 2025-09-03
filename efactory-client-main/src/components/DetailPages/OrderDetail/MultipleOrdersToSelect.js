import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import OrderType from '../../_Helpers/OrderType'
import OrderStage from '../../_Helpers/OrderStage'
import FormatDate from '../../_Helpers/FormatDate'

const MultipleOrdersToSelect = ({
  location: { pathname },
  orderDetails = []
}) => {
  return (
    <div>
      <p>
        There are ( <b> { orderDetails.length } </b> ) orders with the same 'order number'. 
        Please select an account.
      </p>
      <div className="table-responsive">
        <table className="table table-striped table-hover order-column row-sortable table-clickable">
          <thead>
            <tr className="uppercase table-header-1">
              <th> # </th>
              <th>  </th>
              <th> Account # </th>
              <th> Order Stage </th>
              <th> Ship To </th>
              <th> Receipt Date </th>
            </tr>
          </thead>
          <tbody className="ui-sortable">
            { orderDetails.map( ( aDetail, index ) => {
              let {
                account_number,
                order_type,
                order_stage,
                received_date,
                stage_description,
                shipping_address,
                order_number
              } = aDetail

              let {
                company,
                attention,
                city,
                state_province,
                postal_code,
                country
              } = shipping_address

              return (
                <tr
                  className="odd gradeX clickable-row ui-sortable-handle"
                  key={`draft-${index}`}
                >
                  <td>{ index+1 }</td>
                  <td>
                    <OrderType
                      order_type={ order_type }
                      isGridCell={false}
                    />
                  </td>
                  <td>
                    <Link 
                      to={`${pathname}?orderNum=${encodeURIComponent(order_number)}&accountNum=${account_number ? account_number : ''}`}
                    >
                      { account_number }
                    </Link>
                  </td>
                  <td>
                    <OrderStage 
                      order_stage={order_stage} 
                      stage_description={stage_description} 
                    />
                  </td>
                  <td className="text-address">
                    {
                      shipping_address &&
                      <div className="ship-to-outer">
                        <i className="font-blue-soft">

                          { `${company || ''} ${company && attention ? '|' : ''} ${attention || ''}` }

                        </i><br />
                        {
                          `${city ? city + ',' : ''}
                          ${state_province ? state_province : ''}
                          ${postal_code ? postal_code + '-' : ''}
                          ${country ? country : ''}`
                        }
                      </div>
                    }
                  </td>
                  <td>
                    <FormatDate 
                      date={received_date}
                    />
                  </td>
                </tr>
              )
            } ) }

          </tbody>
        </table>
      </div>
    </div>
  )
}

MultipleOrdersToSelect.propTypes = {
  orderDetails: PropTypes.array.isRequired,
  onSelectOrderDetail: PropTypes.func.isRequired
}

export default withRouter(MultipleOrdersToSelect)