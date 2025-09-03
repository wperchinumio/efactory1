import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import bgcolorConfig from './bgcolorConfig'

const Threads = ({
  announcementsActions,
  announcementsState
}) => {
  useEffect(
    () => {
      global.App.initSlimScroll(document.querySelector(".scrollable-fix"))
      return () => {
        global.App.destroySlimScroll(document.querySelector(".scrollable-fix"));
      }
    },
    []
  )

  function formatPublishDate (publish_date) {
    let publish_date_formatted = moment( publish_date ).calendar()

    if( !publish_date_formatted.includes('Today') ){
       publish_date_formatted = publish_date_formatted.replace(' at 12:00 AM', '')
    }

    if( publish_date_formatted.replace(/\d{2}\/\d{2}\/\d{4}/, '') === '' ){
      publish_date_formatted = moment( publish_date ).format('ll')
    }

    return publish_date_formatted
  }

  function filterActiveCategoryThreads ( articles, active_group_id ) {
    if( active_group_id === 0 ) return articles
    return articles.filter( ({ group_id }) => active_group_id === group_id )
  }

  function onThreadClicked (event) {
    let id = event.currentTarget.getAttribute('data-id')
    let index = event.currentTarget.getAttribute('data-index')
    announcementsActions.fetchArticlePreviewData( id, index )
  }

  let {
    articles = [],
    active_group_id = '',
    active_group_name
  } = announcementsState

  articles = filterActiveCategoryThreads( articles, active_group_id )

  return (
    <div className="inbox-body" >
      <div className="inbox-header">
        <h1 className="pull-left">{ active_group_name }</h1>
      </div>
      <div 
        className="inbox-content scrollable-fix" 
        style={{ height: 'calc( 100vh - 201px )', overflowY : 'auto' }}
        data-height="calc( 100vh - 201px )"
      >
          
        <table className="table table-striped table-advance table-hover table-messages">
          <thead>
            <tr className="read-threads-tr" style={{border: '1px solid #ccc'}}>
              <th style={{borderBottom: 'inherit'}}></th>
              <th style={{fontSize: '1.2em', fontWeight: '600', color: '#777', borderBottom: 'inherit'}}>Title</th>
              <th style={{borderBottom: 'inherit'}}></th>
              <th style={{fontSize: '1.2em', fontWeight: '600', color: '#777', borderBottom: 'inherit'}}>Released</th>
              <th style={{fontSize: '1.2em', fontWeight: '600', color: '#777', borderBottom: 'inherit'}}>From</th>
             </tr> 
          </thead>  
          <tbody>

            {
              articles.map( 
                ({  
                  id,
                  title,
                  author,
                  group_id,
                  is_read,
                  published_from,
                  read,
                  has_attachments,
                }, index ) => {
                  return (
                    <tr 
                      className={ !is_read ? 'unread' : '' } 
                      key={ `thread-${index}` }
                      data-id={id}
                      data-index={index}
                      onClick={ onThreadClicked }
                    >
                      <td className="inbox-small-cells">
                        <i
                          className="fa fa-star"
                          style={{ color : bgcolorConfig[ group_id ] }}
                        />
                      </td>
                      <td className="view-message font-blue-sharp"> 
                        { title }
                      </td>
                      <td className="view-message inbox-small-cells color-themed">
                        {
                          has_attachments &&
                          <i className="fa fa-paperclip"></i>
                        }
                      </td>
                      <td className="view-message color-themed"> 
                        { formatPublishDate( published_from ) }
                      </td>
                      <td className="view-message hidden-xs color-themed"> 
                        { author }
                      </td>
                    </tr>
                  )
                } 
              )
            }
          </tbody>
        </table>  
        {
          articles.length === 0 &&
          <h4 className="no-thread-message">
            No announcement for this category.
          </h4>
        }
      </div>
    </div>
  )
}

Threads.propTypes = {
  announcementsState    : PropTypes.object.isRequired,
  announcementsActions  : PropTypes.object.isRequired
}

export default Threads