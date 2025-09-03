import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import ConfirmationModal from '../OrderEntry/Modals/Confirm'

const ImportAddressesModal = props => {
  const uploadNode = useRef(null)
  const firstRun = useRef(true)
  const [file, setFile] = useState('')
  const [filename, setFilename] = useState('')
  const [radioInputValue, setRadioInputValue] = useState('donotoverwrite')

  const handleModalOpening = useCallback(
    () => {
      setFile('')
      setFilename('')
      setRadioInputValue('donotoverwrite')
      uploadNode.current.value = ''
      global.$(".draggable-modal").css({ top : '0px', left : '0px' })
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#import-addresses').on('show.bs.modal', handleModalOpening )
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$('#import-addresses').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.allAddresses.importedAddresses) {
        global.$('#import-addresses').modal('hide')
      }
    },
    [props.allAddresses.importedAddresses]
  )

  function uploadFile (event) {
    setFilename(event.target.files[0] ? event.target.files[0].name : '')
    setFile(event.target.files[0] || '')
  }

  function onRadioInputChange (event) {
    setRadioInputValue(event.target.value)
  }

  function onSubmit (event) {
    if (!file || !radioInputValue) {
      return 
    }
    if (radioInputValue === 'clean') {
      return global.$('#confirm-clean-import').modal('show')
    }
    props.addressActions.importAddress(file, radioInputValue)
  }

  function onCleanImportConfirmed (event) {
    if (!file || !radioInputValue) {
      return
    }
    props.addressActions.importAddress(file, radioInputValue)
  }

  return (
    <div>
      <div 
        className="modal  modal-themed fade draggable-modal" 
        id="import-addresses" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">           
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>   
              <h4 className="modal-title"> Import Contacts </h4>                       
            </div>
            <div className="modal-body" style={{marginBottom: "20px"}}>
               If you'd like to import customer information (e.g. an existing address book), you can provide your data in our standard Excel file format.
               <div className="templates">              
                  <a
                    href={`/src/templates/Addressbook_template.xlsx`}
                    download="Addressbook_template.xlsx"
                    onClick={ event => {
                      event.preventDefault()
                      document.querySelector('#addresstemplate-hidden').click()
                    } }
                  >Download template</a>                              
                <p className="hidden">
                  <a href={`/src/templates/Addressbook_template.xlsx?${( new Date() ).getTime()}`} download="Addressbook_template.xlsx" id='addresstemplate-hidden'></a>                  
                </p>
               </div>
               <p style={{marginTop:0}}>
                 <span className="label label-danger">NOTE:</span>&nbsp;Required fields are marked in <strong>bold</strong> in the template file. Contacts must have a unique "title".
               </p> 
               <ol>
                 <li>
                    <span className="sbold">Select the file to import</span>
                    <br/>
                    <div style={{margin: "5px 0 10px 0"}}>
                      <input 
                        type="file"
                        id="my_file"
                        ref={uploadNode}
                        onChange={ uploadFile }
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        style={{ display : "none" }} 
                      />
                      <button type="button"
                        className="btn btn-topbar btn-sm"          
                        onClick={ event => uploadNode.current.click() }><i className="fa fa-file-excel-o"></i>Browse...
                      </button> <span> { filename } </span>
                    </div>
                 </li>
                 <li>
                   <span className="sbold">Choose an option</span>
                   <ul style={{listStyle: "none", padding: 0}}>
                     <li>
                      <div className="mt-radio-list">
                        <label className="mt-radio mt-radio-line">
                          <input 
                            type="radio" 
                            name="optionAddressBook" 
                            value="donotoverwrite" 
                            checked={ radioInputValue ===  'donotoverwrite' }
                            onChange={ onRadioInputChange }
                          /> 
                          <div style={{display: "inline"}} className="sbold">
                            Import only new contacts:
                          </div> This option will only import new contacts, leaving the existing ones unchanged
                          <span></span>
                        </label>
                        <label className="mt-radio mt-radio-line">
                          <input 
                            type="radio" 
                            name="optionAddressBook" 
                            value="overwrite"
                            checked={ radioInputValue ===  'overwrite' }
                            onChange={ onRadioInputChange }
                          />
                          <div style={{display: "inline"}} className="sbold">Import all contacts:</div> This option will import new contacts and update the existing ones
                          <span></span>
                        </label>
                        <label className="mt-radio mt-radio-line">
                          <input 
                            type="radio" 
                            name="optionAddressBook" 
                            value="clean" 
                            checked={ radioInputValue ===  'clean' }
                            onChange={ onRadioInputChange }
                          />
                          <div style={{display: "inline"}} className="sbold">Delete &amp; Import:</div> This option will delete the existing address book before importing the new contacts from file
                          <span></span>
                        </label>
                      </div>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
            <div className="modal-footer" style={{ marginTop : '-40px' }} >              
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
              <button 
                type="button" 
                className="btn green-soft" 
                disabled={ !filename }
                onClick={ onSubmit }
              >
                <i className="fa fa-upload">
                </i> Import Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        confirmationMessage="Are you sure to 'Delete &amp; Import'? This option will remove all previous contacts and import the new ones from the Excel file."
        onConfirmHandler={ onCleanImportConfirmed }
        id="confirm-clean-import"
      />
    </div>
  )
}

ImportAddressesModal.propTypes = {
  addressActions: PropTypes.object.isRequired,
  allAddresses: PropTypes.object.isRequired,
}

export default ImportAddressesModal