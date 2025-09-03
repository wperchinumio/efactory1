import React, { useState, useEffect } from 'react'
import PageBar from './PageBar'
import { getAuthData } from '../../../util/storageHelperFuncs'
import moment from 'moment'
import global from 'window-or-global'
import config from '../../../util/config'
import OrderDetails from '../../DetailPages/OrderDetail/_Content'

const Content = props => {
  const [radioMassUpload, setRadioMassUpload] = useState('verify')

  useEffect(
    () => {
      global.Dropzone.autoDiscover = false
      global.$('#massupload-dropzone').dropzone({
        url: `${config.host}/api/upload`,
        acceptedFiles: ".xlsx",
        uploadMultiple: false,
        dictDefaultMessage: "<h3 class='sbold'>Drop files here or click to upload</h3><p> Once the file is dropped or select, the upload process will start immediately. </p>",
        maxFiles: 1,
        self: this,
        init: function () {
          this.on("sending", function (file, xhr, formData) {
            xhr.setRequestHeader("X-Access-Token", getAuthData().api_token)
            xhr.setRequestHeader("X-Upload-Params", JSON.stringify(
              {
                func: "mass_upload",
                environment: global.$("input:radio[name='radio_mass_upload']:checked").val()
              }
            ))
          })

          this.on("error", (file, response) => {
            let error_message = response.error_message ? response.error_message : response
            onComplete( file, error_message, this.removeFile.bind(this) )
          })
          this.on("complete", function (file) {
            if (file.status === 'error') {
              return 
            }
            let date_str = moment( new Date() ).format("MM/DD/YYYY h:mmA")
            let message = `${date_str} : <span class='text-success'>Success</span>`
            onComplete( file, message, this.removeFile.bind(this) )
          })
        }
      })
    },
    []
  )

  function handleMassUploadRadioInput (event, typeOfRadioInput) {
    setRadioMassUpload(typeOfRadioInput)
  }

  function onComplete (file, message, removeFile) {
    let logNode = global.$('#upload-log')
    if (logNode.attr('data-init') === 'true') {
      logNode.html(message)
      logNode.attr('data-init', 'false')
    } else {
      let prev = logNode.html()
      logNode.html(message + "<br/>" + prev)
    }
    var removeButton = global.Dropzone.createElement("<a href='javascript:' class='btn red btn-sm btn-block' style='margin-top:5px'>Remove</a>")
    // Listen to the click event
    removeButton.addEventListener("click", event => {
      // Make sure the button click doesn't submit the form:
      event.preventDefault()
      event.stopPropagation()
      // Remove the file preview.
      removeFile(file)
    })
    // Add the button to the file preview element.
    file.previewElement.appendChild(removeButton)
  }

  function clearLogMessages () {
    global.$('#upload-log').html('Log messages will appear here once you have uploaded the excel order batch file.')
  }

  let { location } = props
  let isOrderDetailDisplay  = false
  if( location && location.search && location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }
  return (
    <div>
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
        <PageBar />
        <div className="container-page-bar-fixed row mass_upload_help">
          <div className="col-md-12">
            <div className="m-heading-1 border-green m-bordered">
              <h3>About Mass Upload</h3>
              <p> We provide 2 different Excel templates in order for you to upload a batch of orders.
                With <strong>Template 1</strong> you need to provide the full order info in one single excel row. With <strong>Template 2 </strong>, on the other hand, you need to provide the full line info in one single row.
              </p>
              <div className="templates">
                <p>
                  <a
                    href={`/src/templates/Template_1.xlsx`}
                    download="Template_1.xlsx"
                    onClick={ event => {
                      event.preventDefault()
                      document.querySelector('#template1-hidden').click()
                    } }
                  >Template 1</a> (one order per excel row)
                </p>
                <p>
                  <a
                    href={`/src/templates/Template_2.xlsx`}
                    download="Template_2.xlsx"
                    onClick={ event => {
                      event.preventDefault()
                      document.querySelector('#template2-hidden').click()
                    } }
                  >Template 2</a> (one line per excel row)
                </p>
                <p className="hidden">
                  <a href={`/src/templates/Template_1.xlsx?${( new Date() ).getTime()}`} download="Template_1.xlsx" id='template1-hidden' />
                  <a href={`/src/templates/Template_2.xlsx?${( new Date() ).getTime()}`} download="Template_2.xlsx" id='template2-hidden' />
                </p>
              </div>
              <h3>Available options</h3>
              <p />
              <ul className="mass_upload">
                <li><strong>Verify Only:</strong> This option will only verify that the uploaded file is correct. No other operation are taken by DCL.</li>
                <li><strong>Sandbox:</strong> This option will verify the uploaded file and import into the sandbox upon success. You will need to contact DCL customer support if you need to move any order from the sandbox to the production server.</li>
                <li><strong>Production:</strong> This option will verify the uploaded file and import into the production server sandbox upon success.</li>
              </ul>
              <p>
                <span className="label label-danger">NOTE:</span> &nbsp; Partial upload is not allowed: all orders must be valid or we will reject the whole batch. Required fields are marked in <strong>bold</strong> in the template files.
              </p>
            </div>
            <div className="mass_upload_options">
              <div className="row">
                <div className="col-sm-4">
                  <div className="md-radio"
                       onChange={ event => { handleMassUploadRadioInput( event, 'verify' ) }  }>
                    <input type="radio" id="radio_mu_verify" name="radio_mass_upload" className="md-radiobtn" value="verify" checked={ radioMassUpload === 'verify' } onChange={ ()=>{} }/>
                      <label htmlFor="radio_mu_verify">
                        <span className="inc"></span>
                        <span className="check"></span>
                        <span className="box"></span> Verify Only
                      </label>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="md-radio"
                       onChange={ event => { handleMassUploadRadioInput( event, 'sandbox' ) }  }>
                    <input type="radio" id="radio_mu_sandbox" name="radio_mass_upload" className="md-radiobtn" value="sandbox" checked={ radioMassUpload === 'sandbox' } onChange={ ()=>{} }/>
                      <label htmlFor="radio_mu_sandbox">
                        <span className="inc"></span>
                        <span className="check"></span>
                        <span className="box"></span> Sandbox
                      </label>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div 
                    className="md-radio"
                    onChange={ event => { handleMassUploadRadioInput( event, 'production' )} }
                  >
                    <input type="radio" id="radio_mu_production" name="radio_mass_upload" className="md-radiobtn" value="production" checked={ radioMassUpload === 'production' } onChange={ ()=>{} }/>
                      <label htmlFor="radio_mu_production">
                        <span className="inc"></span>
                        <span className="check"></span>
                        <span className="box"></span> Production
                      </label>
                  </div>
                </div>
              </div>
            </div>
            <form className="dropzone dropzone-file-area" id="massupload-dropzone" autoComplete="off" />
            <div id="log_mass_upload">
              <div className="title">
                Log messages
                <button
                  role="button"
                  className="clear-log btn btn-danger btn-outline btn-xs"
                  onClick={ clearLogMessages }
                >Clear log messages</button>
              </div>
              <div className="body" id="upload-log" data-init="true">
                Log messages will appear here once you have uploaded the excel order batch file.
              </div>
            </div>
          </div>
        </div>
      </div>
      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
    </div>
  )
}

export default Content