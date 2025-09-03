import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDate } from '../../../../_Helpers/FormatDate'
import bgcolorConfig from '../../../../Announcements/bgcolorConfig'

const ArticlesTable = props => {
	const [sortField, setSortField] = useState('id')
	const [sortDirection, setSortDirection] = useState('desc')

	useEffect(
		() => {
			return () => {
				props.loginActions.setRootReduxStateProp_multiple({
					announcements_articles_active_row_id: '',
					announcements_articles_active_row: {},
					preview_body: {}
				})
			}
		},
		[]
	)

	function onRowClicked (event) {
		let received_id = event.currentTarget.getAttribute('data-item-id')
		if (!received_id) {
			return console.warn('No id found for onRowClicked method of Articles => ArticlesTable')
		}
		received_id = +received_id
		let {  
			announcements_articles
		} = props.auth
		let index = announcements_articles.findIndex(
			({ id }) => id === received_id
		)
		props.loginActions.setRootReduxStateProp_multiple({
			announcements_articles_active_row_id: received_id,
			announcements_articles_active_row: announcements_articles[ index ]
		})
		props.loginActions.fetchArticlePreviewData( received_id )
	}

	function onSortClicked (event) {
    setSortField(event.target.getAttribute('data-sort-field'))
    setSortDirection(event.target.getAttribute('data-sort-direction'))
  }

  function sort (rows) {
    rows = [ ...rows ]
    rows.sort( ( first, second ) => {
      var firstValue = first[ sortField ]
      var secondValue = second[ sortField ]
      if (sortField !== 'id' ){
      	firstValue = String(firstValue).toLowerCase()
				secondValue = String(secondValue).toLowerCase()
      }
      return (firstValue < secondValue) 
             ? -1 
             : (firstValue > secondValue) 
               ? 1 
               : 0
    })
    if (sortDirection === 'desc') {
    	rows.reverse()
    }
    return rows
  }

  let {
		announcements_articles = [],
		announcements_articles_active_row = {},
		announcements_articles_active_row_id
	} = props.auth
	announcements_articles = sort(announcements_articles)
	let {
		published_from = '',
		created_at = ''
	} = announcements_articles_active_row
  return (

  	<div className="col-lg-7 col-xs-12">
    	<div className="table-header-1">
				<table 
					className="table table-striped table-hover order-column row-sortable table-clickable documents-table" 
					style={{marginBottom: "-3px", width: "calc(100% - 17px)"}}
				>
					<ColGroup />
				  <thead>
			      <tr className="uppercase table-header-1">
		          <th> # </th>
		          <SortableTh
		          	field={ 'title' }
		          	alias={ 'Title' }
		          	sortField={ sortField }
		          	sortDirection={ sortDirection }
		          	onSortClicked={ onSortClicked }
		          />
		          <SortableTh
		          	field={ 'author' }
		          	alias={ 'Author' }
		          	sortField={ sortField }
		          	sortDirection={ sortDirection }
		          	onSortClicked={ onSortClicked }
		          />
		          <SortableTh
		          	field={ 'group' }
		          	alias={ 'Category' }
		          	sortField={ sortField }
		          	sortDirection={ sortDirection }
		          	onSortClicked={ onSortClicked }
		          />
		          <th className="hidden-lg text-center font-grey-salt">
		              <span>Preview</span>
		          </th>
			      </tr>
				  </thead>
				</table>
				<div className="announcements-body" style={{backgroundColor: "white", color: "black"}}>
          <table className="table table-striped table-hover order-column row-sortable table-clickable table-accouncements">
            <ColGroup />
            <tbody className="ui-sortable">
            	{
            		announcements_articles.map( ( item, index ) => {
            			let {
            				id,
            				title, 
            				author,
            				group,
            				group_id,
            				is_draft,
            				has_attachments
            			} = item || {}
            			return (
            				<tr 
            					className={ classNames({
            						'odd gradeX clickable-row ui-sortable-handle' : true,
            						'active' : +id === +announcements_articles_active_row_id
            					}) } 
            					key={`article-${index}`}
            					data-item-id={ id }
            					onClick={ onRowClicked }
            				>
			                <td style={{height: "35px"}}> { index + 1 } </td>
			                <td 
			                	className="font-blue-soft title pos-relative"
			                	style={{
			                		paddingRight : '25px',
			                		borderLeft   : !is_draft ? '3px solid #36d236' : ''
			                	}}
			                >
			                	{ title }
			                	{
			                		has_attachments &&
			                		<div>
				                		<i className="fa fa-paperclip attachment-icon" />
				                	</div>
			                	}
			                </td>
			                <td className="author">
			                	{ author }
			                </td>
			                <td>
			                	<i 
			                		className="fa fa-star" 
			                		style={{  
			                			color: bgcolorConfig[ group_id ], 
			                			paddingRight: '4px'
			                		}}
			                	/>
			                	{ group }
			                </td>
			                <td className="hidden-lg text-center">
			                	<a href="#preview-modal" data-toggle="modal">
			                		<i className="fa fa-eye"></i>
			                	</a>
			                </td>
			              </tr>
            			)
            		} )
            	}
            </tbody>
          </table>
        </div>
			</div>
			<div className="article-table-footer font-12">
      	<div className="row">
      		<div className="col-sm-8 col-sm-push-4">
      			<div className="col-xs-7 text-right"> Publish Date: </div>
      			<div className="col-xs-5 text-right">
      				<strong>{ formatDate( published_from ) }</strong>
      			</div>
        	</div>
      	</div>
      	<div className="row">
        	<div className="col-sm-8 col-sm-push-4">
        		<div className="col-xs-7 text-right"> Created Date: </div>
        		<div className="col-xs-5 text-right">
        			<strong>{ formatDate( created_at ) }</strong>
        		</div>
        	</div>
      	</div>
      </div>
  	</div>
  )
}

function SortableTh ({ field, alias, align, sortField, sortDirection, onSortClicked, className }) {
	return <th className={ className || '' }>
    <span className="column-sort">
      <i className={ `fa fa-long-arrow-up ${sortField === field && sortDirection === 'asc' && 'active'}` } aria-hidden="true"></i>
    </span>
    <span className="column-sort column-sort-down">
      <i className={ `fa fa-long-arrow-down ${sortField === field && sortDirection === 'desc' && 'active'}` } aria-hidden="true"></i>
    </span>

    <a 
    	className="font-grey-salt noselect" data-sort-field={ field }
      data-sort-direction={ 
        sortField === field
        ? sortDirection === 'asc'
          ? 'desc' 
          : 'asc' 
        : 'asc'
      }
      onClick={ onSortClicked }
    > { alias } </a>
  </th>
}

function ColGroup () {
	return (
		<colgroup>
      <col style={{width: "35px"}}/>
      <col style={{width: "300px"}}/>
      <col style={{width: "200px"}}/>
      <col style={{width: "80px"}}/>
      <col style={{width: "100px"}} className="hidden-lg"/>
	  </colgroup>
	)
}

ArticlesTable.propTypes = {
  auth: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired
}

export default ArticlesTable