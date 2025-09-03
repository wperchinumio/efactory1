import React, { useRef, useState, useCallback, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import history from '../../../../history'
import moment from 'moment'
import FixableGrid from '../../../Grid/__NEW__/FixableGrid'
import DaterangeFilter from '../../../Grid/QuickFilters/DateRangeFilter'
import BooleanFilter from '../../../Grid/QuickFilters/BooleanFilter'
import DropDownFilter from '../../../Grid/QuickFilters/DropdownFilter'
import Pagination from '../../../_Shared/Components/Pagination'
import viewFieldsConfigData from './viewFieldsConfig'
import HasEmailModal from './HasEmailModal'
import Bar from './Bar'
import downloadSource from '../../../_Helpers/DownloadSource'
import { getUserData } from '../../../../util/storageHelperFuncs'
import * as batchActions from './redux'
import * as gridActions from '../../../Grid/redux'
import OrderDetails from '../../../DetailPages/OrderDetail/_Content'

const FtpBatchActivity = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const [viewFieldsConfig, setViewFieldsConfig] = useState([])
  const [activeHasEmailId, setActiveHasEmailId] = useState('')

  const hasEmailClicked = useCallback(
    event => {
      setActiveHasEmailId(event.detail.id)
      setTimeout(
        () => global.$('#has-email-modal').modal('show'),
        100
      )
    },
    []
  )

  const batchDownloadClicked = useCallback(
    event => {
      let { id } = event.detail
      let url = `/api/orderpoints`
      let { batchActions } = props
      batchActions.toggleToasterVisibility(true) 
      let onSuccessAction = () => {
        batchActions.toggleToasterVisibility(false)
      }
      let onErrorAction = () => {
        batchActions.toggleToasterVisibility(false) 
        batchActions.showErrorToaster('An error occured while downloading')
      } 
      downloadSource( 
        url,
        JSON.stringify({ action: 'get_batch_content', id }),
        { onSuccessAction, onErrorAction } 
      )
    },
    []
  )

  const ackFileDownloadClicked = useCallback(
    event => {
      let { id } = event.detail
      let url = `/api/orderpoints`
      let { batchActions } = props
      batchActions.toggleToasterVisibility( true ) 
      let onSuccessAction = () => {
        batchActions.toggleToasterVisibility( false ) 
      }
      let onErrorAction = () => {
        batchActions.toggleToasterVisibility( false ) 
        batchActions.showErrorToaster('An error occured while downloading')
      } 
      downloadSource( 
        url, 
        JSON.stringify({ action: 'get_ack_content', id }),
        { onSuccessAction, onErrorAction } 
      )
    },
    []
  )

  const onTotalImportedClicked = useCallback(
    event => {
      let { id: id_received } = event.detail
      let { ftpBatchActivity, gridActions } = propsRef.current
      let { batches } = ftpBatchActivity
      let item = batches.find( ({ id }) => +id === +id_received )
      if (!item) {
        return console.error('item not found')
      }
      let { received_date, name } = item
      let dateFormat = 'YYYY-MM-DD'
      let filters = {
        received_date: [ 
          { 
            field: 'received_date', 
            value: moment( received_date ).format( dateFormat ),
            oper: '>=' 
          },
          {
            field: "received_date", 
            oper: "<=", 
            value: moment( received_date ).format( dateFormat )
          }
        ],
        batch: [
          {
            field: "batch",
            oper: "=",
            value: name
          }
        ]
      }
      gridActions.setQueryFilters( filters ).then( () => {
        history.push('/orders/all')
      })
    },
    []
  )

  useEffect(
    () => {
      listBatches()
      setViewFieldsConfig(viewFieldsConfigData)
      global.document.addEventListener('HasEmailClicked', hasEmailClicked)
      global.document.addEventListener('BatchDownload', batchDownloadClicked)
      global.document.addEventListener('AckFileDownload', ackFileDownloadClicked)
      global.document.addEventListener('TotalImportedClicked', onTotalImportedClicked )
      return () => {
        global.document.removeEventListener('HasEmailClicked', hasEmailClicked)
        global.document.removeEventListener('BatchDownload', batchDownloadClicked)
        global.document.removeEventListener('AckFileDownload', ackFileDownloadClicked)
        global.document.removeEventListener('TotalImportedClicked', onTotalImportedClicked)
        props.batchActions.initializeGridReduxState()
      }
    },
    []
  )

  function listBatches () {
    props.batchActions.listBatches()
  }
  
  function onSortClicked (sortObject = {}) {
    let sortField = Object.keys( sortObject )[0]
    let sortDirection = Object.values( sortObject )[0]
    let { batchActions } = props
    batchActions.setRootReduxStateProp_multiple({ 
      sort: [{ [ sortField ]: sortDirection }] 
    }).then( 
      () => {
        batchActions.listBatches()
      } 
    )
  }

  function onFilterChange (filterObj) {
    let field = Object.keys( filterObj )[ 0 ]
    let { batchActions, ftpBatchActivity } = props
    batchActions.setRootReduxStateProp_multiple({
      filters: {
        ...ftpBatchActivity.filters, 
      [field]: filterObj[field] // value will be an array  
      }
    }).then( () => {
      batchActions.listBatches()
    })
  }

  function paginate (page_num) {
    let { setRootReduxStateProp_multiple, listBatches } = props.batchActions
    setRootReduxStateProp_multiple({ page_num }).then( 
      () => listBatches()
    )
  }

  let { 
    ftpBatchActivity,
    batchActions,
    location
  } = props
  
  let { 
    batches = [],
    batchEmail,
    filters = {},
    page_num,
    total,
    sort
  } = ftpBatchActivity || {}

  let { 
    received_date = [], 
    with_error = [],
    account_number = []
  } = filters 

  let isOrderDetailDisplay  = false

  if (location && location.search && location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  let accOptions = getUserData('calc_accounts').map(
    account => ({ key: account, value: account, oper: '=' })
  )

  return (

    <div>
      <div style={ isOrderDetailDisplay ? { display: 'none' } : {} }>
        <Bar listBatches={ listBatches } />
        <div className="container-page-bar-fixed">
          <div className="portlet light bordered" style={{ padding: '12px 20px 5px 20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <DropDownFilter
                key={ 'account_number' }  
                field={ 'account_number' }
                iconClassName={ 'fa fa-user' }
                title={ 'ACCOUNT' }
                onQuickFilterChange={ onFilterChange }
                defaultOption={
                  account_number.length 
                  ? {
                    ...account_number[0],
                    key : account_number[0]['value'].includes(',')? undefined: accOptions.filter( o => o.value === account_number[0]['value'] )[0]['key']
                  } 
                  : undefined 
                }
                options={ accOptions }
              />
              <span className="quick-filter-sep">|</span>
              <DaterangeFilter
                key={'received_date'}
                field={'received_date'}
                iconClassName={ 'fa fa-calendar' }
                title={'RECEIVED DATE'}
                onQuickFilterChange={ onFilterChange }
                allowClear={false}
                startDate={ received_date.length ? received_date[0]['value'] : undefined }
                endDate={ received_date.length > 1 ? received_date[1]['value'] : '2017-05-04' }
              />
              <span className="quick-filter-sep">|</span>
              <BooleanFilter
                key={'with_error'}
                onQuickFilterChange={ onFilterChange }
                field={'with_error'}
                title={'With Error Only'}
                checked={ with_error.length ? with_error[0]['value'] : undefined }
                noIcon={ true }
              />
            </div>
            <FixableGrid 
              heightToSubtract={ 238 }
              id="row-detail"
              columns={ viewFieldsConfig }
              rows={ batches }
              defaultColumnsConfig={{
                columns : [  ],
                data    : { /* @todo : invoiceActions in the future */ }
              }}
              currentSort={ Array.isArray( sort ) ? sort[ 0 ] : [] }
              onSortChange={ onSortClicked }
              onRowClicked={ ({ row_id, header_id, row, index }) => {} }
            />
            <Pagination 
              className={''}
              activePagination={ page_num }
              paginate={ paginate }
              page_size={ 100 }
              number_of_items={ total }
              paginationWord={ 'record' }
              style={{ marginTop : '14px', marginBottom : '10px' }}
            />
            <HasEmailModal 
              id={ activeHasEmailId }
              batchActions={ batchActions }
              batchEmail={ batchEmail }
            />
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

export default connect(
  state => ({
    ftpBatchActivity: state.services.utilities.ftpBatchActivity,
  }),
  dispatch => ({
    batchActions: bindActionCreators( batchActions, dispatch ),
    gridActions : bindActionCreators( gridActions, dispatch ),
  })
)(FtpBatchActivity)