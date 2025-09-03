import React from 'react'
import PropTypes from 'prop-types'
import CartTable from './Table/_Content'

const ReviewItems = ({ poRmaState, poRmaActions }) => {
  return (
    <div>
      <CartTable 
        poRmaState={poRmaState}
        poRmaActions={poRmaActions}
      />
    </div>
  )
}

ReviewItems.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default ReviewItems