import React from 'react'
import PropTypes from 'prop-types'
import FroalaEditor from '../../../../../_Shared/Froala'

const Editor = props => {
  let { value, handleEditorChange } = props
  return (
    <div  style={{ marginBottom: "10px", marginTop: "10px", position: 'relative', zIndex: '1' }}>
      <FroalaEditor 
        value={ value }
        onChangeHandler={ handleEditorChange }
      />
    </div>
  )
}

Editor.propTypes = {
  value : PropTypes.string.isRequired,
  handleEditorChange: PropTypes.func.isRequired
}

export default Editor