import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { getAuthData } from '../../util/storageHelperFuncs'

const DocumentsBar = ({
  actions,
  controlsDisabledOnRoot,
  pathname,
}) => {
  const uploadNode = useRef(null)
  function uploadFile (event) {
    if (event.target.value !== '') {
      let file = event.target.files[0]
      actions.uploadDocument( file )
      event.target.value = ''
    }
  }
  let allDisabled = pathname !== "/documents" && 
    pathname !== "/ftp-folders/send" &&
    !pathname.includes('special-docs') &&
    pathname !== "/orderpoints/documents/ftp-folders-send" && 
    (
      !getAuthData().user_data.is_local_admin || 
      pathname.includes("/documents/reference") 
    )

  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "35px"}}>
          <span className="caption-subject font-green-seagreen sbold">
            <i className="fa fa-folder-open-o"></i> DOCUMENTS
          </span>
        </div>
      </div>
      {
        !allDisabled &&
        <div className="page-toolbar">
          <a data-toggle="modal" href="#create_folder_modal">
            <button
              type="button"
              className="btn dark btn-sm"
              disabled={ controlsDisabledOnRoot }
              id="address-cancel-btn"
            >
              <i className="fa fa-folder"></i> Create folder
            </button>
          </a>
          <input 
            type="file"
            id="my_file"
            ref={ uploadNode }
            onChange={ event => uploadFile(event) }
            style={{ display : "none" }} 
          />
          <button 
            type="button"
            className="btn dark btn-sm"
            disabled={ controlsDisabledOnRoot }
            onClick={ event => uploadNode.current.click() }
            style={{marginLeft:"10px"}}
            id="address-save-btn"
          >
            <i className="fa fa-file-o"></i> Add document
          </button>
        </div>
      }
    </div>
  )
}

DocumentsBar.propTypes = {
  actions: PropTypes.object.isRequired,
  list_id: PropTypes.any,
  pathname: PropTypes.string,
  controlsDisabledOnRoot: PropTypes.bool
}

export default DocumentsBar