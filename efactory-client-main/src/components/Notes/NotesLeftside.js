import React, { useState, useCallback, useEffect } from 'react'
import classNames from 'classnames' 

const NotesLeftside = props => {
  const [deleteModal, setDeleteModal] = useState({ visible : false, id : false })
  const [addNoteModal, setAddNoteModal] = useState({ visible : false, inputValue : '' })
  const [filter, setFilter] = useState('')
  const [alreadyChangedActive, setAlreadyChangedActive] = useState(false)

  const resizeScrollFix = useCallback(
    () => {
      let scrollableFix = document.querySelector(".scrollable-fix")
      let scrollable = document.querySelector("textarea.scrollable")
      setTimeout(
        ()=>{
          if(scrollableFix && scrollable){
            window.requestAnimationFrame(
              () => {
                scrollableFix.style.height =
                (+scrollable.style.minHeight.slice(0,
                  scrollable.style.minHeight.indexOf("px")) - 45) + "px"
              }
            )
          }
        },
        0
      )
    },
    []
  )
  
  useEffect(
    () => {
      global.App.initSlimScroll(document.querySelector('.scrollable-fix'))
      global.window.addEventListener('resize', resizeScrollFix)
      resizeScrollFix()
      return () => {
        global.window.removeEventListener('resize', resizeScrollFix)
        global.App.destroySlimScroll(document.querySelector('.scrollable-fix'))
        props.actions.initializeReduxState()
      }
    },
    []
  )

  useEffect(
    () => {
      let inYes = document.querySelector(".in-yes")
      let shouldFocus = document.querySelector(".shouldFocus")
      if(inYes && inYes.className.indexOf(" in ") === -1 ){
        setTimeout(()=>{
          window.requestAnimationFrame(
            function(){
              inYes.className += " in "
              shouldFocus.focus()
              shouldFocus.select()
            }
          )
        },100)
      }
    }
  )

  function handleAddNoteInput (event) {
    event.preventDefault()
    setAddNoteModal({
      inputValue: event.target.value,
      visible: true
    })
  }

  function addNote (event) {
    event.preventDefault()
    if (addNoteModal.inputValue.trim().length > 0) {
      props.actions.addNoteAsync({
        title: addNoteModal.inputValue
      })
      dismissAddNoteModal()
      let shouldFocus = document.querySelector(".shouldFocus2")
      setTimeout(
        () => {
          window.requestAnimationFrame(
            () => {
              shouldFocus.focus()
              shouldFocus.select()
            }
          )
        },
        500
      )
    }
  }

  function deleteNote (event) {
    event.preventDefault()
    const { id } = deleteModal
    props.deleteFromEditedNotes(id)
    props.actions.deleteNoteAsync({ id })
    dismissDeleteModal()
  }

  function showDeleteModal (event) {
    let id = event.currentTarget.getAttribute('data-note-id')
    id = +id
    setDeleteModal({ visible : true, id })
  }

  function showAddNoteModal (event) {
    setAddNoteModal({ visible: true })
  }
  
  function selectActiveNote (event) {
    let selectedNoteId = +(event.currentTarget.getAttribute('data-note-id'))
    props.actions.setRootReduxStateProp_multiple({ selectedNote: true, selectedNoteId })
  }
  
  function dismissDeleteModal (event) {
    let inYes = document.querySelector('.in-yes')
    if(inYes && inYes.className.indexOf(' in ') !== -1 ){
      window.requestAnimationFrame(() => {
        inYes.className = inYes.className.slice(0, inYes.className.indexOf(' in '))
      })
      setTimeout(() => setDeleteModal({visible: false, id: false}), 100)
    }
  }
  
  function dismissAddNoteModal () {
    let inYes = document.querySelector('.in-yes')
    if(inYes && inYes.className.indexOf(' in ') !== -1 ){
      window.requestAnimationFrame(() => {
        inYes.className = inYes.className.slice(0, inYes.className.indexOf(' in '))
      })
      setTimeout(() => setAddNoteModal({ visible: false, inputValue: '' }), 100)
    }
  }
  
  function getNoteItemContent (noteId) {
    // if content edited , get edited content to show
    let match = Object.keys(props.editedNotes).findIndex(editedNoteId => +editedNoteId === noteId)
    if (match !== -1) {// matched edited note and edited version should be displayed
      return props.editedNotes[noteId]["newInput"]
    }
    return false
  }
  
  function filterNotes (notes) {
    return notes.filter( 
      note => {
        let noteItemContent = getNoteItemContent(note.id)
        let noteContent = noteItemContent === false ? note.note : noteItemContent
        return  (note.title.toLowerCase().indexOf(filter) !== -1) || (noteContent.toLowerCase().indexOf(filter) !== -1)
      }
    )
  }
  
  function getNoteItems (notes) { // only gets called when notes is an array
    let notesToMap = filter.trim() === '' ? notes : filterNotes(notes)
    if (notesToMap.length < notes.length) {
      if (notesToMap.length > 0 && props.activeNoteId !== notesToMap[0]["id"]) {
        if (!alreadyChangedActive) {
          setTimeout(
            () => {
              props.actions.setRootReduxStateProp_multiple({
                selectedNote: true,
                selectedNoteId: notesToMap[0]["id"]
              })
              setAlreadyChangedActive(true)
            },
            500
          )
        }
      }else if (notesToMap.length === 0) {
        setTimeout(() => props.actions.setRootReduxStateProp_multiple({ selectedNote: false, selectedNoteId: false }), 500)
      }
    }

    return notesToMap.map( 
      (note,index) => {
        let noteItemContent = getNoteItemContent(note.id)
        let noteContent = noteItemContent === false ? note.note : noteItemContent

        return (
          <li
            className={ classNames({
              'list-group-item hover': true,
              'active': props.activeNoteId === note.id
            }) }
            data-note-id={ note.id }
            onClick={ selectActiveNote }
            key={ index }
          >
            <div className="note-entry" id={note.id}>
              <button
                className="destroy close hover-action"
                style={{ 
                  padding: '20px', 
                  marginTop : '-10px', 
                  marginRight : '-10px',
                  backgroundPosition: 'center' 
                }}
                data-note-id={note.id}
                onClick={showDeleteModal}
              >
                ×
              </button>
              <div className="note-title"> <strong> {note.title} </strong> </div>
              <div className="note-message">
               {noteContent}
              </div>
              <span className="note-date">
                {props.handleDateFormat(note.created_at)}
              </span>
            </div>
          </li>
        )
    })
  }

  function handleFilterChange (event) {
    setFilter(event.target.value)
    setAlreadyChangedActive(false)
  }

  return (
    <div>
      <div className="col-md-3">
        <div>
          <span style={{fontSize:"22px", fontWeight:"600"}} className="font-blue-dark">Notebook</span>
          <a className="btn btn-icon-only btn-topbar pull-right"
          onClick={ showAddNoteModal }
          >
            <i className="fa fa-plus"></i>
          </a>
        </div>
        <div style={{marginTop:"10px",marginBottom:"10px"}}>
          <div className="input-icon left">
            <i className="fa fa-search"></i>
            <input
              type="text"
              value={filter}
              onChange={ handleFilterChange }
              className="form-control"
              placeholder="filter" 
            />
          </div>
        </div>
        <ul id="note-items" className="scrollable-fix list-group list-group-sp">
          {/*  Assumes props.notes is an array or false */}
          {props.notes && getNoteItems(props.notes)}
        </ul>
      </div>
      <div
        className={
          addNoteModal.visible 
          ? "modal modal-themed fade in-yes" 
          : "modal modal-themed fade"
        }
        style={addNoteModal.visible ? {display:"block"} : {display:"none"}}
        id="add_note" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form role="form" autoComplete="off">
              <div className="modal-header">
                <button
                  type="button" className="close" data-dismiss="modal" aria-hidden="true"
                  onClick={ dismissAddNoteModal }
                />
                <h4 className="modal-title">
                  New Note
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-body">
                  <div className="form-group">
                    <label>Title</label>
                    <div className="input-group">
                      <span className="input-group-addon">
                        <i className="fa fa-edit"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control shouldFocus"
                        value={addNoteModal.inputValue || ""}
                        onChange={ handleAddNoteInput }
                        placeholder="Type the note title" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={ dismissAddNoteModal }
                  type="button" className="btn dark btn-outline" data-dismiss="modal"
                >
                  CLOSE
                </button>
                <button
                  onClick={ addNote }
                  type="submit" 
                  className="btn green"
                >
                  ADD NOTE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className={ classNames({
          'modal fade modal-themed'  : true,
          'in-yes'      : deleteModal.visible
        }) }
        data-backdrop="static"
        id="delete_note" tabIndex="-1" role="dialog" aria-hidden="true"
        style={deleteModal.visible ? {display:"block"} : {display:"none"}}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal" aria-hidden="true"
                onClick={ dismissDeleteModal }
              />
              <h4 className="modal-title">
                Delete Note
              </h4>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this note?
            </div>
            <div className="modal-footer">
              <button
                type="button" className="btn dark btn-outline" data-dismiss="modal"
                onClick={ dismissDeleteModal }
              >
                CLOSE
              </button>
              <button
                type="button" 
                className="btn btn-danger"
                onClick={ deleteNote }
              >
                DELETE NOTE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesLeftside