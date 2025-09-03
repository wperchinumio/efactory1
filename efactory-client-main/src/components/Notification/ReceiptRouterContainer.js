import React, { useRef, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as shipNotificationActions from './ShipConfirmation/redux'
import ButtonLoading from '../_Shared/Components/ButtonLoading'

const ReceiptRouterContainer = props => {
  const indexBeingEdited = useRef(null)
  let { pathname = '' } = props.location
  const receipt_email_type = determineReceiptEmailType()
  
  useEffect(
    () => {
      props.shipNotificationActions.readReceiptEmail({ receipt_email_type })
    },
    [pathname]
  )

  function determineReceiptEmailType (){
    switch (true) {
      case pathname.includes('email-notifications/order-receipt'):
        return 'ACK'
      case pathname.includes('email-notifications/po-receipt'):
        return 'OC'
      case pathname.includes('email-notifications/rma-receipt'):
        return 'OM'
      case pathname.includes('email-notifications/unplanned-receipt'):
        return 'OU'
      default:
        break;
    }   
  }

  function determinePageSubTitle (pathname) {
    switch (true) {
      case pathname.includes('email-notifications/order-receipt'):
        return 'Order Receipt'
      case pathname.includes('email-notifications/po-receipt'):
        return 'PO Receipt'
      case pathname.includes('email-notifications/rma-receipt'):
        return 'RMA Receipt'
      case pathname.includes('email-notifications/unplanned-receipt'):
        return 'Unplanned Receipt'
      default:
        return ''
    }
  }

  function determinePageParagraph (pathname) {

    switch (true) {
      case pathname.includes('email-notifications/order-receipt'):
        return <p> 
          DCL receives Fulfillment order information through various channels; RESTful API, SOAP API, e-Commerce platform connectors, XML files, EDI, Mass Upload, OrderPoints, ReturnTrak etc. For the channels where the order information is transferred with an automated interface, although an automated Acknowledgement is provided, many customers also request Acknowledgement via email for their Operations staff. These emails are generated upon receipt of orders into DCL system and the customer can set up email group / addresses per account number here and control it as appropriate. The address field allows multiple email addresses separated with semicolon. No email is sent if the address field is left blank.
          <br/><br/>
          Currently the XML files transferred via FTP process do not use this system for email notification.
          <br/><br/><b>Note: </b>Be aware that these emails can generate lots of email traffic!
        </p>
      case pathname.includes('email-notifications/po-receipt'):
        return <p> 
          The materials to be received at DCL are advised by the customer via the PO Notification (ASN). DCL updates the inventory system upon receipt of material and eFactory provides and maintains all the details. Customers can also receive an Email Notification at the end of receiving day for all the material receipts of the day. 
          Please set up the email address here to receive this PO Receipts email. Multiple email addresses with the semicolon separator can be set up, however, a group email address from the customer system is a better way to receive this email for a group of people
        </p>
      case pathname.includes('email-notifications/rma-receipt'):
        return <p> 
          Upon receipt of material for an RMA, DCL updates the inventory system and eFactory provides and maintains all the details. Customers can also receive an Email Notification at the end of transaction day for all the receipts of the day. 
          Please set up the email address here to receive this RMA Receipts email. Multiple email addresses with the semicolon separator can be set up, however, a group email address from the customer system is a better way to receive this email for a group of people.
          <br/><br/><b>Note: </b>Be aware that these emails can generate lots of email traffic!
        </p>
      case pathname.includes('email-notifications/unplanned-receipt'):
        return <p> 
          Upon un-planned return of material or return of an undeliverable order, DCL updates the inventory system and eFactory provides and maintains all the details. Customers can also receive an Email Notification at the end of transaction day for all such receipts of the day. 
          Please set up the email address here to receive this Un-planned Receipts email. Multiple email addresses with the semicolon separator can be set up, however, a group email address from the customer system is a better way to receive this email for a group of people.
        </p>
      default:
        return ''
    }
  }

  function onEditClicked (event) {
    event.preventDefault()
    let index = event.currentTarget.getAttribute('data-index')
    indexBeingEdited.current = index
    let { shipNotificationState, shipNotificationActions } = props
    let { receipt_accounts = [] } = shipNotificationState
    let receipt_account_being_edited = { ...receipt_accounts[ index ] }

    shipNotificationActions.setRootReduxStateProp_multiple({ receipt_account_being_edited})
    .then(() => global.$('#edit-email-modal').modal('show'))
  }

  function onEditModalFormValueChanged (event) {
    let field = event.currentTarget.getAttribute('data-field')
    let { value } = event.currentTarget
    let { shipNotificationState, shipNotificationActions } = props
    let { receipt_account_being_edited } = shipNotificationState
    receipt_account_being_edited = { 
      ...receipt_account_being_edited,
      [field]: value
    }
    shipNotificationActions.setRootReduxStateProp_multiple({ receipt_account_being_edited })
  }

  function onSaveChangesClicked () {
    let { shipNotificationState, shipNotificationActions } = props
    let { receipt_account_being_edited, receipt_accounts } = shipNotificationState
    
    shipNotificationActions.updateReceiptEmail({ type : receipt_email_type }).then(
      () => {
        let index = indexBeingEdited.current
        receipt_accounts = [
          ...receipt_accounts.slice( 0, index ),
          { ...receipt_account_being_edited },
          ...receipt_accounts.slice( +index + 1 ),
        ]

        shipNotificationActions.setRootReduxStateProp_multiple({ receipt_accounts })
        .then( () => global.$('#edit-email-modal').modal('hide') )
      }
    ).catch( () => {} )
  }

  function onFormSubmitted (event) {
    event.preventDefault()
    onSaveChangesClicked()
  }

  let {
    receipt_accounts = [],
    updatingAccountEmail,
    receipt_account_being_edited
  } = props.shipNotificationState
  let { email } = receipt_account_being_edited
  return (
    <div>
      <div className="page-bar orderpoints-page-bar page-bar-fixed">
        <div className="page-breadcrumb">
          <div className="caption" style={{paddingLeft: "20px"}}>
              <span className="caption-subject font-green-seagreen">
                <i className="fa fa-cog"></i>
                { ' ' }
                <span className="sbold">EMAIL NOTIFICATIONS</span>
                { ' ' } - { determinePageSubTitle( pathname ) }
                </span>
          </div>
        </div>
      </div>
      <div className="container-page-bar-fixed">
          <div className="col-md-10">
            { determinePageParagraph(pathname) }
            <div className="table-responsive col-lg-8 col-md-12">
              <table className="table table-striped table-hover rma-type order-column table-clickable documents-table">
                <colgroup>
                  <col style={{ width : '30px' }}/>
                  <col style={{ width : '100px' }}/>
                  <col style={{ width : '100px' }}/>
                  <col />
                  <col style={{ width : '80px' }}/>
                  <col style={{ width : '100px' }}/>
                </colgroup>
                <thead>
                  <tr className="uppercase table-header-1">
                    <th className="font-grey-salt">#</th>
                    <th className="font-grey-salt">Account #</th>
                    <th className="font-grey-salt text-center">Warehouse</th>
                    <th className="font-grey-salt">Email</th>
                    <th className="font-grey-salt text-center" style={{width: 180}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    receipt_accounts.map(
                      ({
                        account_number,
                        email,
                        location,
                        type
                      }, index) => {
                        return (
                          <tr key={ `receipt-acc${index}` }>
                            <td>
                              { index + 1 }
                            </td>
                            <td className="text-primary">
                              { account_number }
                            </td>
                            <td className="text-center">
                              { location }
                            </td>
                            <td>
                              { email }
                            </td>
                            <td className="text-center">
                              <a 
                                className="btn green-soft btn-xs"
                                data-index={ index }
                                type="button" 
                                onClick={ onEditClicked }
                              >
                                <i className="fa fa-edit" />Edit...
                              </a>
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
      <div 
        className="modal modal-themed fade"
        data-backdrop="static"
        id="edit-email-modal" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 className="modal-title">Edit</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" onSubmit={ onFormSubmitted }>
              <div className="form-body">

                <div className="form-group">
                  <label>Email address:</label>
                  <input
                    type="text"
                    value={ email ? email : '' }
                    data-field="email"
                    onChange={ onEditModalFormValueChanged }
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
            Close
            </button>
            { ' ' }
            <ButtonLoading
              className="btn green-soft"
              type="button"
              handleClick={ onSaveChangesClicked }
              name={'Save Changes'}
              loading={ updatingAccountEmail }
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    shipNotificationState : state.shipNotification,
  }),
  dispatch => ({
    shipNotificationActions : bindActionCreators(shipNotificationActions, dispatch)
  })
)(ReceiptRouterContainer)