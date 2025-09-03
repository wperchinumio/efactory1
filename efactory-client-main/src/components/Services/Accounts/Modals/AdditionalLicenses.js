import React from 'react'
import PropTypes from 'prop-types'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const AdditionalLicenseModal = props => {
  function onSubmit (event) {
    props.accountActions.saveEditUserChanges( false ).then(
      () => {
        global.$('#additional-license-user').modal('hide')
        global.$('#edit-user').modal('hide')
      }
    ).catch( e => {})
  }

  let { additional_licenses = [] } = props.accountState
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="additional-license-user"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Additional License Request</h4>
          </div>
          <div className="modal-body">
            <div className="table-responsive">
              <table className="accounts table table-striped table-hover">
                <thead>
                <tr className="uppercase noselect table-header-1" style={{height: "37px"}}>
                  <th style={{verticalAlign: "middle", textAlign: "right",  width:"50px"}}>#</th>
                  <th style={{verticalAlign: "middle"}}>License Type</th>
                  <th style={{verticalAlign: "middle", textAlign: "right", width:"150px"}}>Monthly Price</th>
                </tr>
                </thead>
                <tbody>
                  {
                    additional_licenses.map( ({ name , monthly_fee }, index ) => {
                      return (
                        <tr key={`additional_licenses-${index}`}>
                          <td className="text-right">{ index + 1 }</td>
                          <td className="text-primary sbold">{ name }</td>
                          <td className="text-primary text-right">
                            { monthly_fee && formatNumber( monthly_fee, 2 )  }
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
            <p style={{textAlign: "right", marginTop: 0, paddingRight: "5px"}}>
              Change Monthly Charge: <span style={{paddingLeft: "20px", fontWeight: 700}}>
              { 
                formatNumber(  
                  additional_licenses.reduce( ( prev, next ) => {
                    if( next[ 'monthly_fee' ] ){
                      prev[ 'total' ] += +next[ 'monthly_fee' ]
                    }
                    return prev
                  }, { total: 0 } )['total']
                ) 
              }
              </span>
            </p>
          </div>
          <div className="modal-footer" style={{ marginTop: '-35px' }} >
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn red-soft"
              onClick={ onSubmit }
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

AdditionalLicenseModal.propTypes = {
  accountActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
}

export default AdditionalLicenseModal