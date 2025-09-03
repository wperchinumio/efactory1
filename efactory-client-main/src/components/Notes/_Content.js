import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as notesActions from './redux/notes'
import NotesLeftside from './NotesLeftside'
import NotesContent from './NotesContent'

const Notes = props => {
  const firstRun = useRef(true)
  const [contentTextareaValue, setContentTextareaValue] = useState('')
  const [editedNotes, setEditedNotes] = useState({})
  
  useEffect(
    () => {
      props.notesActions.getNotesAsync()
      window.Layout.initContent()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.notes.selectedNoteId) {
        if (props.notes.selectedNoteId && !editedNotes[props.notes.selectedNoteId]) {
          const { note } = getActiveNote( props.notes.selectedNoteId, props.notes.notes )
          setContentTextareaValue(note)
        } else if (props.notes.selectedNoteId && editedNotes[props.notes.selectedNoteId]) {
          setContentTextareaValue(editedNotes[props.notes.selectedNoteId].newInput)
        }
      } else {
        setContentTextareaValue('')
      }
    },
    [props.notes.selectedNoteId]
  )

  function didNoteContentChange (nodeId) {
    //returns see if a note content is as original
    if (editedNotes[nodeId] !== undefined) {
      if (editedNotes[nodeId]["oldInput"] !== editedNotes[nodeId]["newInput"].trim() ) {
        return true
      }
      return false
    }
    return false
  }
  
  function getActiveNote (selectedNoteId = props.notes.selectedNoteId, fromWhere = props.notes.notes ) {
    let activeNote = false
    if (selectedNoteId) {
      for (let note of fromWhere) {
        if (note.id === selectedNoteId) {
          activeNote = note
          break
        }
      }
    }
    return activeNote
  }

  function deleteFromEditedNotes (noteId) {
    let editedNotesNext = {...editedNotes}
    delete editedNotesNext[noteId]
    setEditedNotes(editedNotesNext)
  }

  function handleTextareaInput (event) {
    let activeNoteId = props.notes.selectedNoteId
    if (!activeNoteId) {
      return
    }
    
    let oldInput = getActiveNote().note
    let changedEditedNote = {}
    
    changedEditedNote[activeNoteId] = {
      oldInput : oldInput,
      newInput : event.target.value
    }
    setContentTextareaValue(event.target.value)
    setEditedNotes({...editedNotes, ...changedEditedNote})
  }

  function handleDateFormat (date, prefixMessage = '') {
    let date1 = date.slice(0,date.indexOf('T')).split("-").slice(1)
    let dateFinal = date1.join('/')
    let hour = (+date.slice(date.indexOf('T') + 1).slice(0,2) % 12 )
    let minutes = date.slice(date.indexOf('T') + 4 ).slice(0,2)
    let amPm = Math.floor((+date.slice(date.indexOf('T') + 1).slice(0,2) / 12 )) === 1 ? 'PM' : 'AM'
    return `${prefixMessage}${dateFinal} ${hour}:${minutes}${amPm}`
  }

  let activeNote = getActiveNote()
  let { notes = [] } = props.notes
  
  return (
    <div className="fade-in-up-removed " id="main-content">
      <div className="row " style={{ marginTop:"-15px", marginBottom: "-15px" }}>
        <NotesLeftside
          handleDateFormat={handleDateFormat}
          notes={notes}
          activeNoteId={props.notes.selectedNoteId}
          actions={props.notesActions}
          editedNotes={editedNotes}
          deleteFromEditedNotes={deleteFromEditedNotes}
        />
        <NotesContent
          handleDateFormat={handleDateFormat}
          activeNote={activeNote}
          actions={props.notesActions}
          activeNoteContent={contentTextareaValue}
          buttonDisabled={!didNoteContentChange(activeNote.id)}
          deleteFromEditedNotes={deleteFromEditedNotes}
          isButtonHidden
        >
          <textarea
            type="text"
            className="form-control scrollable shouldFocus2 editedRR"
            placeholder={notes.length ? 'Type your note here...' : 'Press plus button to add a note...'}
            id="area-note"
            onChange={handleTextareaInput}
            value={contentTextareaValue}
            spellCheck="false"
          >
          </textarea>
        </NotesContent>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    notes : state.notes
  }),
  dispatch => ({
    notesActions: bindActionCreators(notesActions, dispatch)
  })
)(Notes)