import React from 'react'
import history from '../../../history'

const SettingsBar = ({
  viewName,
  discardChanges,
  toggleSaveAsPopupVisibility,
  saveAsync,
  rootPath,
  deleteViewAsync,
  settings,
  isOneOfDefaultViews
}) => {
    return (
      <div className="page-bar" style={{ margin : '0', paddingLeft: '0px' }}>
        <div className="page-breadcrumb">
          <div className="caption" style={{marginLeft:"20px"}}>
            <i className="icon-grid font-dark" style={{marginRight:"5px"}}></i>
            <span className="caption-subject font-green-seagreen sbold">
              VIEW: </span>
              <strong>{viewName}</strong>
          </div>
        </div>
        <div className="page-toolbar">
          <div className="btn-group">
            <button type="button"
              onClick={(e)=>{
                discardChanges()
                history.push(rootPath)
              }}
              className="btn btn-sm btn-default">
              Cancel
            </button>
          </div>
          |
          <div className="btn-group" style={{marginRight:"5px"}}>
            { 
              isOneOfDefaultViews 
              ? <button type="button" disabled={true} className="btn dark btn-sm btn-default">Save</button>
              : <button 
                  type="button" 
                  className="btn dark btn-sm btn-default"
                  onClick={()=>{
                    saveAsync(settings.loadedDetails, settings.selectedFields);
                  } }
                > 
                  Save
                </button>
              
            }
          </div>
          <div className="btn-group" style={{marginRight:"5px"}}>
            <a className="btn dark btn-sm" data-toggle="modal" href="#save_view"
              onClick={ (e)=>{
                e.preventDefault()
                toggleSaveAsPopupVisibility()
              }}
            >
              <i className="fa fa-save"></i> Save as...
            </a>
          </div>
          <div className="btn-group">
            { 
              isOneOfDefaultViews 
              ? <a className="btn btn-sm btn-danger" disabled={true}> Delete </a>
              : <a 
                  className="btn btn-sm btn-danger"
                  data-toggle="modal"
                  href="#delete_view"
                >
                  Delete
                </a>
            }
          </div>
        </div>
      </div>
    )
}

export default SettingsBar