import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Bar from './Bar'
import Tabs from '../../_Shared/Components/Tabs'
import TabLicenses from './Tabs/Licenses/_Content'
import TabUsers from './Tabs/Users/_Content'
import * as accountActions from './redux'

const Accounts = props => {
  function onTabClicked (activeTab) {
    props.accountActions.setRootReduxStateProp('activeTab', activeTab)
  }

  let { accountActions, accountState } = props
  let { activeTab } = accountState
  return (
    <section className="accounts-content">
      <div>
        <Bar />
        <div className="container-page-bar-fixed">
          <Tabs
            activeTab={activeTab}
            onTabClicked={onTabClicked}
            tabs={
              [{
                type : 'users',
                name : 'Users'
              },{
                type : 'licenses',
                name : 'Licenses'
              }]
            }
          />
          <div className="tabbable-line">
            <div className="tab-content" style={{padding: "10px 0"}}>
              {
                activeTab === 'licenses' &&
                <TabLicenses
                  accountState={ accountState }
                  accountActions={ accountActions }
                />
              }
              {
                activeTab === 'users' &&
                <TabUsers
                  accountState={ accountState }
                  accountActions={ accountActions }
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
    accountState: state.account
  }),
  dispatch => ({
    accountActions: bindActionCreators( accountActions, dispatch )
  })
)(Accounts)