import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import OnDemand from '../ImportOnDemand'
import OnSchedule from '../ImportScheduler'
import Tabs from '../../_Shared/Components/Tabs'
import Activity from './Activity'
import ActivityDetail from './ActivityDetail'
import { getUserData } from '../../../util/storageHelperFuncs'

const OrderImportMain = props => {
  const is_local_admin = useRef(getUserData('is_local_admin'))
  const [activeTab, setActiveTab] = useState('schedule_tab')

  let { threePLState, settingsActions } = props
  return (
    <div className="bordered container-fluid light margin-top-10 portlet">
      <div className="tabbable-line">
        <Tabs
          activeTab={activeTab}
          onTabClicked={setActiveTab}
          tabs={ is_local_admin.current ?
            [{
              type : 'schedule_tab',
              name : 'Schedule'
            },{
              type : 'log_activity_tab',
              name : 'Log Activity'
            },{
              type : 'log_activity_detail_tab',
              name : 'Detailed Log Activity'
            }] : [{
              type : 'schedule_tab',
              name : 'Schedule'
            },{
              type : 'log_activity_tab',
              name : 'Log Activity'
            }]
          }
        />
      </div>
      <div className="portlet-body">
        <div className="tab-content">
          <div className={ classNames({
            'tab-pane' : true,
            'active'   : activeTab === 'schedule_tab'
          }) }>
            {
              activeTab === 'schedule_tab' &&
              <div className="row">
                <div className="col-lg-10 col-md-12" style={{ marginTop: '20px' }}>
                  <span 
                    className="font-blue-soft" 
                    style={{ fontWeight: '600' }}
                  >
                    On Schedule
                  </span>
                  <hr className="border-grey-salsa" style={{ marginTop: '0px' }} />
                </div>
                <OnSchedule 
                  threePLState={ threePLState }
                  settingsActions={ settingsActions }
                />
                <div className="col-lg-10 col-md-12" style={{ marginTop: '40px' }}>
                  <span 
                    className="font-blue-soft" 
                    style={{ fontWeight: '600' }}
                  >
                    On Demand
                  </span>
                  <hr className="border-grey-salsa" style={{ marginTop: '0px' }} />
                </div>
                <OnDemand 
                  threePLState={ threePLState }
                  settingsActions={ settingsActions }
                />
              </div>
            }
          </div>
        </div>
        <div className="tab-content">
          <div
            className={ classNames({
              'tab-pane' : true,
              'active'   : activeTab === 'log_activity_tab'
            }) }
          >
            {
              activeTab === 'log_activity_tab' &&
              <Activity 
                threePLState={ threePLState }
                settingsActions={ settingsActions }
              />
            }
          </div>
        </div>
        {
          is_local_admin.current &&
          <div className="tab-content">
            <div className={ classNames({
              'tab-pane' : true,
              'active'   : activeTab === 'log_activity_detail_tab'
            }) }>
              
              {
                activeTab === 'log_activity_detail_tab' &&
                <ActivityDetail
                  threePLState={ threePLState }
                  settingsActions={ settingsActions }
                />
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

OrderImportMain.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default OrderImportMain