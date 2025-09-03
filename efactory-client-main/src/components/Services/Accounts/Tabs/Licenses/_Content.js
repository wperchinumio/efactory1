import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const AccountTab1 = props => {
  useEffect(
    () => {
      props.accountActions.readLicenses()
    },
    []
  )

  let { licenses = [] } = props.accountState
  return (
    <div>
        <div className="col-lg-8 col-md-12">
        <p>License Summary</p>
        <div className="table-responsive">
          <table className="accounts table table-striped table-hover">
            <thead>
            <tr className="uppercase noselect table-header-1 cart-row" style={{height: "37px"}}>
              <th style={{verticalAlign: "middle", textAlign: "right",  width:"50px"}}>#</th>
              <th style={{verticalAlign: "middle"}}>License Name</th>
              <th style={{verticalAlign: "middle"}}>Description</th>
              <th style={{verticalAlign: "middle", textAlign: "right", width:"160px"}}>Monthly Fee</th>
              <th style={{verticalAlign: "middle", textAlign: "right", width:"160px"}}>No Charge</th>
              <th style={{verticalAlign: "middle", textAlign: "right", width:"160px"}}>In Use Now</th>
            </tr>
            </thead>
            <tbody>
              {
                licenses.map( 
                  (license, index) => {
                    let {
                      name,
                      description,
                      monthly_fee,
                      total_free,
                      used
                    } = license
                    return (
                      <tr key={`license-${index}`}>
                        <td className="text-right">{ index + 1 }</td>
                        <td className="text-primary sbold">
                          { name }
                        </td>
                        <td>
                          { description }
                        </td>
                        <td className="text-right sbold">
                          { monthly_fee && formatNumber(monthly_fee) }
                        </td>
                        <td className="text-right">
                          { total_free }
                        </td>
                        <td className="text-right">
                          { used }
                        </td>
                      </tr>
                    )
                  }
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

AccountTab1.propTypes = {
  accountActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
}

export default AccountTab1