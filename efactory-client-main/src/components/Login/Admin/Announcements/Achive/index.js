import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PreviewModal from '../Articles/PreviewModal'
import { formatDate } from '../../../../_Helpers/FormatDate'
import bgcolorConfig from '../../../../Announcements/bgcolorConfig'

const AnnouncementOverviewTab = props => {
	const [sortField, setSortField] = useState()
	const [sortDirection, setSortDirection] = useState()

	useEffect(
		() => {
			props.loginActions.readArchiveArticles()
			return () => {
				props.loginActions.setRootReduxStateProp_multiple({
					announcements_archive_articles_active_row_id : '',
					announcements_archive_articles_active_row : {},
					preview_data : {}
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
			announcements_archive_articles
		} = props.auth
		let index = announcements_archive_articles.findIndex(
			({ id }) => id === received_id
		)
		props.loginActions.setRootReduxStateProp_multiple({
			announcements_archive_articles_active_row_id: received_id,
			announcements_archive_articles_active_row: announcements_archive_articles[ index ]
		})
	}

	function onSortClicked (event) {
		setSortField(event.target.getAttribute('data-sort-field'))
		setSortDirection(event.target.getAttribute('data-sort-direction'))
  }

  function sort (rows) {
    rows = [...rows]
    rows.sort( ( first, second ) => {
      var firstValue = first[ sortField ]
      var secondValue = second[ sortField ]
      if( sortField !== 'read' ){
      	firstValue = String(firstValue).toLowerCase()
				secondValue = String(secondValue).toLowerCase()
      }
      return (firstValue < secondValue) 
             ? -1 
             : (firstValue > secondValue) 
               ? 1 
               : 0
    } )
    if (sortDirection === 'desc') {
    	rows.reverse()
    }
    return rows
  }

  function showPreviewModal (event) {
  	let id = event.currentTarget.getAttribute('data-article-id')
  	props.loginActions.fetchArticlePreviewData(id).then(
  		() => {
  			global.$('#preview-modal').modal('show')
  		}
  	)
  }

  let {
		auth,
		loginActions
	} = props
	let {
		announcements_archive_articles = [],
		announcements_archive_articles_active_row_id,
		preview_data = {}
	} = auth
	announcements_archive_articles = sort(announcements_archive_articles)
  return (
    <div 
    	className="table-header-1"
    	style={{ marginTop: '20px' }}
    >
			<table className="table table-striped table-hover order-column row-sortable table-clickable documents-table" style={{marginBottom: "-3px", width: "calc(100% - 17px)"}}>
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
	          <SortableTh
	          	field={ 'published_from' }
	          	alias={ 'Publish Date' }
	          	sortField={ sortField }
	          	sortDirection={ sortDirection }
	          	onSortClicked={ onSortClicked }
	          />

	          <SortableTh
	          	field={ 'published_to' }
	          	alias={ 'Expiry Date' }
	          	sortField={ sortField }
	          	sortDirection={ sortDirection }
	          	onSortClicked={ onSortClicked }
	          />

	          <SortableTh
	          	field={ 'customers' }
	          	alias={ 'Customers' }
	          	sortField={ sortField }
	          	sortDirection={ sortDirection }
	          	onSortClicked={ onSortClicked }
	          	className={ 'text-center' }
	          />
	          <SortableTh
	          	field={ 'read' }
	          	alias={ 'Read' }
	          	sortField={ sortField }
	          	sortDirection={ sortDirection }
	          	onSortClicked={ onSortClicked }
	          	className={ 'text-right' }
	          />
	          <th className="text-center font-grey-salt noselect">
	              <span>Preview</span>
	          </th>
		      </tr>
			  </thead>
			</table>
			<div className="overview-announcements-body" style={{backgroundColor: "white", color: "black"}}>
        <table className="table table-striped table-hover order-column row-sortable table-clickable table-accouncements">
        	<ColGroup />
          <tbody className="ui-sortable">
          	{
          		announcements_archive_articles.map( ( item, index ) => {

          			let {
          				id,
									title,
									author,
									group,
									group_id,
									published_from,
									published_to,
									customers,
									read,
									has_attachments
          			} = item
	          			return (
	          				 <tr 
	          				 	className={ classNames({
            						'odd gradeX clickable-row ui-sortable-handle' : true,
            						'active' : +id === +announcements_archive_articles_active_row_id
            					}) } 
            					key={`article-${index}`}
            					data-item-id={ id }
            					onClick={ onRowClicked }
            					onDoubleClick={ showPreviewModal }
	                		data-article-id={ id }
	          				 >
			                <td style={{height: "35px"}}>{ index + 1 }</td>
			                <td className="font-blue-soft title pos-relative" style={{ paddingRight : '25px' }}>
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
			                <td>{ formatDate( published_from ) }</td>
			                <td>{ formatDate( published_to, 'true' ) }</td>
			                <td className="text-center" style={{width: "100px", maxWidth : '100px', overflow : 'hidden', textOverflow : 'ellipsis'}}>
			                	{ 
			                		customers && customers.join(',') === '*'
			                		? <i style={{ color : '#666' }}> All </i>
			                		: customers.join(',')
			                	}
			                </td>
			                <td className="text-right read">{ read }</td>
			                <td className="text-center">
			                	<a 
			                		onClick={ showPreviewModal }
			                		data-article-id={ id }
			                	>
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
      <PreviewModal
        loginActions={ loginActions }
        auth={ auth }
        activeRow={ preview_data }
      />
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
	    <col style={{width: "250px"}}/>
	    <col style={{width: "200px"}}/>
	    <col style={{width: "200px"}}/>
	    <col style={{width: "150px"}}/>
	    <col style={{width: "110px"}}/>
	    <col style={{width: "100px"}}/>
	    <col style={{width: "80px" }}/>
	    <col style={{width: "100px"}}/>
	  </colgroup>
	)
}

AnnouncementOverviewTab.propTypes = {
  auth: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired,
}

export default AnnouncementOverviewTab