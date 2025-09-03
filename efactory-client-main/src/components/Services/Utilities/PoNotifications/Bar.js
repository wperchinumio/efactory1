import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const PoBar = props => {
  const firstRun = useRef(true)
  const [loading, setLoading] = useState(false)

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (loading && props.po.savingPoNotification) {
        setLoading(false)
      }
    },
    [props.po.savingPoNotification]
  )

  function addNotification (event) {
    setLoading(true)
    props.poActions.savePoNotification()
  }

  function onNewNotificationClicked (event) {
    if (props.po.form_dirty) {
      global.$('#new-notification').modal('show')
    } else {
      approveNewNotification()
    }
  }

  function approveNewNotification (event) {
    let { poActions } = props
    poActions.initializeReduxState().then( () => poActions.setRootReduxStateProp('new_po_notification', true) )
  }

  let { form_dirty }  = props.po
  let add_notification_button_disabled = !form_dirty

  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i>
            { ' ' }
            <span className="sbold">PO</span> | Notifications
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          type="button"
          onClick={onNewNotificationClicked}
        >
          <i className="fa fa-file-o"></i>
          NEW PO NOTIFICATION
        </button>
        <span style={{display: "inline-block", padding: "0 3px"}} >|</span>
        <ButtonLoading
          className="btn btn-topbar btn-sm"
          type="button"
          disabled={add_notification_button_disabled}
          iconClassName="fa fa-cloud-upload"
          handleClick={addNotification}
          name={'SEND PO NOTIFICATION'}
          loading={loading}
        />
      </div>
    </div>
  )
}

PoBar.propTypes = {
  po: PropTypes.object.isRequired,
  poActions: PropTypes.object.isRequired
}

export default PoBar