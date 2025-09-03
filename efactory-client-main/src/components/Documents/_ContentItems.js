import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DocumentTableBody from './TableBody'
import Bar from './Bar'
import ContentBar from './ContentBar'
import Pagination from './Pagination'
import Breadcrumbs from './Breadcrumbs'
import SingleInputModal from '../_Shared/SingleInputModal'
import DeleteModal from './Modals/Delete'
import MoveToModal from './Modals/MoveTo'
import PreviewVideoModal from './Modals/PreviewVideo'
import * as documentActions from './redux/documentRecords'
import Config, { TreeviewConfig_Items } from './_Config'
import Popup from '../_Shared/Popup'

const DocumentPageBody = ({
  checkedRows,
  documentActions,
  document_sort,
  error,
  list,
  location: { pathname },
  loadedSubfolders,
  movedFile,
  page_number,
  page_size,
  replaceIfExist,
  selectedFolderId,
  watchVideoData,
}) => {
  const firstRun = useRef(true)
  let currentConfig = useRef(Config[pathname])
  useEffect(
    () => {
      onRouteChange()
    },
    [pathname]
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      global.$('#documents_error').modal('show')
    },
    [error]
  )

  function setGetListParams (parent_id = null ) {
    documentActions.setListParams({
      list_id : currentConfig.current.listId,
      parent_id,
      page_number : 1
    })
  }

  function fetchList ( filter = '' ) {
    documentActions.getlistAsync( filter )
  }

  function onRouteChange () {
    setCurrentConfig()
    setGetListParams()
    documentActions.toggleCheckedRow(undefined, true) // empty checked rows
    fetchList()
  }

  function setCurrentConfig () {
    currentConfig.current = Config[ pathname ]
  }

  function paginate (pageNumber) {
    documentActions.setPagination( pageNumber )
    documentActions.getlistAsync()
  }

  function onBreadcrumbClick (id) {
    setGetListParams(id)
    fetchList()
  }

  return (
    <div className="orders-documents">

      <Bar 
        actions={ documentActions } 
        list_id={currentConfig.current.listId} 
        pathname={ pathname }
      />

      <div className="container-page-bar-fixed">
        <div className="portlet light bordered">

          <ContentBar
            actions={ documentActions }
            activeListId={ currentConfig.current.listId }
            deleteDisabled={ Object.keys(checkedRows).length === 0 }
            renameDisabled={ Object.keys(checkedRows).length !== 1 }
            name={ currentConfig.current.title }
            pathname={ pathname }
          />

          <Breadcrumbs
            rootPath={ currentConfig.current.title }
            breadcrumbs={ list ? list.breadcrumb : [] }
            onBreadcrumbClick={ onBreadcrumbClick }
          />

          <div className="portlet-body">
            <div className="table-responsive">
            <DocumentTableBody
              tableData={ list ? list.list : [] }
              sortTable={ document_sort }
              setGetListParams={ setGetListParams }
              checkedRows={checkedRows}
              activePagination={page_number}
              page_size={page_size}
              actions={documentActions}/>
            </div>
          </div>

          <Pagination
            paginate={ paginate }
            totalDocuments={ list ? list.total : 0 }
            activePagination={page_number}
            page_size={page_size} />
        </div>
      </div>

      <SingleInputModal
        submitHandler={ name => documentActions.renameFolder( name )  }
        checkedRows={checkedRows}
        list={list.list}
        title="Rename document"
        inputLabel="Name"
        submitBtnName="Rename"
        placeholder="Type the document name"
        id="rename_modal"
        isExtension={true}
      />

      <SingleInputModal
        submitHandler={ name => documentActions.createFolder( name )  }
        title="Create folder"
        inputLabel="Name"
        submitBtnName="Create"
        placeholder="Type the folder name"
        id="create_folder_modal"
      />

      <DeleteModal submitHandler={ () => documentActions.deleteFolder() }/>

      {
        error &&
        <Popup
          title={ 'Error' }
          description={  error }
          modalId="documents_error"
          isError={ true }
        />
      }

      <MoveToModal
        breadcrumbsProps={{
          rootPath : currentConfig.current.title,
          breadcrumbs : list ? list.breadcrumb : [],
          onBreadcrumbClick : onBreadcrumbClick
        }}
        TreeviewConfig={ TreeviewConfig_Items }
        movedFile={movedFile}
        setReplaceIfExistValue={ documentActions.setRootStatePropertyDocuments }
        replaceIfExist={replaceIfExist}
        submitHandler={ event => documentActions.moveFolder() }
        loadedSubfolders={ loadedSubfolders }
        loadSubfolders={ documentActions.loadSubfolders }
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={ (id, list_id) => documentActions.setSelectedFolderId( id, list_id ) }
        checkedRows={ checkedRows }
        setRootReduxProperty={ documentActions.setRootStatePropertyDocuments }
      />

      <PreviewVideoModal 
        watchVideoData={ watchVideoData }
        documentActions={ documentActions }
      />
    </div>
  )
}

export default connect(
  state => ({
    list : state.documents.documents.list,
    checkedRows : state.documents.documents.checkedRows,
    page_number : state.documents.documents.page_number,
    page_size : state.documents.documents.page_size,
    error : state.documents.documents.error,
    selectedFolderId : state.documents.documents.selectedFolderId,
    loadedSubfolders : state.documents.documents.loadedSubfolders,
    document_sort : state.documents.documents.document_sort,
    replaceIfExist : state.documents.documents.replaceIfExist,
    movedFile : state.documents.documents.movedFile,
    watchVideoData : state.documents.documents.watchVideoData
  }),
  dispatch => ({
    documentActions : bindActionCreators(documentActions, dispatch )
  })
)(DocumentPageBody)