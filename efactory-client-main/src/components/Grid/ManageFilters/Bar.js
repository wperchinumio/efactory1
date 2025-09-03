import React from 'react'
import history from '../../../history'

const ManageFiltersBar = ({
  pathname,
  headerConfig = {}
}) => {
  function goBack (event) {
    let goToPath = pathname.replace('/manage-filters','')
    history.push(goToPath)
  }

  return (
    <div className="page-bar" style={{backgroundColor: "#eee", paddingLeft:"0", margin:"0"}}>
      <div className="page-breadcrumb">
        <div className="caption" style={{marginLeft:"20px"}}>
          <span className="caption-subject font-green-seagreen"><i className={ headerConfig.pageIcon }></i>{' '}
            <a 
              className="font-green-seagreen"
              onClick={goBack}
            >
              <span className="sbold"> { headerConfig.pageTitle } </span>
              { headerConfig.pageSubtitle? ' - ' + headerConfig.pageSubtitle: '' }
            </a>
          </span>
          <span className="font-dark small sbold"> &nbsp;»&nbsp; MANAGE FILTERS</span>
        </div>
      </div>
    </div>
  )
    
}

export default ManageFiltersBar