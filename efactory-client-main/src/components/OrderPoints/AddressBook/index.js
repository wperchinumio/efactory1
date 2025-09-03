import React, { useState, useEffect } from 'react'
import { curryN } from 'ramda'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import history from '../../../history'
import * as addressActions_ from './redux'
import PageBar from './PageBar'
import Pagination from './Pagination'
import ImportAddressesModal from './ImportAddressesModal'
import OrderDetails from '../../DetailPages/OrderDetail/_Content'
import { useDebounce } from '../../_Shared/hooks'

const AddressBook = ({
  addressActions,
  allAddresses = {},
  loading,
  location,
  onDoubleClick,
  pageBarVisible,
  search3Fields,
}) => {

  const [duplicateTitle, setDuplicateTitle] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(
    () => {
      addressActions.setRootReduxStateProp_multiple({
        activePagination : 1,
        filter           : null
      })
      if( pageBarVisible ) {
        addressActions.getAddressesAsync()
      }
    },
    []
  )

  useEffect(
    () => {
      if( loading ){
        global.App.blockUI({ animate: true })
      }else{
        global.App.unblockUI();
      }
    },
    [loading]
  )

  useEffect(
    () => {
      global.$('#address_popup_duplicate').modal('show')
      if( allAddresses.duplicatedAddress ){
        setDuplicateTitle('')
      }
    },
    [allAddresses.duplicatingAddress]
  )

  const debouncedFilterValue = useDebounce(filterValue, 200);

  useEffect(
    () => {
      addressActions.setRootReduxStateProp(
        'filter', 
        {
          field : '*',
          value: debouncedFilterValue
        }
      ).then(
        () => {
          addressActions.getAddressesAsync()
        }
      )
    },
    [debouncedFilterValue]
  )

  function selectActiveAddress (activeAddress) {
    addressActions.setRootReduxStateProp_multiple({ activeAddress })
  }

  const getAllAddressesRows = (addresses = []) => {
    let { activeAddress = {}, activePagination = 1, page_size } = allAddresses
    let { id = '' } = activeAddress

    return addresses.map( ( address, addressIndex ) => {

      let { ship_to = {}, bill_to = {}, id : addressId } = address

      return (
        <tr
          className={ classNames({
            "odd gradeX clickable-row ui-sortable-handle" : true,
            "active" : id === addressId
          }) }
          key={ `allAddresses-${addressIndex}` }
          onDoubleClick={event => {
            if( activeAddress && pageBarVisible ){
              history.push('/orderpoints/addressbook/edit')
            }else if( activeAddress && !pageBarVisible ){
              onDoubleClick()
            }
          }}
          onClick={curryN(2,selectActiveAddress)(address)}
        >
          <td className="op_counter">{ ( ( +activePagination - 1 ) * +page_size ) + addressIndex + 1 } </td>
          <td className="op_title text-nowrap"> {address.title} </td>
          { Object.keys( ship_to ).length &&
            <td className="text-address">
              <i className="font-blue-soft">
                {`${ship_to.company || ''} ${ship_to.company && ship_to.attention ? '|' : ''} ${ship_to.attention || ''}`}
              </i><br/>
              { ship_to.address1 }<br/>
              { `${ship_to.city}${ship_to.city && ship_to.state_province ? ', ' : ''}${ship_to.state_province}
              ${ship_to.postal_code}${ship_to.country ? ' - ' : ''}${ship_to.country}` }
            </td>
          }
          { Object.keys( bill_to ).length &&
            <td className="text-address">
              <i className="font-blue-soft">
                {`${bill_to.company || ''} ${bill_to.company && bill_to.attention ? '|' : ''} ${bill_to.attention || ''}`}
                </i><br/>
              { bill_to.address1 }<br/>
              { `${bill_to.city}${bill_to.city && bill_to.state_province ? ', ' : ''}${bill_to.state_province}
              ${bill_to.postal_code}${bill_to.country ? ' - ' : ''}${bill_to.country}` }
            </td>
          }
        </tr>)
   } )

  }

  const handleDuplicateAddress = event => {
    global.$('#duplicate_address_main').modal('hide')
    addressActions.duplicateAddressAsync( {
      ...allAddresses.activeAddress,
      title : duplicateTitle
    } )
  }

  const handleDuplicateTitleInput = event => {
    setDuplicateTitle(event.target.value)
  }

  const handleFirstDuplicateClick = () => {
    setDuplicateTitle('Copy of ' + allAddresses.activeAddress.title)
  }  

  const downloadAddresses = () => {
    addressActions.downloadAddressesAsync()
  }

  const handleDeleteClick = event => {
    addressActions.deleteAddressAsync(allAddresses.activeAddress.id)
    global.$('#delete_address_main').modal('hide')
  }

  const filterAddresses = () => {
    let { filterValue = '' } = allAddresses
    filterValue = filterValue.trim()
    let { addresses = [] } = allAddresses
    addresses = [ ...addresses ]
    if( filterValue.length ){
      filterValue = filterValue.toLowerCase()
      addresses = addresses.filter( address => {
        let { title = '', ship_to = {}, bill_to = {} } = address
        let {
          attention = '',
          address1 = '',
          city = '',
          state_province = '',
          postal_code = '',
          country = '',
          company
        } = ship_to
        let {
          attention : b_attention,
          address1 : b_address1,
          city : b_city,
          state_province : b_state_province,
          postal_code : b_postal_code,
          country : b_country,
          company : b_company
        } = bill_to
        b_attention = b_attention || ''
        b_address1 = b_address1 || ''
        b_city = b_city || ''
        b_state_province = b_state_province || ''
        b_postal_code = b_postal_code || ''
        b_country = b_country || ''
        b_attention = b_attention || ''
        if( search3Fields ){

          return  String(title).toLowerCase().includes(filterValue) ||
                  String(attention).toLowerCase().includes(filterValue) ||
                  String(company).toLowerCase().includes(filterValue)
        }
        return  String(title).toLowerCase().includes(filterValue) ||
                String(attention).toLowerCase().includes(filterValue) ||
                String(address1).toLowerCase().includes(filterValue) ||
                String(city).toLowerCase().includes(filterValue) ||
                String(state_province).toLowerCase().includes(filterValue) ||
                String(postal_code).toLowerCase().includes(filterValue) ||
                String(country).toLowerCase().includes(filterValue) ||
                String(company).toLowerCase().includes(filterValue) ||
                String(b_attention).toLowerCase().includes(filterValue) ||
                String(b_address1).toLowerCase().includes(filterValue) ||
                String(b_city).toLowerCase().includes(filterValue) ||
                String(b_state_province).toLowerCase().includes(filterValue) ||
                String(b_postal_code).toLowerCase().includes(filterValue) ||
                String(b_country).toLowerCase().includes(filterValue) ||
                String(b_company).toLowerCase().includes(filterValue)
      })
    }
    return addresses
  }

  const paginate = page_num => {
    addressActions.setRootReduxStateProp('activePagination', page_num ).then(
      () => {
        addressActions.getAddressesAsync()
      }
    )
  }

  const onFilterValueChange = event => {
    let { value } = event.target
    setFilterValue(value)
  }

  let {
    activePagination,
    page_size,
    total
  } = allAddresses

  let addresses = filterAddresses()

  let isOrderDetailDisplay  = false

  if( location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  return (
    <div id="all_addresses">
      
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
      
        {
          pageBarVisible &&
          <PageBar
            duplicateClicked={ handleFirstDuplicateClick }
            exportAddresses={ downloadAddresses }
            addressActions={ addressActions }
          />
        }

        <div className={ classNames({
          "container-page-bar-fixed" : pageBarVisible
        }) } >
          <div className="portlet light bordered">
            <div className="portlet-title">
              <div className="caption caption-md font-dark">
                <i className="fa fa-location-arrow font-blue"></i>
                <span className="caption-subject bold uppercase font-blue">
                  Total contacts: <strong className="font-dark">{ total }</strong>
                </span>
              </div>
              <div className="inputs">
                <div className="portlet-input input-inline input-large">
                  <div className="input-icon right">
                    <i className="icon-magnifier"></i>
                    <input
                      className="form-control input-circle"
                      placeholder="filter"
                      value={filterValue}
                      onChange={ onFilterValueChange }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover order-column row-sortable table-clickable">
                  <thead>
                  <tr className="uppercase table-header-1">
                    <th> # </th>
                    <th> Title </th>
                    <th> Shipping Address </th>
                    <th> Billing Address </th>
                  </tr>
                  </thead>
                  <tbody className="ui-sortable">
                    { getAllAddressesRows(addresses) }
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              totalAddresses={ total }
              activePagination={ activePagination }
              paginate={ paginate }
              page_size={ page_size }
            />

          </div>
        </div>

        <div
          className="modal modal-themed fade" 
          id="delete_address_main" 
          tabIndex="-1" 
          role="dialog" 
          aria-hidden={true}
          data-backdrop="static"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
                <h4 className="modal-title">Delete Address</h4>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this address?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger"
                  onClick={ event => { handleDeleteClick() } }
                >Delete address</button>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="modal modal-themed fade" 
          id="duplicate_address_main" 
          tabIndex="-1" 
          role="dialog" 
          aria-hidden={true}
          data-backdrop="static"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form role="form" autoComplete="off">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
                  <h4 className="modal-title">Duplicate Address</h4>
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
                          className="form-control" 
                          placeholder="Type the address title"
                          value={ duplicateTitle }
                          onChange={ handleDuplicateTitleInput }
                        /> </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal-footer furkan"
                  style={ pageBarVisible ? {} : { marginTop : '-40px' } } >
                  <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
                  <button type="submit"
                    className="btn green"
                    onClick={ event => {
                      event.preventDefault()
                      handleDuplicateAddress()
                    } }
                  >Duplicate Address</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <ImportAddressesModal 
          addressActions={ addressActions }
          allAddresses={ allAddresses }
        />  

      </div>
      { 
      window.location.pathname !== '/orderpoints' &&
      isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
    </div>
  )
}

AddressBook.propTypes = {
  pageBarVisible : PropTypes.bool,
  /* search company, attention and title only when filtered */
  search3Fields : PropTypes.bool,
  onDoubleClick : PropTypes.func
}

AddressBook.defaultProps = {
  pageBarVisible : true,
  search3Fields : false
}

export default withRouter(
  connect(
    state => ({
      allAddresses : state.addressBook.allAddresses,
    }),
    dispatch => ({
      addressActions : bindActionCreators( addressActions_, dispatch )
    })
  )(AddressBook)
)