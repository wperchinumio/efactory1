import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import history from '../../../history'
import ComfirmModal from '../../OrderPoints/OrderEntry/Modals/Confirm'
import ManageFilter from './ManageFiltersModal/_Content'
import Bar from './Bar'
import * as gridActions from '../redux'

const ManageFilters = ({
  grid,
  gridActions,
  location: { pathname }
}) => {
  const [availableFields, setAvailableFields] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState(true)
  const [editId, setEditId] = useState({})
  const [isAdd, setIsAdd] = useState('')

  useEffect(
    () => {
      if (!grid.manageFilters.isHeaderConfigSet) {
        let pushRoute = pathname.replace('/manage-filters', '')
        history.push(pushRoute)
      } else {
        gridActions.listFilters()
      }
    },
    []
  )

  function deleteFilter (event) {
    let id = event.target.getAttribute('data-filter-id')
    setDeleteId(id)
    global.$('#manage-filters-delete-confirm').modal('show')
  }

  function onConfirmDelete (event, dataPassed) {
    let remember_filter_id = localStorage.getItem('remember_filter_id')
    let remember_filter_id_for_route = localStorage.getItem('remember_filter_id_for_route')
    if( remember_filter_id && remember_filter_id_for_route && +deleteId === +remember_filter_id ){
      localStorage.removeItem('remember_filter_id')
      localStorage.removeItem('remember_filter_id_for_route')
    }
    gridActions.deleteFilter(deleteId)
  }

  function requestAvailableFields () {
    let { selectedViewId, resource } = grid.manageFilters
    return gridActions.getAvailableFields( resource, selectedViewId ).then(
      data => {
        if (!data.available_fields || !Array.isArray(data.available_fields)) {
          console.error('available_fields doesnt exist')
          return
        }
        let availableFields = data.available_fields.filter( f => f.queryable )

        availableFields = availableFields.sort(function(a, b){
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        })
        return Promise.resolve(availableFields)
      }
    ).catch(  
      error => {
        console.error(
          'Manage filters requested getDetailsAsync to get available fields. '+
          'But there is an error with the api response. Check settings.js.'
        )
        return Promise.reject()
      }
    )
  }

  function showEditFilterModal (id) {
    requestAvailableFields().then(
      availableFields => {
        gridActions.getFilterDetail(id).then(
          data => {
            setEditData(data)
            setIsAdd(false)
            setEditId(id)
            setAvailableFields(availableFields)
            setTimeout(
              () => {
                global.$('#edit-filters').modal('show')
              },
              100
            )
          }
        )

      }
    )
  }

  function showAddFilterModal (event) {
    requestAvailableFields().then(
      availableFields => {
        setIsAdd(true)
        setAvailableFields(availableFields)
        setTimeout(
          () => {
            global.$('#edit-filters').modal('show')
          },
          100
        )
      }
    )
  }

  let { manageFilters = {} } = grid
  let {
    filters = [],
    headerConfig = {},
    isHeaderConfigSet,
    loadedListFilters
  } = manageFilters

  if( !isHeaderConfigSet ){
    return <div></div>
  }

  return (
    <div>
      <Bar
        pathname={ pathname }
        headerConfig={ headerConfig }
      />
      <div style={{padding: "0 20px"}}>
        <h3>
          <i className="fa fa-filter"></i> Filters
        </h3>
        <div className="row">
          <div className="col-md-6">
            <p>
              Filters are useful for quickly isolating records (orders, items, rmas, ...) that have certain characteristics.
            </p>
            <div className="table-responsive">
              <table className="table table-striped table-hover order-column table-clickable documents-table">
                <thead>
                  <tr className="uppercase table-header-1">
                    <th className="font-grey-salt">
                      Filter Name
                    </th>
                    <th className="font-grey-salt">
                      Description
                    </th>
                    <th className="font-grey-salt text-center" style={{width: "180px"}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    loadedListFilters && 
                    filters.length !== 0 &&
                    filters.map( filter => {
                      let {
                        description,
                        id,
                        name,
                        selected
                      } = filter
                      return (
                        <tr key={ `manage-filters-key-${id}` }>
                          <td className={ classNames({
                            'text-primary': true,
                            'bold': selected
                          }) } >{ name }</td>
                          <td>{ description }</td>
                          <td className="text-center">
                            <a 
                              type="button" 
                              className="btn green-soft btn-xs" 
                              onClick={ event => showEditFilterModal(id) }
                            >
                              <i className="fa fa-edit"></i>Edit...
                            </a> 
                            &nbsp;&nbsp;
                            <button 
                              type="button" 
                              className="btn red-soft btn-xs"
                              data-filter-id={id}
                              onClick={deleteFilter}
                            >
                              <i className="fa fa-trash-o"></i>Delete...
                            </button>

                          </td>
                        </tr>
                      )
                    } )
                  }
                    
                </tbody>
              </table> 
              {
                loadedListFilters && 
                filters.length === 0 &&
                <div className="alert alert-warning font-dark select-order-info">You have no filter.</div>
              }
              <a 
                type="button" 
                className="btn green-soft btn-sm" 
                onClick={ showAddFilterModal }
              >
                <i className="fa fa-plus"></i>Add filter
              </a>
            </div>
          </div>
        </div>
      </div>
      <ComfirmModal
        id="manage-filters-delete-confirm"
        confirmationMessage="Are you sure you want to delete this filter?"
        onConfirmHandler={ onConfirmDelete }
      />
      <ManageFilter 
        availableFields={ availableFields }
        name={ isAdd ? '' : editData.name }
        description={ isAdd ? '' : editData.description }
        editId={ isAdd ? '' : editId }
        filter={ isAdd ? { and : [] } : editData.filter }
        isModalAddFilter={ isAdd }
        gridActions={ gridActions }
        grid={ grid }
      />
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      grid     : state.grid
    }),
    dispatch => ({
      gridActions         : bindActionCreators( gridActions,          dispatch )
    })
  )(ManageFilters)
)