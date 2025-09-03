import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import history from '../../../history'

const TPDetailBar = ({
  fetchTPDetail,
  invoiceActions,
  location: { pathname },
  onCloseModalClicked,
  tpDetail = {},
  trading_partner,
}) => {
  function reload (event) {
    event.preventDefault()
    fetchTPDetail()
  }

  function print () {
    global.window.print()
  }

  function closeModal () {
    invoiceActions.setRootReduxStateProp({
      field: 'itemDetail',
      value: {}
    })    
    invoiceActions.setRootReduxStateProp({
      field : 'navigationHidden',
      value : false
    })
    if ( onCloseModalClicked ) {
      return onCloseModalClicked()
    }
    history.push(`${pathname.startsWith('/') ? pathname : '/' + pathname }`)
  }

  let { tp_setup = {} } = tpDetail

  tp_setup = tp_setup ? tp_setup : {}

  return (
    <div className="portlet-title" data-refresh-on="refresh-ui" >
      <div className="pull-left actions hidden-print" style={{ marginRight : '20px' }}>
        <a style={{ textDecoration:" none",color:" white",display:'block'}}>
          <button
            className="btn btn-transparent red btn-circle btn-sm"
            onClick={ closeModal }
          >
            Close
          </button>
        </a>
      </div>
      <div className="caption">
        <span className="caption-subject font-green-seagreen sbold" style={{display: 'inline-block', verticalAlign: 'top', paddingRight: "10px", textAlign: "right", minHeight: "43px"}}>
          TRADING PARTNER:
          <br/>
          <small style={{paddingTop: "5px", display: "inline-block", marginTop: "2px"}}>{(tpDetail.noResponse || !tp_setup.partner_code) ? '': 'VENDOR #:'}</small>
        </span>
        <span className="caption-subject font-gray sbold" style={{display: 'inline-block', paddingRight: "30px"}}>
          {' '}{ tpDetail.noResponse ? 'TRADING PARTNER NOT FOUND' : (tp_setup.partner_code? tp_setup.partner_name + ' - ' + tp_setup.partner_code: trading_partner) }
          <br/>{' '}<span style={{fontSize: "13px", marginTop: "6px", display:'inline-block', color: "#888"}}>{ tpDetail.noResponse ? '': tp_setup.vendor_number}</span>
        </span>
      </div>
      <span className="noselect">&nbsp;</span>
      <div className="actions hidden-print">
        <a
          className="btn btn-circle btn-icon-only btn-dashboard tooltips "
          onClick={ print }
        >
          <i className="icon-printer"></i>
        </a>
        { ' ' }
        <a
          className="btn btn-circle btn-icon-only btn-dashboard tooltips"
          onClick={reload}
        >
          <i className="icon-reload"></i>
        </a>
        { ' ' }
        <a className="btn btn-circle btn-icon-only btn-dashboard fullscreen " href="#">
        </a>
      </div>
    </div>
  )
}

TPDetailBar.propTypes = {
  fetchTPDetail     : PropTypes.func, // reload
  trading_partner   : PropTypes.string,
  invoiceActions    : PropTypes.object.isRequired,
  tpDetail          : PropTypes.shape({
    tp_setup          : PropTypes.shape({
      partner_name         : PropTypes.string,
      partner_code         : PropTypes.string,
      vendor_number        : PropTypes.string,
      account_number       : PropTypes.string,
      connectivity         : PropTypes.string,
      sender_qual          : PropTypes.string,
      sender_code          : PropTypes.string,
      receiver_qual        : PropTypes.string,
      receiver_code        : PropTypes.string,
      edi_ver              : PropTypes.string,
      terms_description    : PropTypes.string,
      remit_to_code        : PropTypes.string,
      remit_to_name        : PropTypes.string,
      remit_to_add1        : PropTypes.string,
      remit_to_add2        : PropTypes.string,
      remit_to_city        : PropTypes.string,
      remit_to_state       : PropTypes.string,
      remit_to_zip         : PropTypes.string,
      remit_to_country     : PropTypes.string,
      remit_to_contact     : PropTypes.string,
      remit_to_phone       : PropTypes.string,
      remit_to_email       : PropTypes.string,
      required_documents   : PropTypes.array,
      optional_documents   : PropTypes.array
    })
  }),
  onCloseModalClicked : PropTypes.any
}

export default withRouter(TPDetailBar)