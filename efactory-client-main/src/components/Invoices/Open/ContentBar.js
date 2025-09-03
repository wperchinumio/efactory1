import React from 'react'
import PropTypes from 'prop-types'
import PaySelectedModal from './PaySelectedModal'

const ContentBar = ({
  invoiceActions
}) => {
  return (
    <div className="portlet-title">
      <div className="caption caption-md font-dark">
        <span className="caption-subject">
          Please review and select the invoices you would like to pay.
        </span>
      </div>
      <span className="pull-right" style={{paddingTop:"10px"}}>
        <span style={{ padding: "5px 10px", border: "1px solid #999", backgroundColor: "#fff0d4", fontWeight: 600}}>
          Yellow lines
        </span> indicate recent payment yet to be processed by DCL accounting.
      </span>
      <PaySelectedModal
        invoiceActions={invoiceActions}
      />
    </div>
  )
}

ContentBar.propTypes = {
  invoiceActions: PropTypes.object.isRequired,
}

export default ContentBar