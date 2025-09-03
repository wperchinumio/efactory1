import React from 'react'
import ReactDOM from 'react-dom'
// Note that Froala Editor has to be required separately
import 'froala-editor/js/froala_editor.min.js'
import 'froala-editor/css/froala_editor.min.css'
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css'
import FroalaEditor from 'react-froala-wysiwyg'

// Render Froala Editor component.
const EditorComponent = props => {
  const config = useRef({
    placeholderText: 'Add a Title',
    charCounterCount: false,
    toolbarInline: true,
    events: {
      'froalaEditor.initialized': function() {
        console.log('initialized')
      }
    }
  })
  const [myTitle, setMyTitle] = useState('Click here to edit this text.')

  function handleModelChange (model) {
    setMyTitle(model)
  }

  function handleInputChange (event) {
    setMyTitle(event.target.value)
  }

  return(
    <div className="sample">
      <h2>Inline Edit</h2>
      <FroalaEditor
        tag='textarea'
        config={config.current}
        model={myTitle}
        onModelChange={handleModelChange}
      />
      <textarea value={myTitle} onChange={handleInputChange} />
    </div>
  )
}

ReactDOM.render(<EditorComponent/>, document.getElementById('editor'))

require("file?name=[name].[ext]!./edit_inline.html")