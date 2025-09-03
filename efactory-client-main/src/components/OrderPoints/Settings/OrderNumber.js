import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'
import RmaGenerationTemplate from '../../_Shared/Components/NumberGenerationTemplate'

const OrderNumber = props => {
  useEffect(
    () => {
      props.settingsActions.readGeneralSettings()
    },
    []
  )

  let { order, settingsActions, loading } = props
  return (
    <div>
      <form autoComplete="off" className="form-horizontal">
        <div className="row no-margins">
          <div className="col-lg-8 col-md-12">
            <p>
              You have the choice to <b>manually</b> enter the order number
              or have the system <b>automatically</b> generate and assign a unique order number.
            </p>
            <div className="note note-warning">
              <p> <b>Be careful</b> if you switch from manual to automatic order number generation: make sure new order numbers do not match with pre-existing order numbers (duplicated order numbers are not allowed).</p>
            </div>
          </div>
        </div>
        <RmaGenerationTemplate
          isOrderPoints={true}
          onFormDataChange={
            formData => settingsActions.setRootReduxStateProp({
              field : 'order',
              value : formData
            })
          }
          formData={ order }
          title={ 'Order Number Generation' }
          className={'col-lg-8 col-md-12'}
        />

        <div className="row no-margins">
          <p className="col-lg-8 col-md-12">
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              handleClick={ event => settingsActions.updateGeneralSettings() }
              name={'Save Changes'}
              loading={loading}
            />
          </p>
        </div>
      </form>
    </div>
  )
}

OrderNumber.propTypes = {
  settingsActions: PropTypes.object.isRequired,
  order : PropTypes.shape({
    manual: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    starting_number: PropTypes.any,
    minimum_number_of_digits: PropTypes.any
  }).isRequired
}

export default connect(
  state => ({
    order : state.orderPoints.settings.order,
    loading : state.orderPoints.settings.loading
  })
)(OrderNumber)