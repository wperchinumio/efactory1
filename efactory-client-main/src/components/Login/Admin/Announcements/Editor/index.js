import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import Editor from './Editor'    
import ArticleSettings from './ArticleSettings'
import PreviewModal from '../Articles/PreviewModal'
import getMimeClassname from '../../../../_Helpers/getMimeClassname'
import UploadingDialog from '../../../../_Shared/Components/Uploading'

const EditorContent = props => {
  const uploadNode = useRef(null)
  const [id, setId] = useState('')
  const [attachmentId, setAttachmentId] = useState('')

  useEffect(
    () => {
      document.getElementById('title').focus()
      return () => {
        props.loginActions.setRootReduxStateProp_multiple({
          edit_article_data: {},
          edit_article_dirty: false,
        })
      }
    },
    []
  )

  function handleEditorChange (value) {
    let { auth, loginActions } = props
    let { edit_article_data = {} } = auth
    loginActions.setRootReduxStateProp_multiple({
      edit_article_data : {
        ...edit_article_data,
        body : value
      },
      edit_article_dirty : true
    })
  }

  function handleTitleChange (event) {
    let { value } = event.currentTarget
    let { auth, loginActions } = props
    let { edit_article_data = {} } = auth
    loginActions.setRootReduxStateProp_multiple({
      edit_article_data : {
        ...edit_article_data,
        title : value
      },
      edit_article_dirty : true
    })
  }

  function onPreviewClicked (event) {
    global.$('#preview-modal').modal('show')
  }

  function deleteArticle (event) {
    global.$('#delete-article-modal').modal('show')
  }

  function onDeleteConfirmed (event) {
    let {
      loginActions,
      auth,
      onGoToArticlesClicked
    } = props
    global.$('#delete-article-modal').modal('hide')
    loginActions.deleteArticle( auth.edit_article_data.id ).then(
      onGoToArticlesClicked
    )
  }

  function removeArticleAttachment (event) {
    global.$('#delete-attachment-modal').modal('show')
    setId(event.currentTarget.getAttribute('data-article-id'))
    setAttachmentId(event.currentTarget.getAttribute('data-id'))
  }

  function approveRemoveArticleAttachment () {
    global.$('#delete-attachment-modal').modal('hide')
    props.loginActions.deleteAttachment(id, attachmentId)
  }

  function uploadFile (event) {
    if (event.target.value !== '') {
      let file = event.target.files[0]
      props.loginActions.uploadDocument( file )
      event.target.value = ''
    }
  }

  function onGoToArticlesClicked () {
    let { auth, onGoToArticlesClicked } = props
    if( auth.edit_article_dirty ){
      global.$('#approve-route-change').modal('show')
    }else{
      onGoToArticlesClicked()
    }
  }

  let {
    loginActions,
    auth,
    is_archive
  } = props

  let {
    body = '',
    title = ''
  } = auth.edit_article_data || {}

  return (
    <div className="row editor-row">
      <div className="login-editor-breadcrumb" >
        <a className="sbold" onClick={ onGoToArticlesClicked }> 
          { is_archive ? 'Archive ' : 'Articles ' }
        </a> 
        &nbsp;
        >
        &nbsp;
        Editor
      </div>
      <div className="col-sm-7">
        <div 
          className="article-editor"
          style={{ 
            display: 'inline-block',
            width: '100%'
          }}
        >
          <div 
            className="form-group"
            style={{ marginBottom: '-10px' }}
          >
            <label 
              htmlFor="title" 
              className="col-xs-2 col-lg-1 control-label"
              style={{ 
                paddingTop: '5px',
                color: '#607d8b',
                fontWeight: '600'
              }}
            >
              Title:
            </label>
            <div 
              className="col-xs-10 col-lg-11"
              style={{
                paddingRight: '0'
              }}
            >
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                id="title"
                value={ title }
                onChange={ handleTitleChange }
              />
            </div>
          </div>
          <Editor
            value={ body }
            handleEditorChange={ handleEditorChange }
          />
          {
            auth.edit_article_data.id &&
            <button 
              className="btn btn-danger btn-sm" 
              type="button"
              onClick={ deleteArticle }
            >
              <i className="fa fa-eye"></i>
              Delete
            </button>  
          }
          <div className="page-toolbar pull-right">
            <button 
              className="btn btn-topbar btn-sm" 
              type="button"
              disabled={ 
                body 
                ? body.trim && body.trim().length 
                  ? false
                  : true
                : true 
              }
              onClick={ onPreviewClicked }
            >
              <i className="fa fa-eye"></i>
              Preview
            </button>  
          </div>
        </div>
        {
          auth.edit_article_data.id && 
          <div>
            <div className="article-attachments-container">
              <div className="article-attachments">
                {
                  auth.edit_article_data.attachments && 
                  auth.edit_article_data.attachments.map(
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
                      <a className="icon-btn" key={ `attach-key-${id}` }>
                        <i className={ getMimeClassname( mime ) }></i>
                        <div className="icon-btn-text"> 
                          { name }
                          <br/>
                          { filesize(size) }
                        </div>
                        <span 
                          className="mime-icon badge badge-danger"
                          data-article-id={ article_id }
                          data-id={ id }
                          onClick={ removeArticleAttachment }
                        > x </span>
                      </a>
                    )
                  })
                }
              </div>
            </div>  
            <div className="add-article-attachment">
              <input 
                type="file"
                id="my_file"
                ref={uploadNode}
                onChange={uploadFile}
                style={{ display : "none" }} 
              />

              <a 
                className="icon-btn" 
                style={{ width: '130px' }}
                onClick={ event => uploadNode.current.click() }
              >
                <i className="fa fa-plus" />
                <div className="icon-btn-text"> Add file </div>
              </a>
            </div>
          </div>
        }
      </div>
      <ArticleSettings 
        loginActions={ loginActions }
        auth={ auth }
      />
      <PreviewModal
        loginActions={ loginActions }
        auth={ auth }
        activeRow={ auth.edit_article_data || {} }
      />
      <div 
        className="modal modal-themed fade" 
        id="delete-article-modal" 
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
                  Are you sure you want to delete this article?
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
                onClick={ onDeleteConfirmed }
              >
                Delete
              </button>
            </div>
        </div>
      </div>
    </div>
    <div 
      className="modal modal-themed fade" 
      id="delete-attachment-modal" 
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
                Are you sure you want to delete this attachment?
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop : '-40px' }}>
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
              onClick={ approveRemoveArticleAttachment }
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <UploadingDialog />
  </div>
  )
}

EditorContent.propTypes = {
  auth: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired,
  onGoToArticlesClicked: PropTypes.func.isRequired,
  is_archive: PropTypes.bool.isRequired
}

export default EditorContent