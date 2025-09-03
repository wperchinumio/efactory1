import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tabs from '../../../_Shared/Components/Tabs'
import OverviewTabContent from './Overview'
import ArchiveTabContent from './Achive'
import ArticlesTabContent from './Articles'
import ArticlesContentBar from './Articles/ContentBar'
import EditorContent from './Editor'
import * as loginActions from '../../redux'

const AnnouncementsTabs = props => {
  const [activeTab, setActiveTab] = useState('overview')
  const [editorIsOpen, setEditorIsOpen] = useState(false)
  
  function onTabClicked (activeTab) {
    if (editorIsOpen) {
      return
    }
    setActiveTab(activeTab)
  }

  function onGoToArticlesClicked (event) {
    global.$('#approve-route-change').modal('hide')
    setEditorIsOpen(false)
  }

  let is_archive_active = activeTab === 'archive'
  let activeTab_ = editorIsOpen ? '' : activeTab
  let { auth, loginActions } = props
  let {
    announcements_archive_articles_active_row_id,
    announcements_articles_active_row_id
  } = auth
  let id = is_archive_active ? announcements_archive_articles_active_row_id : announcements_articles_active_row_id
  return (
    <div className="accouncements-container">
      <div className="portlet light" style={{ padding: '12px 20px 21px 20px' }}>
        <div className="portlet-title">
          <div className="caption">
            <i className="fa fa-bullhorn"></i> Announcements 
          </div>
        </div>
        <div 
          className="portlet-body" 
          style={{ marginTop: '-10px' }}
        >
          {
            !editorIsOpen &&
            <Tabs
              activeTab={ editorIsOpen ? '' : activeTab_ }
              onTabClicked={ onTabClicked }
              tabs={
                [
                  {
                    type : 'overview',
                    name : 'Overview'
                  },
                  {
                    type : 'articles',
                    name : 'Articles'
                  },
                  {
                    type : 'archive',
                    name : 'Archive'
                  },
                ]
              }
            >
              {
                ( activeTab_ === 'articles' || activeTab_ === 'archive' )
                && <ArticlesContentBar
                  openEditor={ () => setEditorIsOpen(true) }
                  id={ id }
                  is_archive={ is_archive_active }
                  loginActions={ loginActions }
                />
              }
            </Tabs>
          }
          {
            activeTab_ === 'overview' &&
            <OverviewTabContent 
              auth={ auth }
              loginActions={ loginActions }
            />
          }
          {
            activeTab_ === 'articles' &&
            <ArticlesTabContent
              auth={ auth }
              loginActions={ loginActions }
            />
          }
          {
            activeTab_ === 'archive' &&
            <ArchiveTabContent
              auth={ auth }
              loginActions={ loginActions }
            />
          }
          {
            editorIsOpen &&
            <EditorContent
              onGoToArticlesClicked={ onGoToArticlesClicked }
              auth={ auth }
              id={ id }
              is_archive={ is_archive_active }
              loginActions={ loginActions }
            />
          }
        </div>
      </div>
      <div 
        className="modal modal-themed fade" 
        id="approve-route-change" 
        tabIndex="-1" 
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title font-dark"> Confirm </h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  You made some changes, are you sure to leave?
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop : '-40px' }} >
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={ onGoToArticlesClicked }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

AnnouncementsTabs.propTypes = {
  auth: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    loginActions: bindActionCreators(loginActions, dispatch)
  })
)(AnnouncementsTabs)