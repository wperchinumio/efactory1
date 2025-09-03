import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import global from 'window-or-global'

const SingleInputModal = props => {
  const inputNode = useRef(null)
  const keyIndex = useRef(1)

  const focusInput = useCallback(
    () => {
      setTimeout( () => inputNode.current.focus(), 1000 )
    },
    []
  )

  useEffect(
    () => {
      global.$(`#${props.id}`).on('show.bs.modal', focusInput)
      return () => {
        global.$(`#${props.id}`).off('show.bs.modal', focusInput)
      }
    },
    []
  )

  function onSubmit (event) {
    event.preventDefault()
    let { submitHandler, id } = props
    let inputValue = inputNode.current.value
    if( inputValue.trim().length ){
      submitHandler(inputValue)
      global.$(`#${id}`).modal('hide')
      inputNode.current.value = ''
    }
  }

  function getSelectedItem() {
    let checkedRowId = props.checkedRows ? ( Object.keys(props.checkedRows)[0] ) : ''
    let selectedItem
    if( props.list ){
      selectedItem = props.list.filter((item)=>{
        return item.id===checkedRowId
      })[0]
    }
    return selectedItem
  }

  function getFileName() {
    let selectedItem = getSelectedItem()
    if (!selectedItem) return ''
    if ( selectedItem.is_folder ) return selectedItem.name
    let dotIndex = selectedItem.name.lastIndexOf(".")
    dotIndex = dotIndex < 0 ? selectedItem.name.length : dotIndex
    return selectedItem.name.substr(0, dotIndex)
  }

  function getExtention() {
    let selectedItem = getSelectedItem()
    if (! selectedItem || selectedItem.is_folder ) return ''
    let dotIndex = selectedItem.name.lastIndexOf(".")
    dotIndex = dotIndex < 0 ? selectedItem.name.length : dotIndex
    return selectedItem.name.substr(dotIndex)
  }

  let {
    title,
    inputLabel,
    submitBtnName,
    placeholder,
    id,
    isExtension
  } = props
  keyIndex.current += 1
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id={ id }
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form role="form" onSubmit={onSubmit} autoComplete="off">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title"> { title } </h4>
            </div>
            <div className="modal-body">
              <div className="form-body">
                <div className="form-group">
                  <label> { inputLabel } </label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-edit"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      required
                      key={keyIndex.current}
                      ref={inputNode}
                      defaultValue={ getFileName(isExtension) }
                      placeholder={ placeholder } />
                     {
                      isExtension &&
                      getExtention() &&
                      <span className="input-group-addon input-group-addon-themed" id="basic-addon3">{getExtention() || ''}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
              <button type="submit" className="btn green"> { submitBtnName } </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

SingleInputModal.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  inputLabel: PropTypes.string.isRequired,
  submitBtnName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isExtension: PropTypes.bool
}

SingleInputModal.defaultProps = {
  isExtension: false
}

export default SingleInputModal