import React, { useEffect, useRef } from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import * as announcementsActions from './redux'
import Threads from './Threads'
import ReadThread from './ReadThread'
import bgcolorConfig from './bgcolorConfig'

const AnnouncementsContent = ({
  announcementsActions,
  announcementsState,
  badgeCounterValues,
}) => {
  const isFirstRun = useRef(true)

  useEffect(
    () => {
      announcementsActions.listArticles({ isInitialRequest : true })
      return () => {
        announcementsActions.initializeReduxState() 
      }
    },
    []
  )

  useEffect(
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      announcementsActions.listArticles()
    },
    [badgeCounterValues['/announcements']]
  )

  function onCategoryClicked (event) {
    let active_group_id = event.currentTarget.getAttribute('data-group-id')
    let active_group_name = event.currentTarget.getAttribute('data-group-name')
    active_group_id = +active_group_id
    announcementsActions.setRootReduxStateProp_multiple({
      active_group_id,
      active_group_name,
      open_thread_id : '',
      preview_data : {}
    })
  }

  let {
    groups = [],
    active_group_id = '',
    open_thread_id
  } = announcementsState

  return (
    <div>
      <div className="inbox">
        <div className="row">
          <div className="col-lg-3 col-md-4">
            <div className="inbox-sidebar" >
            <h3>Categories</h3>
              <ul className="inbox-nav">

                {
                  groups.map(  
                    ( 
                      {
                        id,
                        name,
                        total_articles,
                        unread_count,
                      }, 
                      index 
                    ) => {
                      let isTotalArticlesMoreThanZero = +total_articles > 0
                      return <li 
                        className={ classNames({ 
                          'categories-item' : true,
                          'active' : id === active_group_id 
                        }) } 
                        key={`group-${index}`}
                        data-group-id={ id }
                        data-group-name={ name }
                        onClick={ onCategoryClicked }
                      >
                        <a data-type="inbox" data-title="Inbox" className={ !isTotalArticlesMoreThanZero ? 'font-grey-salt' : '' }> { name }
                          {
                            +unread_count > 0 &&
                            <span 
                              className="badge"
                              style={{ backgroundColor : bgcolorConfig[ id ] }}
                            >
                              { unread_count }
                            </span>
                          }
                        </a>
                      </li>

                    }
                  )
                }

              </ul>
            </div>
          </div>
          
          <div className="col-lg-9  col-md-8">
            
            
            {
              !open_thread_id &&
              <Threads 
                announcementsState={ announcementsState }
                announcementsActions={ announcementsActions }
                badgeColors={ bgcolorConfig }
              />
            }

            {
              open_thread_id &&
              <ReadThread 
                announcementsState={ announcementsState }
                announcementsActions={ announcementsActions }
              />
            }

          </div>
        </div>
      </div>
    </div>
  )
}

AnnouncementsContent.propTypes = {
  announcementsState: PropTypes.object.isRequired
}

export default connect(
  state => ({
    announcementsState : state.announcements,
    badgeCounterValues  : state.grid.badgeCounterValues
  }),
  dispatch => ({
    announcementsActions : bindActionCreators( announcementsActions, dispatch )
  })
)(AnnouncementsContent)