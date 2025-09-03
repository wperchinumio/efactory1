import React, { useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import createTreeview from './createTreeview'
momentLocalizer(moment)

const ArticleSettings = props => {
  const propsRef = useRef(null)
  propsRef.current = props

  const onTreeViewChange = useCallback(
    function onTreeViewChange (event, data) {
      let { selected } = data
      selected = selected.filter( s => !s.startsWith('j') )

      let { auth, loginActions } = propsRef.current
      let { selected_customers = [] } = auth.edit_article_data || {}

      let isAllSelected_before  = selected_customers.includes('*')
      let isAllSelected_after   = selected.includes('*')
      
      let changeFromOutside = false

      if( isAllSelected_before && isAllSelected_after ){
        if( selected.length > 1 ){ // remove '*'
          changeFromOutside = true
          let index = selected.findIndex( i => i === '*' )
          selected = [ ...selected.slice(0,index), ...selected.slice( index + 1 ) ]
        }
      }else if( isAllSelected_after ){
        if( selected.length > 1 ){ // add '*' only
          changeFromOutside = true
          selected = [ '*' ]
        }
      }else if( selected.length === 0 ){
        changeFromOutside = true
        selected = [ '*' ]
      }

      if( JSON.stringify( selected_customers ) !== JSON.stringify( selected )){
        loginActions.setRootReduxStateProp_multiple({
          edit_article_data : {
            ...auth.edit_article_data,
            selected_customers : selected
          },
          edit_article_dirty : true
        }).then( () => {
          if( changeFromOutside ){
            refreshTreeView( auth.edit_article_data.customers, selected )
          }
        } )
      }
    },
    []
  ) 


  useEffect(
    () => {
      let { edit_article_data = {} } = props.auth
      let { selected_customers = [], customers = [] } = edit_article_data
      createTreeView(customers, selected_customers)
      global.$('#customers-checkboxes').on('changed.jstree', onTreeViewChange)
      return () => {
        global.$('#customers-checkboxes').off('changed.jstree', onTreeViewChange)
      }
    },
    []
  )

  function refreshTreeView (customers, selected_customers) {
    global.$('#customers-checkboxes').off('changed.jstree', onTreeViewChange)
    global.$('#customers-checkboxes').jstree().destroy()
    createTreeView(customers, selected_customers)
    global.$('#customers-checkboxes').on('changed.jstree', onTreeViewChange)
  }

  

  function createTreeView (customers, selected_customers) {
    global.$('#customers-checkboxes').jstree({
      plugins : ["wholerow", "checkbox", "types"],
      core    : {
        themes : {
          responsive: false,
          icons:false
        },    
        data: createTreeview( customers, selected_customers )
      },
      types : {
        default : {
          icon : "fa fa-folder icon-state-warning icon-lg"
        },
        file : {
          icon : "fa fa-file icon-state-warning icon-lg"
        }
      }
    })
  }
  
  function updateDate (date_object, field) {
    let { auth, loginActions } = props
    let { edit_article_data = {} } = auth
    loginActions.setRootReduxStateProp_multiple({
      edit_article_data : {
        ...edit_article_data,
        [field]: date_object ? moment(date_object).format('YYYY-MM-DD') : ''
      },
      edit_article_dirty : true
    })
  }

  function onFieldChange (event) {
    let field = event.currentTarget.getAttribute('data-field')
    let value = event.currentTarget.value
    if( field === 'is_draft' ){
      value = value === 'true' ? true : false
    }
    let { auth, loginActions } = props
    let { edit_article_data = {} } = auth
    loginActions.setRootReduxStateProp_multiple({
      edit_article_data : {
        ...edit_article_data,
        [field]: value
      },
      edit_article_dirty : true
    })
  }

  let {
    loginActions,
    auth
  } = props

  let {
    edit_article_data,
    edit_article_dirty
  } = auth

  let {
    author,
    group_id,
    groups = [],
    is_draft = true,
    published_from,
    published_to,
  } = edit_article_data || {}

  return (
    <div className="col-sm-5">
      <div className="row article-settings">
        <div className="col-md-6 margin-b-15">
          <label className="control-label">
            Publish on:
          </label>
          <DatePicker
            format="MM/DD/YYYY"
            name="published_from"
            onChange={ date_object => updateDate( date_object, 'published_from' ) }
            time={false}
            value={ published_from ? moment( published_from ).toDate()  : null }
          />
        </div>
        <div className="col-md-6 margin-b-15">
          <label className="control-label">
            Expire on:
          </label>
          <DatePicker
            format="MM/DD/YYYY"
            name="published_to"
            onChange={ date_object => updateDate( date_object, 'published_to' ) }
            time={false}
            value={ published_to ? moment( published_to ).toDate()  : null }
          />
        </div>
        <div className="col-md-6 margin-b-15">
          <label className="control-label">
            Category:
          </label>
          <div className="">
            <select 
              className="form-control"
              value={ group_id }
              data-field="group_id"
              onChange={ onFieldChange }
            >
              <option value="0"></option>
              {
                groups.map(
                  ( { id, name }, index ) => {
                    return <option 
                      value={ id }
                      key={ `g-option-${id}` }
                    >
                      { name }
                    </option>
                  }
                )
              }
            </select>
          </div>
        </div>
        <div className="col-md-6 margin-b-15">
          <label className="control-label">
            Author:
          </label>
          <div className="">
            <input 
              type="text" 
              className="form-control"
              value={ author }
              data-field="author"
              onChange={ onFieldChange }
            />
          </div>
        </div>
        <div className="col-md-6 margin-b-15">
          <label className="control-label">
            Status:
          </label>
          <div className="">
            <select 
              className="form-control"
              value={ String( is_draft ) }
              data-field="is_draft"
              onChange={ onFieldChange }
            >
              <option value="true">Draft</option>
              <option value="false">Publish</option>
            </select>
          </div>
        </div>
        <div className="col-md-12 margin-b-15">
          <label className="control-label">
            Customers:
          </label>
          <div 
            className="announcements-visibility-checkboxes"
            style={{
              border: '1px solid #c0cad6',
              padding: '10px'
            }}
          >
            <div id="customers-checkboxes"></div>
          </div>
        </div>
        <div className="col-md-12">
          <button 
            className={ classNames({
              'btn btn-sm pull-right' : true,
              'btn-topbar' : is_draft,
              'blue-soft' : !is_draft
            }) }
            disabled={ !edit_article_dirty }
            type="button"
            onClick={ loginActions.saveArticle }
          >
            { is_draft ? "Save Draft" : "Save & Publish" }
          </button>  
        </div>
      </div>
    </div>
  )
}

ArticleSettings.propTypes = {
  loginActions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default ArticleSettings