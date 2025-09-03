import React, { useRef, useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import * as globalApiActions from '../../../Settings/redux/global'
import BlockUi from '../../../_Shared/Components/BlockPageContent'
import { ToastContainer, ToastMessage } from 'react-toastr'
import ChangeMyPasswordModal from '../../../Services/Accounts/Modals/ChangeMyPassword'

const PageContent = props => {
  const firstRun = useRef([true, true])
  const toasterNode = useRef(null)
  const ToastMessageFactory = useRef(React.createFactory(ToastMessage.animation))
  const [spinnerVisible, setSpinnerVisible] = useState(false)

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      let { isSuccessToaster, toasterMessage, isNoTimeout } = props.globalApi
      if (isSuccessToaster) {        
        toasterMessage =  toasterMessage && typeof toasterMessage === 'string' && toasterMessage.includes('</') 
                          ? <div 
                            dangerouslySetInnerHTML={{ __html : toasterMessage }}
                          />
                          : toasterMessage

        toasterNode.current.success(toasterMessage, '', { timeOut : 1500, extendedTimeOut : 1000, closeButton : true })
      } else {
        toasterMessage =  toasterMessage && typeof toasterMessage === 'string' && toasterMessage.includes('</') 
                          ? <div 
                            dangerouslySetInnerHTML={{ __html : toasterMessage }}
                          />
                          : toasterMessage
        let timeOutObject = { timeOut : 5000, extendedTimeOut : 2000, closeButton : true } 

        if (isNoTimeout) {
          props.globalApiActions.setRootReduxStateProp_multiple({
            isNoTimeout : false
          })
          timeOutObject = { timeOut : 0, extendedTimeOut : 0, closeButton : true }
        }
        
        toasterNode.current.error( 
          toasterMessage, 
          '', 
          timeOutObject
        )
      }
    },
    [props.globalApi.toasterIndex]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.globalApi.spinnerIndex > 0) {
        if (!spinnerVisible) {
          setSpinnerVisible(true)
        }
      }else if (props.globalApi.spinnerIndex === 0 ) {
        if (spinnerVisible) {
          setSpinnerVisible(false)
        }
      }else if (props.globalApi.spinnerIndex < 0) {
        console.error('spinnerIndex can t be below 0, please check what you are doing wrong')
      }
    },
    [props.globalApi.spinnerIndex]
  )

  let { location, children, notFoundStyleFix } = props
  const { pathname, search } = location
  return (
    <div id="pageContentRR">
      <div className="page-content-wrapper">
        <div
          className={ classNames({
            'page-content' : true,
            'hack-class' : pathname.includes('overview/notes'),
            'notFoundFix' : notFoundStyleFix === 'true' || pathname.includes('services/team-members') ,
            'bg-fix' : pathname === '/overview',
            'table-settings-rr' : pathname.includes('tablesettings'),
            'fulfilment-table-pages' : (pathname.includes('orders')
              || ( pathname.includes('analytics/') && !pathname.includes('scheduler') )
              || pathname.includes('/order-lines/')
              || pathname.includes('/order-items/')
              || pathname.includes('/edi/documents')
              || pathname.includes('/edi/trading-partners')
              || pathname.includes('inventory')
              || pathname.includes('/detail/')
              || pathname.includes('/summary/')
              || ( pathname.includes('/special-settings') && search.includes("?orderNum=") )
              || ( pathname.includes('/special-settings') && search.includes("?rmaNum=") )
              || ( pathname.includes('/special-settings') && search.includes("?itemNum=") )
              || pathname.includes('returntrak/rmas/all')
              || pathname.includes('returntrak/rmas/open')
              || pathname.includes('returntrak/rmas/items')
              || pathname.includes('transportation/packages/shipping-detail')
              || pathname.includes('invoices/all')
              || pathname.includes('invoices/freight-charges')
              || pathname.includes('invoices/rate-cards')
              || search.includes('?tradingPartner=')
            ) && !pathname.includes('inventory/receipt')
              
          }) }
        >
          { children }
          <BlockUi loading={spinnerVisible} />
          <div className="clearfix"></div>
          <ToastContainer
            ref={toasterNode}
            toastMessageFactory={ToastMessageFactory.current}
            className="toast-bottom-right"
          />
        </div>
      </div>
      <ChangeMyPasswordModal />
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      globalApi: state.common.globalApi
    }),
    dispatch => ({
      globalApiActions: bindActionCreators( globalApiActions, dispatch )
    })
  )(PageContent)
)