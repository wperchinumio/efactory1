import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ArticlesTable from './ArticlesTable'
import PreviewModal from './PreviewModal'
import Preview from './Preview'

const ArticlesContent = props => {
  useEffect(
    () => {
      props.loginActions.readArticles()
    },
    []
  )

  let { loginActions, auth } = props
  return (
   <div>
    <div className="row" style={{ marginTop: '19px' }}>
      <ArticlesTable 
        loginActions={ loginActions }
        auth={ auth }
      />
      <div className="col-md-5 hidden-xs hidden-sm hidden-md content-preview-body">
        <Preview 
          loginActions={ loginActions }
          auth={ auth }
          body={ auth.preview_data && auth.preview_data.body }
        />
      </div>
    </div>
    <PreviewModal
      loginActions={ loginActions }
      auth={ auth }
      activeRow={ auth.preview_data || {} }
    />
   </div>
  )
}


ArticlesContent.propTypes = {
  auth : PropTypes.object.isRequired,
  loginActions : PropTypes.object.isRequired,
  openEditor : PropTypes.func
}

export default ArticlesContent