import React, { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import AddFilterLine from './AddFilterLine'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const ManageFilterModal = (props) => {
  const filterNameNode = useRef(null)
  const propsRef = useRef(null)
  propsRef.current = props
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState({ and: [] })
  const [saving, setSaving] = useState(false)

  const handleModalOpening = useCallback(
    () => {
      let {
        availableFields,
        description,
        filter,
        isModalAddFilter,
        name
      } = propsRef.current
      let filterNext = availableFields.length
                  ? isModalAddFilter
                    ? { and : [] }
                    : filter
                  : { and : [] }
      setFilter(filterNext)
      setName(name)
      setDescription(description)

      setTimeout( () => {
        filterNameNode.current.focus()
      }, 500 )
      global.$('.draggable-modal').css({ top : '0px', left : '0px' })
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#edit-filters').on('show.bs.modal', handleModalOpening )
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$('#edit-filters').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function onFilterObjectChanged (filterObject, index) {
    const filterNext = {
      and: [
        ...filter.and.slice(0,index),
        filterObject,
        ...filter.and.slice(+index + 1)
      ]
    }
    setFilter(filterNext)
  }

  function removeLine (index) {
    const filterNext = {
      and: [
        ...filter.and.slice(0, index),
        ...filter.and.slice(+index + 1)
      ]
    }
    setFilter(filterNext)
  }

  function addNewCriteriaLine () {
    let { availableFields } = props
    if( !availableFields.length ) return
    const filterNext = {
      and : [
        ...filter.and,
        {
          field : availableFields[0]['field'],
          oper  : '=',
          value : ''
        }
      ]
    }
    setFilter(filterNext)
  }

  function onSaveClicked (event) {
    setSaving(true)
    let { grid, gridActions, isModalAddFilter, editId } = props
    gridActions[isModalAddFilter ? 'createFilter' : 'updateFilter']({
      id: isModalAddFilter ? grid.manageFilters.resource : editId,
      name,
      description,
      filter
    }).then(
      () => {
        setSaving(false)
        global.$('#edit-filters').modal('hide')
      }
    ).catch(
      () => setSaving(false)
    )
  }

  let filter_ = filter || { and : [] }
  let { availableFields } = props

  return (
    <form 
      role="form" 
      autoComplete="off" 
      className="form-horizontal" 
      onSubmit={ e => e.preventDefault() }
    >
      <div
        className="modal modal-themed fade"
        data-backdrop="static"
        id="edit-filters"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true">
        <div className="modal-dialog modal-lg draggable-modal">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="uppercase" style={{margin:0}}>FILTERS</h4>
            </div>
            <div className="modal-body">
              <div>
                <div className="form-group">
                  <label className="col-md-3">
                    Filter Name:
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control input-md"
                      type="text"
                      name="name"
                      ref={filterNameNode}
                      value={ name ? name : '' }
                      onChange={ event => setName(event.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-3">
                    Description:
                  </label>
                  <div className="col-md-9">
                    <textarea rows="3"
                      className="form-control input-md"
                      name="description"
                      value={ description ? description : '' }
                      onChange={ event => setDescription(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{borderBottom: "1px dashed #ccc", paddingBottom: "5px"}}>
                The returned records will match <b>ALL of the following criteria</b>.
              </div>
              <div style={{ maxHeight: "325px", minHeight: "325px", overflowY: "scroll", overflowX: "hidden", paddingTop: "10px" }}>
                {
                  availableFields.length > 0 &&
                  filter_.and.map(
                    (filter, index) => {
                      return (
                        <AddFilterLine
                          key={ `AddFilterLine-${index}` }
                          availableFields={ availableFields }
                          dataToBePassed={ index }
                          filterObject={ filter }
                          onFilterObjectChanged={ onFilterObjectChanged }
                          removeLine={ removeLine }
                        />
                      )
                    }
                  )
                }
                <div style={{padding: "0 15px"}}>
                  <button
                    type="button"
                    disabled={ !availableFields.length }
                    className="btn dark btn-outline btn-xs"
                    onClick={ addNewCriteriaLine }
                  ><i className="fa fa-plus"></i> Add Criteria
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal">
                Cancel
              </button>
              &nbsp;
              <ButtonLoading
                className="btn green-soft"
                handleClick={ onSaveClicked }
                name={'Save'}
                loading={ saving }
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

ManageFilterModal.propTypes = {
  availableFields: PropTypes.array,
  name: PropTypes.string,
  description: PropTypes.string,
  editId: PropTypes.any,
  filter: PropTypes.shape({
    and: PropTypes.arrayOf( PropTypes.shape({
      field: PropTypes.string,
      value: PropTypes.any,
      oper: PropTypes.string
    }) )
  }),
  grid: PropTypes.object.isRequired,
  gridActions: PropTypes.object.isRequired,
  isModalAddFilter: PropTypes.bool.isRequired
}

export default ManageFilterModal