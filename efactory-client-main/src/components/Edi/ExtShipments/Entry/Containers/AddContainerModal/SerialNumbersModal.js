import React, { useCallback, useState, useEffect, useRef } from 'react'

const SerialNumbersModal = ({
  ediState,
  ediActions
}) => {
  const ediStateRef = useRef(null)
  ediStateRef.current = ediState
  const [serialNumbers, setSerialNumbers] = useState('')

  const handleModalOpening = useCallback(
    () => {
      let {
        serial_numbers_record_index,
        containerItems = []
      } = ediStateRef.current

      let serialNumbersNext = containerItems[ serial_numbers_record_index ] 
                        ? containerItems[ serial_numbers_record_index ]['serial_numbers']
                        : ''
      serialNumbersNext = serialNumbersNext ? serialNumbersNext : ''
      if( serialNumbersNext.length ){
        serialNumbersNext = serialNumbersNext.join('\n')
      }else{
        serialNumbersNext = ''
      }
      setSerialNumbers(serialNumbersNext)
    },
    [ediState]
  )

  useEffect(
    () => {
      global.$('#serial-numbers').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#serial-numbers').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function onSerialNumberChange (event) {
    setSerialNumbers(event.target.value)
  }

  function onAcceptClicked (event) {
    let {
      containerItems,
      serial_numbers_record_index
    } = ediState
    let serialNumbersNext = serialNumbers.split(/( |\n|,|;)/gm).filter( a1 => a1 !== ' ' && a1 !== '\n' && a1 !== ';' && a1 !== ',' && a1 !== '' )
    containerItems = [
      ...containerItems.slice( 0, serial_numbers_record_index ),
      {
        ...containerItems[ serial_numbers_record_index ],
        serial_numbers: serialNumbersNext
      },
      ...containerItems.slice( +serial_numbers_record_index + 1 ),
    ]
    ediActions.setRootReduxStateProp_multiple({
      containerItems
    })
    global.$('#serial-numbers').modal('hide')
  }

  let serial_numbers_splitted = serialNumbers.split(/( |\n|,|;)/gm).filter( a1 => a1 !== ' ' && a1 !== '\n' && a1 !== ';' && a1 !== ',' && a1 !== '' )
  let { serial_format } = ediState
  
  return (
    <div
      className="modal modal-themed fade "
      data-backdrop="static"
      id="serial-numbers"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">
              SERIAL / LOT #
            </h4>
          </div>
          <div className="modal-body" style={{ margin: "10px" }}>
            <p style={{ marginTop: '0px' }}>
              { 'Please separate serial/lot # with any of these separators: , ; <SPACE> or <NEWLINE>.' }
            </p>
            <div className="form-group padding-5" style={{marginBottom: "3px"}}>
              <div className="row">
                <div className="col-md-12">
                  <div style={{ marginBottom: '5px'}}> 
                    <div className="inline-block"> 
                      <span className="bold text-primary">
                        FORMAT:
                      </span>
                      &nbsp;
                      <span className="bold">
                        { serial_format }
                      </span>
                    </div>
                    <div className="inline-block pull-right">
                      <span className="bold text-primary">
                        TOTAL:
                      </span>
                      &nbsp;
                      <span className="bold">
                        { serial_numbers_splitted.length }
                      </span>
                    </div>
                  </div>
                  <textarea 
                    name="" id="" rows="10"
                    className="form-control input-sm uppercase"
                    value={ serialNumbers }
                    onChange={ onSerialNumberChange }
                    style={{ marginBottom : '20px' }}
                  />
                </div>
              </div>
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
              className="btn green"
              data-dismiss="modal"
              onClick={ onAcceptClicked } 
              style={{ marginRight: '10px' }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SerialNumbersModal