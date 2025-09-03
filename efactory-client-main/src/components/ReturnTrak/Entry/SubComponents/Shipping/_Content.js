import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import EditShippingModal from '../../Modals/EditShipping'
import getDeepProperty from '../../../../_Helpers/getDeepProperty'
import { isNullOrEmpty } from '../../../../_Shared/Functions'

const ShippingMain = props => {
  const firstRun = useRef([true, true])
  
  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.newRmaClicked) {
        initializeComponent()
      }
    },
    [props.newRmaClicked]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.entryPageType === 'new_rma') {
        initializeComponent()
      }
    },
    [props.rmaSettingsData]
  )

  /*
    this method is needed to reinitialize when 'new order'
    button is clicked
  */
  function initializeComponent () {
    let isDomestic = [ 'US', 'USA', 'UNITED STATES', 'UNITED_STATES' ].includes(props.shipping_address.country)
    let { setShippingValues, setOthersValue } = props.rmaEntryActions
      // since as default the country is US we fill domestic data
    let fields
    if( isDomestic ){
      fields = props.rmaSettingsData.general.shipping.domestic
    }else{
      fields = props.rmaSettingsData.general.shipping.international
    }
    setShippingValues({
      ...fields,
      shipping_carrier: fields.carrier,
      shipping_service: fields.service
    })
    setOthersValue({ field: 'comments', value: fields.comments })
  }

  let {
    rmaEntryActions,
    rmaSettingsData,
    shipping,
    shipping_address
  } = props
  let { country = '' } = shipping_address
  country = country.toUpperCase()
  let isDomestic = [ 'US', 'USA', 'UNITED STATES', 'UNITED_STATES' ].includes(country)
  let defaults
  if( isDomestic ){
    defaults = getDeepProperty(rmaSettingsData, ['general','shipping', 'domestic'], {})
    defaults = {
      ...defaults,
      shipping_carrier: defaults.carrier,
      shipping_service: defaults.service,
      terms: defaults.terms
    }
  }else {
    defaults = getDeepProperty(rmaSettingsData, ['general','shipping', 'international'], {})
    defaults = {
      ...defaults,
      shipping_carrier: defaults.carrier,
      shipping_service: defaults.service,
      terms: defaults.terms
    }
  }
  let {
    shipping_carrier,
    shipping_service,
    packing_list_type,
    freight_account,
    consignee_number,
    int_code,
    terms,
    // these two values are not coming from settings
    fob,
    payment_type
  } = shipping
  return (
    <div className="op-review-sidebar">
      <div className="addr-type"><i className="fa fa-location-arrow"></i> Shipping
        <div className="pull-right">
          <a
            href="#rma-edit-shipping"
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
              <td className="text-right"><span className={classNames({
                'input-no-default': +defaults.int_code !== +int_code
              })}
              >{ int_code }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req': isNullOrEmpty(shipping_carrier)
              })}
              >Shipping Carrier:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default':  defaults.carrier !== shipping_carrier ||
                                        defaults.service !== shipping_service
                })}

              >{ shipping_carrier }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req': isNullOrEmpty(shipping_service)
              })}
              >Shipping Service:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default':  defaults.carrier !== shipping_carrier ||
                                        defaults.service !== shipping_service
                })}

              >{ shipping_service }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req': isNullOrEmpty(freight_account)
              })}
              >Freight Account:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default':  defaults.freight_account !== freight_account
                })}
              >{ freight_account }</span></td>
            </tr>
            <tr>
              <td className={classNames({
                'label2': true,
                'label-req': isNullOrEmpty(consignee_number) && freight_account === '00000'
              })}>Consignee #:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default':  defaults.consignee_number !== consignee_number
                })}
              >{ consignee_number }</span></td>
            </tr>
            <tr>
              <td className="label2">Incoterms:</td>
              <td className="text-right"><span className={classNames({
                'input-no-default':  defaults.terms !== terms
              })}
              >{ terms }</span></td>
            </tr>
            <tr>
              <td className="label2">FOB Location:</td>
              <td className="text-right"><span>{ fob }</span></td>
            </tr>
            <tr>
              <td className="label2">Payment Type:</td>
              <td className="text-right"><span> { payment_type } </span></td>
            </tr>
            <tr>
              <td className="label2">Packing List:</td>
              <td className="text-right"><span
                className={classNames({
                  'input-no-default':
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
      <EditShippingModal rmaEntryActions={rmaEntryActions} />
    </div>
  )
}

ShippingMain.propTypes = {
  rmaEntryActions: PropTypes.object,
  rmaSettingsData: PropTypes.shape({
    general: PropTypes.shape({
      auto_number: PropTypes.shape({
        manual: PropTypes.any,
        prefix: PropTypes.any,
        suffix: PropTypes.any,
        starting_number: PropTypes.any,
        minimum_number_of_digits: PropTypes.any
      }),
      expiration_days: PropTypes.any,
      shipping: PropTypes.shape({
        domestic: PropTypes.shape({
          carrier: PropTypes.any,
          service: PropTypes.any,
          packing_list_type: PropTypes.any,
          freight_account: PropTypes.any,
          consignee_number: PropTypes.any,
          comments: PropTypes.any,
          int_code: PropTypes.any,
          terms: PropTypes.any
        }),
        international: PropTypes.shape({
          carrier: PropTypes.any,
          service: PropTypes.any,
          packing_list_type: PropTypes.any,
          freight_account: PropTypes.any,
          consignee_number: PropTypes.any,
          comments: PropTypes.any,
          int_code: PropTypes.any,
          terms: PropTypes.any
        })
      })
    }),
    custom_fields: PropTypes.array, // detailed on Options component
    rma_types: PropTypes.arrayOf( PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }) ),
    dispositions: PropTypes.arrayOf( PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }) )
  }),
  rmaSettingsActions: PropTypes.object
}

export default connect(
  state => ({
    newRmaClicked : state.returnTrak.entry.newRmaClicked,
    rmaSettingsData : state.returnTrak.settings.rmaSettingsData,
    shipping : state.returnTrak.entry.shipping,
    shipping_address : state.returnTrak.entry.shipping_address,
    entryPageType : state.returnTrak.entry.entryPageType
  })
)(ShippingMain)