import React from 'react'

const TopHeader = ({ dcl_order_number_searched, searched }) => {
  return (
    <div
      className="addr-type items-title"
      style={{height: "40px", verticalAlign: "middle", lineHeight: "33px", overflow: "hidden"}}
    >
      <div>
        <div  className="col-md-12" style={{display: "inline-block"}}>
          <span style={ searched ? {} : { display : 'none' } }>
            <span className="font-dark">
              <span className="sbold"> ORDER #: </span> <span style={{ fontWeight : '500' }}> { dcl_order_number_searched } </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default TopHeader