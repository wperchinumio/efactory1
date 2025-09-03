import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar ({
  title,
  submitDisabled,
  submitLabel,
  handleSubmit
}) {
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption">
          <i className="fa fa-location-arrow font-dark" />
          <span className="caption-subject font-green-seagreen sbold">
             {title}
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <Link 
          to="/orderpoints/addressbook"
          type="button"
          className="btn btn-default btn-sm"
          id="address-cancel-btn"
        >
          Cancel
        </Link>
        &nbsp;
        <button
          type="button"
          className="btn btn-topbar btn-sm"
          id="address-save-btn"
          disabled={ submitDisabled }
          onClick={ handleSubmit }
        >
          <i className="fa fa-save" />
          {submitLabel}
        </button>
      </div>
    </div>
  )
}