import React, { useCallback, useRef, useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as settingsActions from '../Settings/redux/settings'
import ButtonLoading from '../_Shared/Components/ButtonLoading'

const ContactForm = ({
  messageSent,
  settingsActions,
  sendingInquiry
}) => {
  const isFirstRun = useRef(true)
  const fileInputEl = useRef(null)
  const [type, setType] = useState('idea')
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)

  useEffect(
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      global.$('#contact').modal('hide')
    },
    [messageSent]
  )

  const handleModalOpening = useCallback(
    () => resetForm(),
    []
  )
  
  useEffect(
    () => {
      global.$('#contact').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#contact').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function sendFeedBack () {
    let { uploadDocument } = settingsActions
    uploadDocument({
      type, message, file
    })
  }

  function resetForm () {
    setType('idea')
    setFileName('')
    setMessage('')
    setFile(null)
    global.$('#contact-form')[0].reset()
  }

  function onChangeFile (event) {
    if ( event.target.files[0] && event.target.files[0].size > 5000000) {
      resetForm()
      setFileName('[Error: file size limit 5MB]')
    }
    else {
      setFile(event.target.files[0] || null)
      setFileName(event.target.files[0].name || '')
    }
  }

  return (
    <div>
      <div 
        className="modal modal-themed fade" 
        id="contact" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="uppercase"><i className="fa fa-comments font-green-soft" style={{fontSize: "25px"}}></i> Feedback</h4>
            </div>
            <div className="modal-body" style={{paddingTop: 0}}>
              <div>
                <p style={{fontWeight: 400}}>Please tell us what you think. Any kind of feedback is highly appreciated.</p>
              </div>
              <form autoComplete="off" id="contact-form" onSubmit={ event => {
                event.preventDefault()
                sendFeedBack()
              } } >
                <div style={{marginBottom: "10px"}}>
                  <div className="btn-group btn-group-devided" data-toggle="buttons">
                    <label
                      className={ classNames({
                        'btn btn-circle btn-transparent' : true,
                        'blue-hoki active' : type === 'idea',
                        'grey-salsa' : type !== 'idea'
                      }) }
                      onClick={ event => setType('idea')}
                    >
                      <input type="radio" name="options" className="toggle" id="option1"/>
                      Idea
                    </label>
                    <label
                      className={ classNames({
                        'btn btn-circle btn-transparent' : true,
                        'blue-hoki active' : type === 'question',
                        'grey-salsa' : type !== 'question'
                      }) }
                      onClick={ event => setType('question')}
                    >
                      <input type="radio" name="options" className="toggle" id="option2"/>
                      Question
                    </label>
                    <label
                      className={ classNames({
                        'btn btn-circle btn-transparent' : true,
                        'blue-hoki active' : type === 'problem',
                        'grey-salsa' : type !== 'problem'
                      }) }
                      onClick={ event => setType('problem') }
                    >
                      <input type="radio" name="options" className="toggle" id="option3"/>
                      Problem
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    rows="8"
                    name="message"
                    placeholder="Your feedback"
                    className="form-control"
                    value={ message ? message : '' }
                    onChange={ event => setMessage(event.target.value) }
                  ></textarea>
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-default btn-file"
                    onClick={ event => {
                      event.preventDefault()
                      fileInputEl.current.click()
                    } }
                  >Attach a file... </button>
                  <label >

                  <input
                    type="file"
                    name="file"
                    ref={fileInputEl}
                    className="hidden"
                    id="contact-file"
                    onChange={ onChangeFile }
                  />
                  </label>
                  &nbsp;
                  <label>{fileName}</label>
                </div>

                <button
                  type="reset"
                  className="btn grey"
                  onClick={ resetForm }
                >
                  Reset
                </button>
                <span className="pull-right" >
                  <button
                    type="button"
                    className="btn btn-default btn-outline"
                    style={{ marginRight : '5px' }}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <ButtonLoading
                    className={ classNames({
                      'btn green-soft' : true,
                      'disabled' : !(message && type)
                    }) }
                    type="submit"
                    handleClick={ event => {
                      event.preventDefault()
                      sendFeedBack()
                    } }
                    name={'Submit'}
                    disabled={!(message && type)}
                    loading={ sendingInquiry }
                  />
                </span>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    messageSent : state.common.settings.messageSent,
    sendingInquiry : state.common.settings.sendingInquiry
  }),
  dispatch => ({
    settingsActions : bindActionCreators( settingsActions, dispatch )
  })
)(ContactForm)