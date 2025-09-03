import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import FroalaEditor from '../../../../../_Shared/Froala'

const Editor = props => {
  const editorEl = useRef(null)

  let { value } = props
  return (
    <div  style={{marginBottom: "10px"}}>
      <FroalaEditor 
        value={ value }
        ref={editorEl}
        onChangeHandler={props.handleEditorChange}
      />
    </div>
  )
}

Editor.propTypes = {
  value: PropTypes.string.isRequired,
  handleEditorChange: PropTypes.func.isRequired,
  stringToInsert: PropTypes.string,
  templateActions: PropTypes.object.isRequired
}

export default Editor