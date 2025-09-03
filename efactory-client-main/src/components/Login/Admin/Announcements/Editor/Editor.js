import React from 'react'
import PropTypes from 'prop-types'
import FroalaEditor from '../../../../_Shared/Froala'

const Editor = ({ value, handleEditorChange }) => {
  return (
    <div  
      style={{
        marginBottom: "10px",
        marginTop: '60px',
        height: 'calc( 100vh - 342px ) !important'
      }}
    >
      <FroalaEditor 
        value={value}
        onChangeHandler={handleEditorChange}
        config={ {
          placeholderText: 'Edit Your Announcement Here!',
          toolbarButtons: [
            'fullscreen',
            '|',
            'bold', 
            'italic', 
            'underline',
            'fontFamily', 
            'fontSize',
            'color',
            '|',
            'align', 
            'formatOL', 
            'formatUL', 
            'outdent', 
            'indent',
            '|',
            'insertLink',
            'insertImage',
            '|',
            'undo', 
            'redo'
          ],
          fontSize: ['8','9','10','11','12','13','14','16','18','22','30', '60', '96'],
          pluginsEnabled: ['fullscreen','align','fontFamily','fontSize','lists','image', 'link', 'colors'],
          colorsBackground: [
            '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
            '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
          ],
          colorsDefaultTab: 'color',
          useClasses: false,
          colorsStep: 6,
          colorsText: [
            '#E43A45', '#29B4B6', '#4B77BE', '#E87E04', '#8E44AD', 'REMOVE',
            '#525E64', '#2F353B', '#26C281', '#fdf498', '#009246', '#FFFFFF'
          ]
        } }
      />
    </div>
  )
}

Editor.propTypes = {
  value: PropTypes.string.isRequired,
  handleEditorChange: PropTypes.func.isRequired
}

export default Editor