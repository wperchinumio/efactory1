import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import * as settingsActions from './redux'
import Bar from './Bar'
import Tabs from '../../_Shared/Components/Tabs'
import EmailSettings from './TabContents/EmailSettings'
import RmaTypes from './TabContents/RmaTypes'
import CustomOptions from './TabContents/CustomOptions'
import MailTemplates from './TabContents/MailTemplates/_Content'
import EmailSignatures from './TabContents/EmailSignatures/_Content'
import General from './TabContents/General/_Content'
import Shipping from './TabContents/Shipping/_Content'
import RmaDetail from '../../DetailPages/RmaDetail/_Content'

const Settings = props => {
  useEffect(
    () => {
      return () => {
        props.settingsActions.resetState()
      }
    },
    []
  )

  let { settingsActions, activeTab, location } = props
  let rmaDetailModalOpen = location.search && location.search.includes('?rmaNum')
  return (
    <section className="Settings-content">
      <div className={ classNames({ hidden: rmaDetailModalOpen }) } >
        <Bar />
        <div className="container-page-bar-fixed">
          <Tabs
            activeTab={activeTab}
            onTabClicked={ props.settingsActions.setActiveTab }
            tabs={
              [{
                type : 'rmaTypes',
                name : 'RMA Types & Dispositions'
              },{
                type : 'customOptions',
                name : 'Custom Fields'
              },{
                type : 'rmaShipping',
                name : 'Shipping'
              },{
                type : 'emailSettings',
                name : 'Email Settings'
              },{
                type : 'emailSignatures',
                name : 'Email Signatures'
              },{
                type : 'mailTemplates',
                name : 'Mail Templates'
              },{
                type : 'rmaGeneral',
                name : 'RMA # Generation'
              }]
            }
          />
          <div className="tabbable-line">
            <div className="tab-content" style={{padding: "10px 0"}}>
              {
                activeTab === 'rmaTypes' &&
                <RmaTypes settingsActions={settingsActions} />
              }
              {
                activeTab === 'customOptions' &&
                <CustomOptions settingsActions={settingsActions} />
              }
              {
                activeTab === 'rmaShipping' &&
                <Shipping settingsActions={settingsActions} />
              }
              {
                activeTab === 'emailSettings' &&
                <EmailSettings settingsActions={settingsActions} />
              }
              {
                activeTab === 'emailSignatures' &&
                <EmailSignatures settingsActions={settingsActions} />
              }
              {
                activeTab === 'mailTemplates' &&
                <MailTemplates settingsActions={settingsActions} />
              }
              {
                activeTab === 'rmaGeneral' &&
                <General settingsActions={settingsActions} />
              }
            </div>
          </div>
        </div>
      </div>
      {
        rmaDetailModalOpen &&
        <RmaDetail marginFix />
      }
    </section>
  )
}

export default withRouter(
  connect(
    state => ({
      activeTab: state.returnTrak.settings.activeTab
    }),
    dispatch => ({
      settingsActions: bindActionCreators( settingsActions, dispatch )
    })
  )(Settings)
)