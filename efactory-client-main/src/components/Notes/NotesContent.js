import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

const NotesContent = props => {
  const [buttonDisabled, setButtonDisabled] = useState(false)

  useEffect(
    () => {
      if (buttonDisabled) {
        setTimeout( () => setButtonDisabled(false), 1000 )
      }
    },
    [buttonDisabled]
  )

  function handleSave (event) {
    event.preventDefault()
    let note = {
      ...props.activeNote,
      changed: true,
      note: props.activeNoteContent
    }
    props.actions.saveNoteAsync(note)
    setTimeout( () => props.deleteFromEditedNotes(props.activeNote.id), 1000 )
    setButtonDisabled(true)
  }

  return (
    <div className="col-md-9">
      <div style={{height:"22px",marginBottom:"20px"}} className="font-blue-dark">
        <div id="note-date" style={{ fontSize : '13px', minHeight : '13px' }}>
          {
            props.activeNote && props.activeNote.created_at &&
            props.handleDateFormat(props.activeNote.created_at, "Created on ")
          }
        </div>
        <div>
          <button
            role="button" 
            className={ classNames({  
              'btn btn-icon-only btn-topbar pull-right' : true,
              'invisible' : !props.activeNote
            }) }
            id="save-note-btn" 
            style={{top:"-17px",width:"100px"}}
            disabled={props.buttonDisabled || buttonDisabled}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <div className="full-height-content full-height-content-scrollable">
        <div className="full-height-content-body1">
          <section className="paper editedRR">
            { props.children }
          </section>
        </div>
      </div>
    </div>
  )
}

export default NotesContent