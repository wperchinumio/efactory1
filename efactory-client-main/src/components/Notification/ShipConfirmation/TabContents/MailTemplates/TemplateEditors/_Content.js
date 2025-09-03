import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Editor from './Editor'
import EditorBottomControls from './EditorBottomControls'
import EmailSample from './EmailSample'
import KeywordsTable from './KeywordsTable'
import Tabs from './Tabs'

const TemplateEditors = props => {
  function onTabClicked (tabType) {
    props.shipNotificationActions.setRootReduxStateProp_multiple({ activeTab_mt: tabType })
  }

  function onEditorChanged (html) {
    if (props.shipNotificationState.html === html) {
      return
    }
    props.shipNotificationActions.setRootReduxStateProp_multiple({ html, editor_value_changed: true })
  }

  function onTemplateClicked (event) {
    let id = event.currentTarget.getAttribute('data-id')
    let index = event.currentTarget.getAttribute('data-index')
    let {
      templates = [],
      active_template = {},
      account_number
    } = props.shipNotificationState
    if (id === active_template[ 'id' ] ) {
      return
    }
    let { shipNotificationActions } = props
    shipNotificationActions.readOrderTemplateWithParams({ account_number, id })
    shipNotificationActions.setRootReduxStateProp_multiple({ active_template: {...templates[index]} })
  }

  function onDeleteDraftClicked (event) {
    global.$('#delete-order-template-draft').modal('show')
  }

  function onDeleteDraftConfirmed (event) {
    props.shipNotificationActions.deleteOrderTemplate()
    .then( () => global.$('#delete-order-template-draft').modal('hide') )
    .catch( () => {} )
  }

  function onNewDraftClicked (event) {
    props.shipNotificationActions.createNewOrderTemplateDraft()
  }

  let {
    shipNotificationState,
    shipNotificationActions
  } = props

  let {
    activeTab_mt: activeTab,
    html,
    active,
    editor_value_changed,
    initialRequest,
    templates = [],
    active_template = {}
  } = shipNotificationState

  html = html ? html : ''

  return (
    <div className="col-md-10">
      <div className="portlet light bordered">
        <div className="portlet-body">
          <div className="tab-content">
            <div className="tab-pane active">
              <div className="row">
                <div className="col-md-8">
                  <div style={{position: "relative"}}>
                    <div className="input-group" style={{width: "220px"}}>
                      <label className="form-control input-sm" style={{ fontSize : '13px' }} >
                        { 
                          active_template[ 'id' ] === 0 
                          ? 'New Master Template'
                          : active_template[ 'is_draft' ] 
                            ? `Draft #: ${active_template[ 'id' ]}` 
                            : `Master #: ${active_template[ 'id' ]}`
                        }
                      </label>
                      <div className="input-group-btn">
                        <button 
                          type="button" className="btn btn-topbar dropdown-toggle btn-sm" data-toggle="dropdown" 
                          aria-expanded="false" tabIndex="-1" style={{ paddingLeft: '7px', paddingRight: '7px'}}
                        >
                          <i className="fa fa-angle-down"></i>
                        </button>
                        <ul className="dropdown-menu pull-right">
                          {
                            templates.map( 
                              ({ id, is_draft }, index) => {

                                let active = active_template[ 'id' ] === id
                                return (
                                  <li
                                    key={ id }
                                    data-id={ id }
                                    data-index={ index }
                                    onClick={ onTemplateClicked }
                                    className={ classNames({ active }) }
                                  >
                                    <a className={ classNames({ sbold : active }) } >
                                      { 
                                        id === 0 
                                        ? 'New Master Template'
                                        : is_draft 
                                          ? `Draft #: ${id}` 
                                          : `Master #: ${id}`
                                      }
                                    </a>
                                  </li>    
                                )   
                              }
                            )
                          }
                        </ul>
                      </div>
                    </div>
                    {
                      active_template[ 'is_draft' ] &&
                      <button 
                        style={{position: "absolute", right: '126px', top: 0}}
                        className="btn btn-danger btn-sm"
                        onClick={ onDeleteDraftClicked }
                      >
                        <i className="fa fa-trash"></i>
                        &nbsp;
                        Delete this draft
                      </button>
                    }
                    <button 
                      style={{position: "absolute", right: 0, top: 0}}
                      className="btn btn-topbar btn-sm"
                      onClick={ onNewDraftClicked }
                    >
                      <i className="fa fa-file-text-o"></i>
                      New Draft
                    </button>
                  </div>
                  <Editor
                    value={ html }
                    handleEditorChange={ initialRequest ? onEditorChanged : () => {} }
                    shipNotificationState={ shipNotificationState }
                    shipNotificationActions={ shipNotificationActions }
                  />
                  <EditorBottomControls
                    enabled={ active }
                    value={ html }
                    shipNotificationState={ shipNotificationState }
                    shipNotificationActions={ shipNotificationActions }
                    editor_value_changed={ editor_value_changed }
                    active_template={ active_template }
                  />
                  <hr />
                  <EmailSample
                    shipNotificationState={ shipNotificationState }
                    shipNotificationActions={ shipNotificationActions }
                  />
                </div>
                <div className="col-md-4">
                  <div style={{ marginBottom : '10px' }}>
                    <Tabs
                      activeTab={ activeTab }
                      onTabClicked={ onTabClicked }
                      tabs={
                        [
                          {
                            type : 'orderLevel',
                            name : 'Order Level'
                          },
                          {
                            type : 'lineLevel',
                            name : 'Line Level'
                          }
                        ]
                      }
                    />
                  </div>
                  <KeywordsTable activeTab={ activeTab } />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="modal modal-themed fade"
        data-backdrop="static"
        id="delete-order-template-draft" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title">Delete Draft</h4>
            </div>
            <div className="modal-body">
              Are you sure to delete this draft ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-danger"
                onClick={ onDeleteDraftConfirmed }
              >Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

TemplateEditors.propTypes = {
  shipNotificationState: PropTypes.object.isRequired,
  shipNotificationActions: PropTypes.object.isRequired,
}

export default TemplateEditors