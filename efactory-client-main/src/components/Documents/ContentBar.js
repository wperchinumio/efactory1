import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import DebounceInput from 'react-debounce-input'
import { getAuthData } from '../../util/storageHelperFuncs'

const ContentBar = ({
	actions,
	controlsDisabledOnRoot,
	deleteDisabled: deleteDisabledReceived,
	moveToHidden,
	name,
	noFiltering,
	pathname,
	renameDisabled: renameDisabledReceived
}) => {
	function handleFilterInput (event) {
   	actions.getlistAsync( event.target.value )
  }

  function refresh (event) {
  	actions.getlistAsync('')
  }

  let allDisabled = pathname !== "/documents" &&
		pathname !== '/ftp-folders/send' &&
		!pathname.includes('special-docs') &&
		pathname !== '/orderpoints/documents/ftp-folders-send' &&
		(
			!getAuthData().user_data.is_local_admin || 
			pathname === '/documents/reference'
		)
	let deleteDisabled = allDisabled ? true : deleteDisabledReceived
	let renameDisabled = allDisabled ? true : renameDisabledReceived

  return (
    <div className="portlet-title">
      <div className="caption caption-md font-dark">
        <i className="fa fa-folder font-green-seagreen"></i>
        <span className="caption-subject bold uppercase font-green-seagreen"> {name}</span>
      </div>
			{
			!noFiltering &&
      <div className="inputs"  style={{marginLeft: 15}}>
        <div className="portlet-input input-inline input-large">
					<div className="input-icon right">
						<i className="icon-magnifier"></i>
								<DebounceInput
									className="form-control input-circle"
									placeholder="filter"
									debounceTimeout={200}
									onChange={ handleFilterInput }
								/>
						</div>

        </div>
      </div>
			}

      {
      	!allDisabled &&
      	<div className="actions">
	        <div className="btn-group ">

	        	<button
		          type="button"
		          className="btn green-seagreen btn-sm"
		          onClick={ refresh }
		         >
		          <i className="fa fa-refresh">
		          </i>
		        </button>

	          <a className="btn green-seagreen" href="#" data-toggle="dropdown" aria-expanded="true">
	            <i className="fa fa-cog"></i> Actions
	            <i className="fa fa-angle-down"></i>
	          </a>
	          <ul className="dropdown-menu">
	            <li>
	              <a
	              	data-toggle="modal"
	              	className={classNames({
	              		disabledLink : allDisabled || deleteDisabled || controlsDisabledOnRoot
	              	})}
	              	href={ deleteDisabled ? "" : "#delete-documents"}
	              	onClick={ event => { if(deleteDisabled){event.preventDefault()} } }
	              >
	                <i className="fa fa-trash-o"></i> Delete selected </a>
	            </li>
	            <li>
	              <a
	              	data-toggle="modal"
	              	className={classNames({
	              		disabledLink : allDisabled || renameDisabled || controlsDisabledOnRoot
	              	})}
	              	href={ renameDisabled ? "" : "#rename_modal"}
	              	onClick={ event => { if(renameDisabled){event.preventDefault()} } }
	              >
	                <i className="fa fa-pencil"></i> Rename... </a>

	            </li>
							{
								!moveToHidden &&
								<li>
									<a
										data-toggle="modal"
										className={classNames({
											disabledLink : allDisabled || deleteDisabled || controlsDisabledOnRoot
										})}
										onClick={ event => { if(deleteDisabled){event.preventDefault()} } }
										href={ deleteDisabled ? "" : "#moveto-document"}>
										<i className="fa fa-angle-right"></i> Move to... </a>
								</li>
              }
              <li>
	              <a
	              	data-toggle="modal"
	              	className={classNames({
	              		disabledLink : allDisabled || deleteDisabled || controlsDisabledOnRoot
	              	})}
                  onClick={ event => (deleteDisabled) ? event.preventDefault() : actions.exportDocuments()  }
	              >
	                <i className="fa fa-download"></i> Export to Zip</a>
	            </li>
	          </ul>
	        </div>
	      </div>
      }
    </div>
  )
}

ContentBar.propTypes = {
  actions: PropTypes.object.isRequired,
  activeListId: PropTypes.any.isRequired,
  renameDisabled: PropTypes.bool.isRequired,
  pathname: PropTypes.string,
	noFiltering: PropTypes.bool,
	moveToHidden: PropTypes.bool,
	controlsDisabledOnRoot: PropTypes.bool,
}

export default ContentBar
