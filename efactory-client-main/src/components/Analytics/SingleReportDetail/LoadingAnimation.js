import React from 'react'

const LoadingAnimation = () => {
  return (
    <div className='tetrominos'>
      <div className='tetromino box1'></div>
      <div className='tetromino box2'></div>
      <div className='tetromino box3'></div>
      <div className='tetromino box4'></div>
    </div>
  )
}

export default React.memo(LoadingAnimation)