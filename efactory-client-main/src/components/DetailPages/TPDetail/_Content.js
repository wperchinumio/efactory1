import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TPDetailBar from './Bar'
import TPDetailBody from './Body'
import * as invoiceActions from '../../Invoices/Open/redux'

const TPDetailContent = ({
  fetchTPDetailData,
  invoiceActions,
  location: { search },
  onCloseModalClicked,
  tpDetail,
}) => {
  useEffect(
    () => {
      window.scrollTo(0,0)
      fetchTPDetail()
    },
    []
  )

  function getTradingPartner () {
    return decodeURIComponent( search.replace('?tradingPartner=','') )
  }

  function fetchTPDetail () {
    const trading_partner = getTradingPartner()
    invoiceActions.fetchTPDetail( trading_partner )
  }

  const trading_partner = getTradingPartner()
  
  return (
    <div className="fade-in-up">
      <div className="order-body" style={{ marginBottom : '20px' }}>
        <div className="portlet light">
          
          <TPDetailBar 
            fetchTPDetail={fetchTPDetail}
            trading_partner={trading_partner}
            tpDetail={tpDetail}
            onCloseModalClicked={onCloseModalClicked}
            invoiceActions={ invoiceActions }
          />

          <TPDetailBody 
            fetchTPDetail={fetchTPDetail}
            trading_partner={trading_partner}
            fetchTPDetailData={fetchTPDetailData}
            tpDetail={tpDetail}
            invoiceActions={ invoiceActions }
          />
        </div>
      </div>
    </div>
  );
}


TPDetailContent.propTypes = {
  item_number_received: PropTypes.string,
  onCloseModalClicked: PropTypes.func
}

export default withRouter(
  connect(
    state => ({
      tpDetail : state.invoices.open.tpDetail
    }),
    dispatch => ({
      invoiceActions      : bindActionCreators( invoiceActions, dispatch )
    })
  )(TPDetailContent)
)