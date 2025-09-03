import React from 'react'
import PropTypes from 'prop-types'
import CartTable from './Table/_Content'

const ReviewItems = props => {
  let { po, poActions } = props
  return (
    <div>
      <CartTable 
        po={po}
        poActions={poActions}
      />
    </div>
  )
}

ReviewItems.propTypes = {
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default ReviewItems