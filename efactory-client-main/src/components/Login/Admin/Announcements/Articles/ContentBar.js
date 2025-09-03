import React from 'react'
import PropTypes from 'prop-types'

const ContentBar = props => {
  function editArticle (event) {
    let { id } = props
    props.loginActions.editArticle( id ).then(
      props.openEditor
    )
  }

  function newArticle (event) {
    props.loginActions.newArticle().then(props.openEditor)
  }

  let { is_archive, id } = props
  return (
    <div style={{ position: 'relative', top: '-40px' }}> 
      <div className="page-toolbar pull-right">
        {
          !is_archive &&
          <button
            className="btn green-soft btn-sm"
            type="button"
            onClick={ newArticle }
          >
            <i className="fa fa-file-o"></i>
            NEW
          </button>  
        }
        {
          !is_archive &&
          <span style={{display: "inline-block", padding: "0 3px"}} >|</span>   
        }
        <button 
          className="btn btn-topbar btn-sm" 
          type="button"
          disabled={ !id }
          onClick={ editArticle }
        >
          <i className="fa fa-pencil"></i>
          Edit
        </button>
      </div>
    </div>
  )
}

ContentBar.propTypes = {
  id: PropTypes.any,
  loginActions: PropTypes.object.isRequired,
}

export default ContentBar