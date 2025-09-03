import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { isNullOrEmpty } from '../../../../_Shared/Functions'
import EditShippingModal from './EditShippingModal'

const Shipping = props => {
  const firstRun = useRef(true)
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.entryPageType !== 'edit_order') {
        let { shippingSettingsData, reviewActions, orderHeader } = props
        let whichShipping = props.shippingAddress.country === 'US' 
            ? shippingSettingsData.domestic 
            : shippingSettingsData.international
        let {
          carrier : shipping_carrier,
          service : shipping_service,
          packing_list_type,
          freight_account,
          consignee_number,
          terms,
          int_code : international_code,
          comments = ''
        } = whichShipping || {}
        // update shipping
        comments = comments ? String( comments ) : ''
        reviewActions.setRootReduxStateProp_multiple({
          shipping : {
            shipping_carrier,
            shipping_service,
            packing_list_type,
            freight_account,
            consignee_number,
            terms,
            international_code
          },
          orderHeader : {
            ...orderHeader,
            packing_list_comments: comments.trim().length > 0 ? comments : orderHeader.packing_list_comments
          },
          dirty : true
        })
      }
    },
    [props.shippingAddress.country]
  )

  let {
    shippingAddress,
    shipping,
    shippingSettingsData,
    reviewActions
  } = props

  let { country = '' } = shippingAddress
  let isDomestic =  country.toUpperCase() === 'US' ||
                    country.toUpperCase() === 'USA' ||
                    country.toUpperCase() === 'UNITED STATES' ||
                    country.toUpperCase() === 'UNITED_STATES'

  let defaults
  if (isDomestic) {
    defaults = shippingSettingsData['domestic'] || {}
  } else {
    defaults = shippingSettingsData['international'] || {}
  }

  let {
    shipping_carrier = '',
    shipping_service = '',
    freight_account = '',
    consignee_number = '',
    packing_list_type = '',
    terms = '',
    fob = '',
    payment_type = '',
    international_code = ''
  } = shipping

  return (
    <div className="op-review-sidebar">
      <EditShippingModal 
        reviewActions={ reviewActions }
      />
      <div className="addr-type"><i className="fa fa-location-arrow"></i> Shipping
        <div className="pull-right">
          <a
            href="#op-edit-shipping"
            data-toggle="modal"
            className="addr-edit"
            tabIndex="-1"
          >
            <i className="fa fa-edit"></i> Edit...
          </a>
        </div>
      </div>
      <div className="section">
        <table style={{width: "100%"}}>
          <tbody>
            <tr>
              <td className="label2">International Code:</td>
              <td className="text-right">
                <span 
                  className={ classNames({
                    'input-no-default' : +defaults.int_code !== +international_code
                  })}
                >
                  { international_code }
                </span>
              </td>
            </tr>
            <tr>
              <td 
                className={classNames({
                  'label2': true,
                  'label-req' : isNullOrEmpty(shipping_carrier)
                })}
              >
                Shipping Carrier:
              </td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default' :  defaults.carrier !== shipping_carrier ||
                                        defaults.service !== shipping_service
                })}

              >{ shipping_carrier }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req' : isNullOrEmpty(shipping_service)
              })}>Shipping Service:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default' :  defaults.carrier !== shipping_carrier ||
                                        defaults.service !== shipping_service
                })}

              >{ shipping_service }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req' : isNullOrEmpty(freight_account)
              })}>Freight Account:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default' :  defaults.freight_account !== freight_account
                })}
              >{ freight_account }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req' : isNullOrEmpty(consignee_number) && freight_account === '00000'
              })}>Consignee #:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default' :  defaults.consignee_number !== consignee_number
                })}
              >{ consignee_number }</span></td>
            </tr>
            <tr>
              <td className="label2">Incoterms:</td>
              <td className="text-right"><span className={classNames({
                'input-no-default' :  defaults.terms !== terms
              })}
              >{ terms }</span></td>
            </tr>
            <tr>
              <td className="label2">FOB Location:</td>
              <td className="text-right"><span>{ fob }</span></td>
            </tr>
            <tr>
              <td className="label2">Payment Type:</td>
              <td className="text-right"><span>{ payment_type }</span></td>
            </tr>
            <tr>
              <td className="label2">Packing List:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default' :
                    (
                      (
                        (defaults.packing_list_type ? defaults.packing_list_type : '0')
                        !==
                        (packing_list_type ? packing_list_type : '0')
                      )
                    )
                })}
              >{ packing_list_type }</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

Shipping.propTypes = {
  name: PropTypes.string,
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    shippingSettingsData: state.orderPoints.settings.opSettingsData.shipping,
    shippingAddress: state.orderPoints.entry.shippingAddress,
    entryPageType: state.orderPoints.entry.entryPageType,
    shipping: state.orderPoints.entry.shipping,
    orderHeader: state.orderPoints.entry.orderHeader
  })
)(Shipping)