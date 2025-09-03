import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

const AnotherUserLoggedInModal = props => {
  const firstRun = useRef(true)
  const intervalRef = useRef(null)
  const proceedClickedRef = useRef(null)
  const [timeoutSeconds, setTimeoutSeconds] = useState(0)
  const timeoutSecondsRef = useRef(null)
  timeoutSecondsRef.current = timeoutSeconds

  const handleModalOpening = useCallback(
    () => {
      // on modal opened
      intervalRef.current = setInterval(
        () => {
          if (timeoutSecondsRef.current < 30) {
            setTimeoutSeconds( t => t + 1 )
          } else {
            clearInterval(intervalRef.current)
            global.$('#another-user-logged-in').modal('hide')
            props.handleForceLogoutTimeout()
          }
        }, 
        1000
      )
    },
    []
  )

  const handleModalClosing = useCallback(
    () => {
      clearInterval(intervalRef.current)
      setTimeoutSeconds(0)
    },
    []
  )

  useEffect(
    () => {
      global.$('#another-user-logged-in').on('show.bs.modal', handleModalOpening )
      global.$('#another-user-logged-in').on('hidden.bs.modal', handleModalClosing )
      return () => {
        global.$('#another-user-logged-in').off('show.bs.modal', handleModalOpening )
        global.$('#another-user-logged-in').off('hidden.bs.modal', handleModalClosing )
        clearInterval(intervalRef.current)
      }
    },
    []
  )
  
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (timeoutSeconds === 0) {
        if (proceedClickedRef.current) {
          props.proceed(intervalRef.current)
          proceedClickedRef.current = false
        }
      }
    },
    [timeoutSeconds]
  ) 

  function onProceedClicked () {
    proceedClickedRef.current = true
  }

  let maxValue = 30
  let barPercentage = 100 - ( timeoutSeconds * ( 100 / maxValue ) )
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="another-user-logged-in"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content"
          style={{ width: '80%', marginLeft: '10%' }}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">
              Proceed to login
            </h4>
          </div>
          <div className="modal-body" style={{marginBottom: "20px"}}>
            The same username is already logged in. If you decide to proceed, you will <span className="sbold">force out</span> the other user.
            <br/><br/>
            Would you like to proceed? 
          </div>

          <div 
            className="progress progress-striped active"
            style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '40px', }}
          >
            <div 
              className="progress-bar progress-bar-info" 
              role="progressbar" 
              aria-valuenow={timeoutSeconds}
              aria-valuemin="0" 
              aria-valuemax={maxValue}
              style={{ width : `${barPercentage}%` }}
            >
              <span className="sr-only"> {barPercentage}% Complete </span>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop : '-40px' }} >

            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={ onProceedClicked }
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

AnotherUserLoggedInModal.propTypes = {
  proceed: PropTypes.func.isRequired,
  handleForceLogoutTimeout: PropTypes.func.isRequired,
}

export default AnotherUserLoggedInModal