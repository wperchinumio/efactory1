import React from 'react'

const Uploading = () => {
  return (
    <div id="upload-file-dialog">
      <div className="upload-file-dialog-inner">
        <div className="uploading-bar-container">
          <div className="uploading-bar-wrapper">
            <div className="uploading-bar" id="uploading-bar"></div>
            <div className="uploading-percentage">
              <span id="uploading-percentage">
                %0
              </span>
              UPLOADED
            </div>
            <div className="server-processing-message">
              Processing file. Please wait for the server response.
            </div>
            <div className="dismiss-uploading" id="dismiss-uploading">
              X
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Uploading)