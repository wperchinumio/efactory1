import React from 'react'
import FormatDate from '../_Helpers/FormatDate'
import classNames from 'classnames'

const DocumentTableBody = ({
  actions,
  activePagination,
  checkedRows = [],
  modifiedByHidden,
  page_size,
  setGetListParams,
  sortTable,
  tableData = []
}) => {
  function classIconNameFuc (mime) {
    var classIconName = ''
    switch (mime) {
      case 'application/pdf':
        classIconName = 'fa fa-file-pdf-o font-red-soft'
        break
      case 'application/excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        classIconName = 'fa fa-file-excel-o font-green-jungle'
        break
      case 'application/x-msg':
        classIconName = 'fa fa-envelope-o font-yellow'
        break
      case 'application/word':
        classIconName = 'fa fa-file-word-o font-blue-soft'
        break
      case 'image/jpeg':
      case 'image/png':
      case 'image/bmp':
      case 'image/gif':
        classIconName = 'fa fa-file-image-o font-green-soft'
        break
      case 'text/plain':
        classIconName = 'fa fa-file-text font-grey-mint'
        break
      case 'video/mp4':
        classIconName = 'fa fa-file-video-o font-blue-steel'
        break
        case 'text/html':
        case 'text/htm':
        case 'text/xml':
        classIconName = 'fa fa-file-code-o font-blue-madison'
          break
        case 'application/x-zip-compressed':
          classIconName = 'fa fa-file-zip-o font-yellow-crusta'
          break
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        classIconName = 'fa fa-file-word-o font-blue-soft' // todo replace the classname
        break
      default:
        classIconName = 'fa fa-file-o'
    }
    return classIconName
  }

  function isAllChecked () {
    if (tableData.length ) {
      return tableData.length === Object.keys(checkedRows).length
    }
    return false
  }

  function onAllCheckedChange () {
    let allChecked = isAllChecked()
    const allCheckedNext = allChecked ? 'none' : 'all'
    actions.toggleAllRowsChecked(allCheckedNext)
  }

  let allChecked = isAllChecked()

  return (
    <table className="table table-striped table-hover order-column table-clickable documents-table">
      <thead>
        <tr className="uppercase bg-dark">
          <th className="font-grey-salt" style={{width:"40px"}} >
            <label className="mt-checkbox mt-checkbox-outline">
              <input
                type="checkbox"
                checked={ allChecked }
                onChange={ onAllCheckedChange }
              />
                <span></span>
            </label>
          </th>
          <th className="font-grey-salt" style={{width:"60px"}} >
            #
          </th>
          <th className="font-grey-salt"  style={{width:"60px"}}> Type </th>
          <th className="font-grey-salt" >
            <span className="column-sort"><i className={ classNames({
              'fa fa-long-arrow-up' : true,
              'active' : sortTable['order_name'] === "asc" ? true : false
            }) } aria-hidden="true"></i></span>
            <span className="column-sort column-sort-up"><i className={ classNames({
              'fa fa-long-arrow-down' : true,
              'active' : sortTable['order_name'] === "desc" ? true : false,
            }) } aria-hidden="true"></i></span>

            <a className="font-grey-salt" onClick={ () => {
              actions.setDocumentSort({ order_name : sortTable['order_name'] ?
                (sortTable['order_name'] === 'asc' ? 'desc' : 'asc') : 'asc'  })
            }}>
              Name
            </a>
          </th>
          <th className="font-grey-salt" > 
            <span className="column-sort"><i className={ classNames({
              'fa fa-long-arrow-up' : true,
              'active' : sortTable['order_modifiedat'] === "asc" ? true : false
            }) } aria-hidden="true"></i></span>
            <span className="column-sort column-sort-up"><i className={ classNames({
              'fa fa-long-arrow-down' : true,
              'active' : sortTable['order_modifiedat'] === "desc" ? true : false,
            }) } aria-hidden="true"></i></span>

            <a className="font-grey-salt" onClick={ () => {
              actions.setDocumentSort({ order_modifiedat : sortTable['order_modifiedat'] ?
                (sortTable['order_modifiedat'] === 'asc' ? 'desc' : 'asc') : 'asc'  })
            }}>
            Modified
            </a>
          </th>
          {
            !modifiedByHidden &&
            <th className="font-grey-salt" > Modified By </th>
          }
          <th className="font-grey-salt text-right" >
            <span className="column-sort"><i className={ classNames({
              'fa fa-long-arrow-down' : true,
              'active' : sortTable['order_size'] === "asc" ? true : false,
            }) } aria-hidden="true"></i></span>
            <span className="column-sort column-sort-up"><i className={ classNames({
              'fa fa-long-arrow-up' : true,
              'active' : sortTable['order_size'] === "desc" ? true : false,
            }) } aria-hidden="true"></i></span>
            <a className="font-grey-salt" onClick={ () => {
              actions.setDocumentSort({ order_size : sortTable['order_size'] ?
                (sortTable['order_size'] === 'asc' ? 'desc' : 'asc') : 'asc'  })
            }}>
              Size
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        { tableData && 
          tableData.map((row, index) => {

            let {
              is_folder,
              mime,
              id,
              name,
              updated_at,
              username,
              company_code,
              list_id
            } = row

            let typeClassName = is_folder
                                ? 'fa fa-folder-open font-yellow-lemon'
                                : classIconNameFuc( mime )

            let isVideo = typeClassName.includes('video')

            return (
              <tr className="odd gradeX clickable-row" key={index}>
                <td>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={ checkedRows[ id ] ? true : false }
                      onChange={ event => actions.toggleCheckedRow( id ) }/>
                    <span></span>
                  </label>
                </td>
                <td>
                  { 
                    ( ( activePagination - 1 ) * page_size ) + index + 1 
                  }
                </td>
                <td>
                  <i 
                    className={ typeClassName }
                  ></i>
                  { row.type}
                </td>
                <td>
                  { is_folder ?
                    <a
                      href="#"
                      onClick={ event => {
                        setGetListParams( id )
                        actions.getlistAsync()
                      }}
                    >
                    { name }
                    </a> :
                    <a
                      onClick={ event => {
                        event.preventDefault()
                        if( isVideo ){
                          actions.setRootStatePropertyDocuments({
                            watchVideoData : {
                              id,
                              company_code,
                              list_id,
                              mime,
                              name
                            }
                          }).then( () => {
                            setTimeout( () => {
                              global.$('#preview-video').modal('show')
                            }, 0 )
                          } )
                        }else{
                          actions.downloadDocument( id )
                        }
                      }}
                    >
                   { name }
                    </a>
                  }
                </td>
                <td> 
                  <FormatDate date={ updated_at }/>
                </td>
                {
                  !modifiedByHidden &&
                  <td> { username }</td>
                }
                
                <td className="text-right"> { is_folder ? '' : row.size} </td>
              </tr>
            )
          }
      )}
      </tbody>
    </table>
  )
}

export default DocumentTableBody