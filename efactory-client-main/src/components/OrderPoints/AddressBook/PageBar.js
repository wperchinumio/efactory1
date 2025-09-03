import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const PageBar = props => {
  function handleDuplicateClick (event) {
    let { activeAddress } = props
    if (activeAddress === null) {
      event.preventDefault() 
      return
    } else { 
      props.duplicateClicked() 
    }  
  }

  function handleExportClick () {
    props.exportAddresses()
  }

  let { activeAddress } = props.allAddresses
  
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption font-green-seagreen">
          <i className="fa fa-location-arrow"></i>
          <span className="caption-subject"><span className="sbold">ORDERPOINTS</span> - ADDRESS BOOK</span>
        </div>
      </div>
      <div className="page-toolbar">
        <Link 
          to="/orderpoints/addressbook/add" 
          type="button"
          className="btn btn-topbar btn-sm"
          id="address-edit-btn"
        >
          <i className="fa fa-plus"></i>
          Add
        </Link>
        { ' ' }
        <Link 
          to="/orderpoints/addressbook/edit" 
          type="button"
          onClick={ event => { 
            if( !activeAddress ){ 
              event.preventDefault()
            } 
          }}
          className="btn btn-topbar btn-sm"
          disabled={ !activeAddress }
          id="address-edit-btn"
        >
          <i className="fa fa-edit"></i>
          Edit
        </Link>
        { ' ' }
        <button 
          type="button" 
          className="btn btn-topbar btn-sm" 
          id="address-duplicate-btn"
          data-toggle="modal" href="#duplicate_address_main"
          disabled={ !activeAddress }
          onClick={ event => handleDuplicateClick(event) }
        >
          <i className="fa fa-copy"></i>
          Duplicate
        </button>
        { ' ' }
        <button 
          type="button" 
          className="btn red-soft btn-sm" 
          id="address-delete-btn"
          data-toggle="modal" 
          href="#delete_address_main"
          disabled={ !activeAddress }
        >
          <i className="fa fa-trash"></i> 
          Delete
        </button>
        { ' | ' }
        <div className="btn-group ">
          <a className="btn btn-topbar btn-sm uppercase sbold" href="#" data-toggle="dropdown">
            <i className="icon-wrench"></i>
            Actions  &nbsp;
            <i className="fa fa-angle-down"></i>
          </a>
          <ul className="dropdown-menu pull-right ">                                                
            <li>
              <a href="#" onClick={event => handleExportClick() }>
                <i className="fa fa-download"></i> Export to a file
              </a>
            </li>
           
            <li>
              <a href="#import-addresses" data-toggle="modal">
                <i className="fa fa-upload"></i> Import contacts...
              </a>
            </li>
          </ul>
        </div>
      </div>                                   
    </div>
  )
}

PageBar.propTypes = {
  className: PropTypes.string,
  duplicateClicked: PropTypes.func.isRequired,                  
  addressActions: PropTypes.object.isRequired,
  exportAddresses: PropTypes.func.isRequired,
}

export default connect( 
  state => ({
    allAddresses : state.addressBook.allAddresses
  })
)(PageBar)