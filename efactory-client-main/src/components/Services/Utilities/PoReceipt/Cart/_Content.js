import React from 'react'
import PropTypes from 'prop-types'
import CartTable from './Table/_Content'

const ReviewItems = ({ poReceiptState, poReceiptActions }) => {
  return (
    <div>
      <CartTable 
        poReceiptState={ poReceiptState }
        poReceiptActions={ poReceiptActions }
      />
    </div>
  )
}

ReviewItems.propTypes = {
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default ReviewItems