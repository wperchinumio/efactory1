import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as shipNotificationActions from './redux'
import Bar from './Bar'
import Tabs from '../../_Shared/Components/Tabs'
import EmailSettings from './TabContents/EmailSettings'
import MailTemplates from './TabContents/MailTemplates/_Content'

const Settings = props => {
  useEffect( 
    () => {
      return () => {
        props.shipNotificationActions.resetState()
      }
    },
    []
  )

  function onTabClicked (activeTab) {
    let { setRootReduxStateProp_multiple } = props.shipNotificationActions
    if( activeTab === 'mailTemplates' ){
      setRootReduxStateProp_multiple({ 
        activeTab,
        activeTab_mt  : 'orderLevel',
        order_templates : [],
        html : '',
        account_number : '',
        active : false,
        email_value : '',
        loadingEmailSample : false,
        editor_value_changed : false,
        order_number : '',
        initialRequest : false
      })
    }else{
      setRootReduxStateProp_multiple({ 
        activeTab,
        emailSettings : {},
        savingEmailSettings : false,
      })
    }
  }

  let { shipNotificationActions, shipNotificationState } = props
  let { activeTab } = shipNotificationState

  return (
    <section className="Settings-content">
      <div>
        <Bar />
        <div className="container-page-bar-fixed">
          <Tabs
            activeTab={activeTab}
            onTabClicked={ onTabClicked }
            tabs={
              [
                {
                  type : 'emailSettings',
                  name : 'Email Settings'
                },
                {
                  type : 'mailTemplates',
                  name : 'Mail Templates'
                },
              ]
            }
          />
          <div className="tabbable-line">
            <div className="tab-content" style={{padding: "10px 0"}}>
              {
                activeTab === 'emailSettings' &&
                <EmailSettings
                  shipNotificationActions={ shipNotificationActions }
                  shipNotificationState={ shipNotificationState }
                />
              }
              {
                activeTab === 'mailTemplates' &&
                <MailTemplates
                  shipNotificationActions={ shipNotificationActions }
                  shipNotificationState={ shipNotificationState }
                />
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default connect(
  state => ({
    shipNotificationState : state.shipNotification,
  }),
  dispatch => ({
    shipNotificationActions : bindActionCreators( shipNotificationActions, dispatch )
  })
)(Settings)