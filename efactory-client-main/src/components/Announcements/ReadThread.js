import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import classNames from 'classnames'
import getMimeClassname from '../_Helpers/getMimeClassname'
import downloadSource from '../_Helpers/DownloadSource'

const ReadThread = ({
  announcementsState,
  announcementsActions,
}) => {
  function goBack (event) {
    announcementsActions.setRootReduxStateProp_multiple({
      open_thread_id : '',
      preview_data : ''
    })
  }

  function downloadAttachment (event) {
    event.preventDefault()
    announcementsActions.toggleToasterVisibility( true )

    let id = event.currentTarget.getAttribute('data-attachment-id')
    let url = `/api/announcements/${id}`

    let onSuccessAction = () => {
      announcementsActions.toggleToasterVisibility( false ) 
    }
    let onErrorAction = () => {
      announcementsActions.toggleToasterVisibility( false ) 
      announcementsActions.showErrorToaster('An error occured while downloading')
    } 

    downloadSource( 
      url, 
      undefined, 
      { onSuccessAction, onErrorAction } 
    )
  }

  function filterActiveCategoryThreads ( articles, active_group_id ) {
    if( active_group_id === 0 ) return articles
    return articles.filter( ({ group_id }) => active_group_id === group_id )
  }

  function onNavigateClicked (event) {
    let disabled = event.currentTarget.getAttribute('data-is-disabled')
    if( disabled ) {
      return
    }
    let isPrev = event.currentTarget.getAttribute('data-is-prev') || false
    let {
      articles = [],
      active_group_id = '',
      preview_data
    } = announcementsState
    
    articles = filterActiveCategoryThreads( articles, active_group_id )
    let { index } = preview_data
    index = +index
    let navigated_article_index = isPrev ? index - 1 : index + 1
    
    announcementsActions.fetchArticlePreviewData( 
      articles[ navigated_article_index ]['id'],
      navigated_article_index
    )
  }

  let {
    articles = [],
    active_group_id = '',
    preview_data,
    loading
  } = announcementsState

  let {
    attachments = [],
    body,
    title,
    index = ''
  } = preview_data

  index = +index

  articles = filterActiveCategoryThreads( articles, active_group_id )

  return (

    <div className="inbox-body" style={{ height: 'calc( 100vh - 100px )' }}>
      <div className="inbox-header">
        <div 
          className="btn-group pull-right noselect" 
          style={{ 
            marginTop: '6px',
            marginRight: '10px'
          }}
        >
          <div 
            className="pull-left" 
            style={{
              display: 'inline-block',
              padding: '0 20px'
            }}
          >
            <span className="pagination-info"> 
              { index + 1 } of { articles.length } 
            </span>
            &nbsp;&nbsp;
            <a 
              className={ classNames({
                'disabled-link disabled' : loading || index === 0,
                'btn btn-sm blue-dark btn-outline' : true
              }) }
              data-is-disabled={ loading || index === 0 ? 'disabled' : '' }
              data-is-prev="true"
              onClick={ onNavigateClicked }
            >
              <i className="fa fa-angle-left" />
            </a>
            &nbsp;&nbsp;
            <a 
              className={ classNames({
                'disabled-link disabled' : loading || index === articles.length - 1,
                'btn btn-sm blue-dark btn-outline' : true
              }) }
              data-is-disabled={ loading || index === articles.length - 1 ? 'disabled' : '' }
              onClick={ onNavigateClicked }
            >
              <i className="fa fa-angle-right" />
            </a>
          </div>

          <button 
            className="btn btn-topbar reply-btn btn-sm"
            onClick={ goBack }
          >
            <i className="fa fa-reply" />
            &nbsp;
            BACK
          </button>
        </div>
        <h2 
          className="pull-left font-green-seagreen" 
          style={{ 
            marginTop: '10px',
            fontWeight: '500'
          }}
        >
          { title }
        </h2>
      </div>
      <hr style={{ margin: '10px 0 20px 0' }}/>
      <div className="inbox-content" style={{}}>
        <div 
          className="inbox-view" 
          style={{ 
            height:  attachments.length === 0 ? 'calc(100vh - 304px)' : 'calc( 100vh - 392px )'
          }}
          dangerouslySetInnerHTML={{__html: body}} 
        />
        <hr />

        {
          attachments.length === 0 &&
          <h4>
            <i className="font-yellow-casablanca">
              No attachments
            </i>
          </h4>
        }
        
        {
          attachments.length > 0 &&
          <div className="article-attachments-container" style={{ width : '100%', overflowX: 'auto' }}>
            <div className="article-attachments" style={{ marginTop : '7px' }}>
              {
                attachments.map(
                  (
                    {
                      article_id,
                      id,
                      mime,
                      name,
                      size,
                    } = {}
                  ) => {
                  return (
                    <a 
                      className="icon-btn noselect" 
                      key={ `attach-key-${id}` }
                      style={{ cursor: 'pointer' }}
                      onClick={ downloadAttachment }
                      data-attachment-id={ id }
                    >
                      <i className={ getMimeClassname( mime ) }></i>
                      <div className="icon-btn-text"> 
                        { name }
                        <br/>
                        { filesize(size) }
                      </div>
                    </a>
                  )
                })
              }
              
            </div>
          </div>  
        }
      </div>
    </div>
  )
}

ReadThread.propTypes = {
  announcementsState   : PropTypes.object.isRequired,
  announcementsActions : PropTypes.object.isRequired
}

export default ReadThread