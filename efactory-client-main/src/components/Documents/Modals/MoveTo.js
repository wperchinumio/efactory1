import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TreeView from '../TreeView/_Content'
import { getAuthData } from '../../../util/storageHelperFuncs'

const MoveToModal = ({
  checkedRows,
  loadedSubfolders,
  loadSubfolders,
  movedFile,
  replaceIfExist,
  selectedFolderId,
  setReplaceIfExistValue,
  setRootReduxProperty,
  setSelectedFolderId,
  submitHandler,
  TreeviewConfig,
}) => {
  const firstRun = useRef([true, true])
  const [folderTree, setFolderTree] = useState(createDefaultFolderTree())

  const refreshFolderTree = useCallback(
    () => {
      setFolderTree(createDefaultFolderTree())
    },
    []
  )

  const resetFolderId = useCallback(
    () => {
      setRootReduxProperty({
        selectedFolderId : null
      })
    },
    []
  )

  useEffect(
    () => {
      global.$(`#moveto-document`).on('hide.bs.modal', refreshFolderTree)
      global.$(`#moveto-document`).on('show.bs.modal', resetFolderId )
      return () => {
        global.$(`#moveto-document`).off('hide.bs.modal', refreshFolderTree)
        global.$(`#moveto-document`).off('show.bs.modal', resetFolderId )
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (!loadedSubfolders) {
        return
      }
      let scopeOfFolders = loadedSubfolders.path.reduce(
        (prev, next) => prev[next] ? prev[next] : prev.subfolders[next],
        { ...folderTree }
      )
      scopeOfFolders.subfolders = {}
      if( loadedSubfolders.subfolders.length ){
        loadedSubfolders.subfolders.forEach( folder => {
          let { id, list_id, parent_id, name } = folder
          parent_id = parent_id ? parent_id : id
          scopeOfFolders.subfolders[ folder.id ] = {
            data : { id, list_id, parent_id, name },
            open : false
          }
        } )
      }
    },
    [loadedSubfolders]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (!movedFile) {
        return
      }
      refreshFolderTree()
    },
    [movedFile]
  )

  function createDefaultFolderTree () {
    let folderTree = {}
    // in order to deep copy without reference issues
    let TreeviewConfigCopy = JSON.parse(JSON.stringify(TreeviewConfig))
    let BreakException = {}
    try {
      Object.keys(TreeviewConfigCopy).forEach(
        (groupName, index) => {
          let subfolders = {}
          TreeviewConfigCopy[groupName].forEach(folder => {
            subfolders[folder.listId] = {
              data: {
                id: folder.listId,
                list_id: folder.listId,
                parent_id: '',
                name: folder.title
              },
              open: false
            }
          })
          folderTree[groupName] = {
            data: {
              id: groupName,
              list_id: `root-${index}`,
              parent_id: `root-${index}`,
              name: groupName
            },
            open: false,
            subfolders
          }
          // Don't show parent folder for first document (make first child as parent)
          // Don't show rest of the libraries (exit loop)
          if (index === 0 && !getAuthData().user_data.is_local_admin) {
            folderTree = subfolders
            throw BreakException
          }
        }
      )
    } catch (e) {
      if (e !== BreakException) throw e
    }
    return folderTree
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="moveto-document"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Select where to move this file / directory</h4>
          </div>
          <div className="modal-body">
            <TreeView
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={ setSelectedFolderId }
              folderTree={ folderTree }
              loadSubfolders={ loadSubfolders }
              checkedRows={ checkedRows }
            />
          </div>

          <div className="modal-footer">
            <label className="mt-checkbox">
              <input
                type="checkbox"
                id="inlineCheckbox2"
                checked={replaceIfExist}
                onChange={event => setReplaceIfExistValue({ replaceIfExist : !replaceIfExist})}
              />
                Replace If Exists
              <span></span>
            </label>
            <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              disabled={ selectedFolderId === null }
              onClick={ event => submitHandler() }>
              Move
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

MoveToModal.propTypes = {
  breadcrumbsProps : PropTypes.object,
  selectedFolderId : PropTypes.any,
  setSelectedFolderId : PropTypes.func.isRequired,
  loadSubfolders : PropTypes.func.isRequired,
  loadedSubfolders : PropTypes.any,
  setReplaceIfExistValue : PropTypes.func.isRequired,
  replaceIfExist : PropTypes.bool.isRequired,
  movedFile : PropTypes.any,
  setRootReduxProperty : PropTypes.func.isRequired,
  TreeviewConfig : PropTypes.any.isRequired
}

export default MoveToModal