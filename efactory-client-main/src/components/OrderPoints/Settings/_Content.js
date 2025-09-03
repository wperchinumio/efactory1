import React, { useRef, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from './redux'
import PageBar from './PageBar'
import OrderNumber from './OrderNumber'
import Shipping from './Shipping'
import CustomFields from './CustomFields'
import global from 'window-or-global'
import Tabs from '../../_Shared/Components/Tabs'

const Content = props => {
  const firstRun = useRef(true)
  
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (!props.updatingSettings) {
        global.$('#settings_popup').modal('show')
      }
    },
    [props.updatingSettings]
  )

  function onTabClicked (tabType) {
    let { setRootReduxStateProp } = props.settingsActions
    setRootReduxStateProp({ field: 'activeTab', value: tabType })
  }

  let { activeTab, settingsActions } = props
  let {
    updateShippingFields,
    updateCustomFields,
    updateSettingsAsync
  } = settingsActions
  return (
    <div>
      <PageBar updateSettingsAsync={updateSettingsAsync} />
      <div className="container-page-bar-fixed">
        <Tabs
          activeTab={activeTab}
          onTabClicked={onTabClicked}
          tabs={
            [{
              type : 'shipping',
              name : 'Shipping'
            },{
              type : 'customOptions',
              name : 'Custom Fields'
            },{
              type : 'orderNumber',
              name : 'Order # Generation'
            }]
          }
        />
        {
          activeTab === 'customOptions' &&
          <CustomFields
            settingsActions={settingsActions}
            updateCustomFields={updateCustomFields}
          />
        }
        {
          activeTab === 'orderNumber' &&
          <OrderNumber
            settingsActions={settingsActions}
          />
        }
        {
          activeTab === 'shipping' &&
          <Shipping
            settingsActions={settingsActions}
            updateShippingFields={updateShippingFields}
          />
        }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    activeTab: state.orderPoints.settings.activeTab,
    settings: state.orderPoints.settings
  }),
  dispatch => ({
    settingsActions: bindActionCreators( settingsActions, dispatch )
  })
)(Content)