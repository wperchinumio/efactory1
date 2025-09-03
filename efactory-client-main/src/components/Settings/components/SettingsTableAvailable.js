import React, { useState } from 'react'

const SettingsTableAvailable = props => {
  const [filterInput, setFilterInput] = useState('')

  function filterSelectedFields () {
    return props.availableFields.filter(
      availableField => {
        let availableFieldMatched = false
        props.changedOrder.some((changedField)=>{
          if (changedField === availableField.field) {
            availableFieldMatched = true
            return true
          }
          return false
        })
        return !availableFieldMatched
      }
    )
  }

  function filterAvailableFields (availableFields) {
    if (filterInput.trim().length) {
      let filterKeyword = filterInput.trim().toLowerCase()
      availableFields = availableFields.filter((selectedField)=>{
        return selectedField.title.toLowerCase().includes(filterKeyword) ||
               selectedField.description.toLowerCase().includes(filterKeyword)
      })
    }
    return availableFields
  }

  function handleFilterInput (event) {
    setFilterInput(event.target.value)
  }

  let filteredAvailableFields = filterAvailableFields(filterSelectedFields())
  return (
    <td className="w50">
      <div className="portlet light bordered">
        <div className="portlet-title">
          <div className="caption caption-md font-dark">
            <i className="fa fa-table font-blue-madison"></i>
            <span className="caption-subject bold uppercase font-blue-madison">
              Available fields: <span>{ ' ' }</span>
              <strong className="font-dark">{ filteredAvailableFields.length }</strong>
            </span>
          </div>
          <div className="inputs">
            <div className="portlet-input input-inline input-medium">
              <div className="input-icon right">
                <i className="icon-magnifier"></i>
                <input 
                  type="text"
                  className="form-control input-circle ng-pristine ng-untouched ng-valid ng-empty"
                  placeholder="filter"
                  value={filterInput}
                  onChange={handleFilterInput}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="portlet-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-clickable clickable-availables">
              <thead>
              <tr className="uppercase bg-dark">
                <th className="font-blue"> # </th>
                <th className="font-blue"> Field </th>
                <th className="font-blue text-center text-nowrap"> Min-Size </th>
                <th className="font-blue"> Description </th>
              </tr>
              </thead>
              <tbody>
                { 
                  filteredAvailableFields.map(
                    (field, index) => {
                      return (
                        <tr 
                          className={
                            props.activeAvailableRowId === field.field ?
                            "odd gradeX clickable-row active" :
                            "odd gradeX clickable-row"
                          }
                          key={field.field}
                          onClick={ () => props.setActiveAvailableRow(field.field) }
                        >
                          <td>{ index + 1 }</td>
                          <td className="bold text-nowrap">{ field.title }</td>
                          <td className="text-center"> { field.min_width } </td>
                          <td> { field.description } </td>
                        </tr>
                      )
                    }
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </td>
  )
}

export default SettingsTableAvailable