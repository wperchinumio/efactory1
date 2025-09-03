import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import history from '../../../history'
import PageBar from './Bar'
import * as draftActions from './redux'
import * as reviewActions from '../OrderEntry/redux'
import DraftsContentBar from './ContentBar'
import formatOrderId from '../../_Helpers/FormatOrderId'
import OrderDetails from '../../DetailPages/OrderDetail/_Content'

const DraftsMain = props => {
  useEffect(
    () => {
      props.draftActions.fetchDrafts()
    },
    []
  )

  function getDraftsAfterFilter () {
    let { filterInput, allDrafts } = props
    filterInput = filterInput.trim().toLowerCase()
    if (!filterInput) {
      return allDrafts
    }
    allDrafts = allDrafts.filter( aDraft => {
      let {
        order_id = '',
        order_number = '',
        po_number = '',
        account_number = '',
        location = '',
        is_template = '',
        shipping_address = {}
      } = aDraft
      order_id = formatOrderId( order_id, is_template )
      let {
        company = '',
        attention = '',
        address1 = '',
        address2 = '',
        email = '',
        phone = '',
        city = '',
        state_province = '',
        postal_code = '',
        country = ''
      } = shipping_address
      switch ( true ) {
        case String(order_id).toLowerCase().includes(filterInput):
        case String(order_number).toLowerCase().includes(filterInput):
        case String(po_number).toLowerCase().includes(filterInput):
        case String(account_number).toLowerCase().includes(filterInput):
        case String(location).toLowerCase().includes(filterInput):
        case String(company).toLowerCase().includes(filterInput):
        case String(attention).toLowerCase().includes(filterInput):
        case String(address1).toLowerCase().includes(filterInput):
        case String(address2).toLowerCase().includes(filterInput):
        case String(email).toLowerCase().includes(filterInput):
        case String(phone).toLowerCase().includes(filterInput):
        case String(city).toLowerCase().includes(filterInput):
        case String(state_province).toLowerCase().includes(filterInput):
        case String(postal_code).toLowerCase().includes(filterInput):
        case String(country).toLowerCase().includes(filterInput):
          return true

        default:
          return false
      }
    } )
    return allDrafts
  }

  function cloneTemplate () {
    props.reviewActions.cloneTemplateToDraft().then( ({ isSuccess } = {} ) => {
      if (isSuccess ){
        history.push('/orderpoints')
      }else{
        console.error('An error occurred on template')
      }
    })
  }

  function editDisabled () {
    let { selectedDraftRows = {} } = props
    let selectedRowId = Object.keys(selectedDraftRows)[0]
    let isTemplate = false
    let { allDrafts } = props
    for (var i = 0; i < allDrafts.length; i++) {
      if(allDrafts[i].order_id === +selectedRowId)
        isTemplate = allDrafts[i].is_template
    }
    return Object.keys(selectedDraftRows).length !== 1 || !isTemplate
  }
  
  let { 
    selectedDraftRows, 
    loadedDrafts, 
    reviewActions, 
    location,
    draftActions
  } = props

  let { 
    setSelectedDraftRowsAll, 
    setSelectedDraftRows, 
    deleteDrafts, 
    toggleTemplate 
  } = draftActions

  let { updateTemplate } = reviewActions

  let allDrafts = getDraftsAfterFilter()

  let allChecked =  allDrafts 
                    ? ( allDrafts.length && ( allDrafts.length === Object.keys(selectedDraftRows).length ) ) 
                    : false

  let isOrderDetailDisplay  = false

  if (location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  return (
    <div>
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
        <PageBar />
        <div className="container-page-bar-fixed">
          <div className="portlet light bordered">
            <DraftsContentBar
              onDeleteClicked={deleteDrafts}
              onToggleClicked={toggleTemplate}
              onEditClicked={updateTemplate}
              reviewActions={reviewActions}
              allDraftsNumber={allDrafts.filter((x) => x.is_template === false).length}
              allTemplatesNumber={allDrafts.filter((x) => x.is_template === true).length}
              deleteDisabled={Object.keys(selectedDraftRows).length === 0}
              toggleDisabled={Object.keys(selectedDraftRows).length !== 1}
              editDisabled={editDisabled()}
              draftActions={draftActions}
            />
            <div className="portlet-body">
              {
                loadedDrafts && allDrafts.length === 0 &&

                <div className="container-page-bar-fixed all-tasks">
                  <h3 className="font-red-soft">Sorry! You don't have any draft available at this time.</h3>
                </div>
              }
              {
                loadedDrafts && allDrafts.length !== 0 &&
                <div className="table-responsive">
                  <table className="table table-striped table-hover order-column row-sortable table-clickable">
                    <thead>
                      <tr className="uppercase table-header-1">
                        <th className="font-grey-salt" >
                          <label className="mt-checkbox mt-checkbox-outline">
                            <input
                              type="checkbox"
                              checked={ allChecked }
                              onChange={ event => setSelectedDraftRowsAll( !allChecked ) }/>
                              <span></span>
                          </label>
                        </th>
                        <th> # </th>
                        <th> Draft # </th>
                        <th> Order # </th>
                        <th> Account # </th>
                        <th> Warehouse </th>
                        <th> PO # </th>
                        <th> Ship To </th>
                      </tr>
                    </thead>
                    <tbody className="ui-sortable">
                      { allDrafts.map( ( aDraft, index ) => {
                        let isDraftSelected = selectedDraftRows.hasOwnProperty( aDraft.order_id )
                        return (
                          <tr
                            className="odd gradeX clickable-row ui-sortable-handle"
                            key={`draft-${index}`}
                          >
                            <td>
                              <label className="mt-checkbox mt-checkbox-outline">
                                <input
                                  type="checkbox"
                                  checked={ isDraftSelected }
                                  onChange={ event => setSelectedDraftRows( aDraft.order_id ) }/>
                                <span></span>
                              </label>
                            </td>
                            <td>{ index+1 }</td>
                            <td>
                              <a
                                onClick={ event => {
                                  event.preventDefault()
                                  if (!aDraft.is_template ){
                                    reviewActions.readOrderFrom({
                                      order_id : aDraft.order_id,
                                      location : aDraft.location,
                                      fromDraft : true
                                    }).then( ({ isSuccess, message } = {} ) => {
                                      if (isSuccess ){
                                        history.push('/orderpoints')
                                      }else{
                                        console.error('An error occurred after reading order from draft : ', message)
                                      }
                                    } )
                                  }else{
                                    reviewActions.storeTemplateToClone(aDraft)
                                    cloneTemplate()
                                  }
                                } }
                              >
                                {
                                  formatOrderId( aDraft.order_id, aDraft.is_template )
                                }
                              </a>
                            </td>
                            <td>{ aDraft.order_number }</td>
                            <td>{ aDraft.account_number }</td>
                            <td>{ aDraft.location }</td>
                            <td className="text-nowrap">{ aDraft.po_number }</td>
                            <td className="text-address">
                              {
                                aDraft.shipping_address &&
                                <div className="ship-to-outer">
                                  <i className="font-blue-soft">
                                    {
                                      `${aDraft.shipping_address.company || ''} ${aDraft.shipping_address.company && aDraft.shipping_address.attention ? '|' : ''} ${aDraft.shipping_address.attention || ''}`
                                    }
                                  </i><br />
                                  {
                                    `${aDraft.shipping_address.city ? aDraft.shipping_address.city + ',' : ''}
                                    ${aDraft.shipping_address.state_province ? aDraft.shipping_address.state_province : ''}
                                    ${aDraft.shipping_address.postal_code ? aDraft.shipping_address.postal_code + '-' : ''}
                                    ${aDraft.shipping_address.country ? aDraft.shipping_address.country : ''}`
                                  }
                              </div>
                              }
                            </td>
                          </tr>
                        )
                      } ) }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      allDrafts : state.orderPoints.drafts.allDrafts,
      loadedDrafts : state.orderPoints.drafts.loadedDrafts,
      selectedDraftRows : state.orderPoints.drafts.selectedDraftRows,
      filterInput : state.orderPoints.drafts.filterInput,
    }),
    dispatch => ({
      draftActions : bindActionCreators( draftActions, dispatch ),
      reviewActions : bindActionCreators( reviewActions, dispatch )
    })
  )(DraftsMain)
)