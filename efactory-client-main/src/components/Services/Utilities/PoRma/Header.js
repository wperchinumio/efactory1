import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'
momentLocalizer(moment)

const PoHeader = props => {
  const firstRun = useRef(true)
  const [activeField, setActiveField] = useState('rma_number')
  const [om_number, setOm_number] = useState('')
  const [rma_number, setRma_number] = useState('')

  useEffect(
    () => {
      global.$('#rma_number').focus()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.poRmaState.new_po_rma) {
        setActiveField('rma_number')
        setOm_number('')
        setRma_number('')
        props.poRmaActions.setRootReduxStateProp('new_po_rma', false)
      }
    },
    [props.poRmaState.new_po_rma]
  )

  function onSearchClicked (event) {
    event.preventDefault()
    props.poRmaActions.searchPoRma({
      field: activeField,
      value: activeField === 'rma_number' ? rma_number : om_number
    })
  }

  function onCheckBoxChanged (event) {
    let { name : activeFieldNext } = event.target
    setActiveField(activeFieldNext)
    setTimeout( () => global.$(`#${activeFieldNext}`).focus(), 100 )
  }

  function isSearchDisabled () {
    return (activeField === 'rma_number' ? rma_number : om_number).length === 0
  }

  function setReceiptDateValue (dateObj) {
    props.poRmaActions.setRootReduxStateProp_multiple({
      received_date: moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
    }) 
  }

  let { searched, received_date } = props.poRmaState
  return (
    <div>
      <div className="row no-margins" >
        <div className="col-lg-6 col-md-12">
          <div className="shipping">
            <div className="addr-type">
              <i className="fa fa-book"></i> RMA RECEIPT
            </div>
            <div className="form-group padding-5" style={{marginBottom: "3px"}}>
              <div className="row">
                <div className="col-md-6" style={{ marginTop: '8px' }}>
                  <label className="mt-radio mt-radio-outline noselect" style={{ width: '100px' }}>
                    RMA #:
                    <input 
                      type="radio" 
                      checked={ activeField === 'rma_number' }
                      name="rma_number"
                      onChange={ onCheckBoxChanged }
                    />
                    <span></span>
                  </label>
                  <form onSubmit={ onSearchClicked } autoComplete="off" style={{ display : 'inline-block', width: 'calc( 100% - 100px )' }}>
                    <input 
                      type="text" 
                      disabled={ activeField === 'om_number' }
                      className="input-sm form-control" 
                      id="rma_number"
                      name="rma_number"
                      value={ rma_number }
                      onChange={ event => setRma_number(event.target.value.trim()) }
                    />
                  </form>
                </div>            
                <div className="col-md-6" style={{ marginTop: '8px' }}>
                  <label className="mt-radio mt-radio-outline noselect" style={{ width: '100px' }}>
                    DCL PO #:
                    <input 
                      type="radio" 
                      checked={ activeField === 'om_number' }
                      name="om_number"
                      onChange={ onCheckBoxChanged }
                    />
                    <span></span>
                  </label>
                  <form onSubmit={ onSearchClicked } autoComplete="off" style={{ display : 'inline-block', width: 'calc( 100% - 100px )' }}>
                    <input 
                      type="text" 
                      disabled={ activeField === 'rma_number' }
                      className="input-sm form-control" 
                      id="om_number"
                      name="om_number"
                      value={ om_number }
                      onChange={ event => setOm_number(event.target.value.trim()) }
                    />
                  </form>
                </div>
              </div>
              <div className="row">
                <ButtonLoading
                  className="btn green-soft pull-right"
                  type="button"
                  disabled={ isSearchDisabled() }
                  iconClassName=""
                  handleClick={ onSearchClicked }
                  name={ 'SEARCH' }
                  loading={ false }
                  style={{
                    marginRight : '10px',
                    marginTop : '10px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row no-margins" >
        <div 
          className="col-lg-6 col-md-12 po-table-filter-inputs" 
          style={{ marginBottom: "5px", marginTop: "30px" }}
        >
            <div className="row padding-5">
              <div className="col-md-6">
                <label className="control-label">Received date: </label>
                <DatePicker
                  format="MM/DD/YYYY"
                  name="received_date"
                  disabled={ !searched }
                  onChange={ setReceiptDateValue }
                  time={false}
                  value={ received_date ? moment(received_date).toDate()  : moment().toDate() }
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PoHeader