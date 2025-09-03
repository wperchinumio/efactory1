import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LoadingButton from '../../_Shared/Components/ButtonLoading'

const TabsBar = props => {
  function handleButton1 () {
    let { reviewActions, entryPageType } = props
    let { saveOrderAsDraft, updateEntry } = reviewActions
    switch( entryPageType ){
      case 'create_new':
        return saveOrderAsDraft()
      case 'edit_order':
        return updateEntry({ fromDraft : false })
      case 'edit_template':
      case 'edit_draft':
        return updateEntry({ fromDraft : true })
      default:
    }
  }

  function handleButton2 () {
    let { 
      reviewActions, 
      showOrderSuccessModal, 
      createNewOrder 
    } = props
    let { saveEntry } = reviewActions
    saveEntry().then(
      ({ isSuccess, message, order_number }) => {
        if( isSuccess ) {
          showOrderSuccessModal(order_number)
          createNewOrder()
        }
      }
    )
  }

  let { entryPageType } = props
  let button1 = '', button2 = ''
  switch( entryPageType ){
    case 'create_new':
      button1 = 'SAVE DRAFT'
      button2 = 'PLACE ORDER'
      break
    case 'edit_order':
      button1 = 'UPDATE ORDER'
      break
    case 'edit_template':
      button1 = 'UPDATE TEMPLATE'
      break
    case 'edit_draft':
      button1 = 'UPDATE DRAFT'
      button2 = 'PLACE ORDER'
      break
    default:
  }
  let { dirty, loading, loadingPlaceOrder } = props
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i> 
            { ' ' }
            <span className="sbold">
              ORDERPOINTS
            </span> 
            { ' ' }
            {
              entryPageType ==='edit_template' 
              ? '- EDIT TEMPLATE'
              : '- ORDER ENTRY'
            }
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          onClick={ event => {
            if ( dirty ){
              global.$('#confirm-goto-order').modal('show')
            } else{
              props.createNewOrder()
            }
          }}
          type="button"
        >
          <i className="fa fa-file-o"></i>
          NEW ORDER
        </button>
        <span style={{ display: "inline-block", padding: "0 3px" }}>|</span>
        <LoadingButton
          className="btn btn-topbar btn-sm"
          iconClassNames="fa fa-save"
          disabled={!dirty}
          handleClick={handleButton1}
          name={button1}
          loading={loading}
        />
        {' '}
        {
          button2 &&
          <LoadingButton
            className="btn btn-topbar btn-sm"
            iconClassNames="fa fa-cloud-upload"
            disabled={ !dirty && entryPageType !== 'edit_draft' }
            handleClick={handleButton2}
            name={ 'PLACE ORDER' }
            loading={ loadingPlaceOrder }
          />
        }
      </div>
    </div>
  )
}

TabsBar.propTypes = {
  reviewActions: PropTypes.object.isRequired,
  dirty: PropTypes.bool.isRequired,
  showOrderSuccessModal: PropTypes.func.isRequired
}

export default connect(
  state => ({
    entryPageType: state.orderPoints.entry.entryPageType,
    settings: state.orderPoints.settings,
    dirty: state.orderPoints.entry.dirty,
    loading: state.orderPoints.entry.loading,
    loadingPlaceOrder: state.orderPoints.entry.loadingPlaceOrder
  })
)(TabsBar)