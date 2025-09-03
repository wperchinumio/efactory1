import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Folder from './Folder'

const TreeViewMain = ({
  checkedRows,
  folderTree: folderTreeReceived,
  loadSubfolders,
  selectedFolderId,
  setSelectedFolderId,

}) => {
  const [loadingId, setLoadingId] = useState(-1)
  const [folderTree, setFolderTree] = useState(folderTreeReceived)

  function createFolderTree ( folder = {}, parent_ids = [] ) {
    let tree = []
    let { id, list_id, parent_id, name } = folder.data
    tree.push( <Folder 
        selected={ id === selectedFolderId }
        disabled={ checkedRows[id] !== undefined ? true : false }
        open={ folder.open }
        name={ name }
        key={'folder'+id}
        handleClick={ (event) => {
          setSelectedFolderId( String(list_id).startsWith('root') ? null : id, list_id )
          if( !String(id).startsWith('root') && !folder.subfolders ){
            parent_id = parent_id === '' ? null : id
            setLoadingId(id)
            loadSubfolders({ 
              parent_id,
              list_id,
              path : [...parent_ids, id] }
            ).then(
              () => setLoadingId(-1)
            )
          }
          if( folder.open && folder.data.list_id && !isNaN(folder.data.list_id) ){
            delete folder.subfolders
          }
          let folderTreeNext = { ...folderTree }
          let scopeOfFolders = parent_ids.reduce( 
            (prev, next) => prev[next] ? prev[next] : prev.subfolders[next] , folderTreeNext 
          )
          let folderToModify = scopeOfFolders[id] || scopeOfFolders.subfolders[id]
          folderToModify.open = !folderToModify.open
          setFolderTree(folderTreeNext)
        } }
      />
    )
    
    if( folder.open  ){
      let { subfolders } = folder
      if(  subfolders &&  Object.keys( subfolders ).length ){
        Object.keys( subfolders ).forEach( subfolderKey => {
          let subfolderTree = createFolderTree( subfolders[ subfolderKey ], [...parent_ids, id] )
          tree.push( <ul key={subfolderKey}>{ subfolderTree }</ul> )
        } )
      }else{
        tree.push( 
          <ul key={`folder-children-${id}`}>
            <Folder  
              key={'folder-child-'+id}
              loading={ loadingId === id }
              empty={true}
              checkedRows={ checkedRows }
              folderID={ id }
            />
          </ul> )
      }   
    }

    return <li key={id} > { tree } </li>
  }

  return (
    <div className="treeview-efactory">
      <ul>
        { 
          Object.values( folderTree ).map( 
            folder => createFolderTree( folder )
          )
        }
      </ul>
    </div>
  )
}

TreeViewMain.propTypes = {
  name: PropTypes.string,
  folderTree : PropTypes.objectOf( PropTypes.shape({
    subfolders : PropTypes.objectOf( PropTypes.object ),
    open : PropTypes.bool,
    selected : PropTypes.bool
  }) ).isRequired,
  selectedFolderId : PropTypes.any,
  setSelectedFolderId : PropTypes.func.isRequired,
  loadSubfolders : PropTypes.func.isRequired
}

export default TreeViewMain