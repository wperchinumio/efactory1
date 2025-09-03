import React from 'react'

const IconDescriptions = () => {
  return (
    <div className="col-md-12">
      <ul style={{listStyle: "none", paddingLeft: "15px"}}>
        <li>
          <i className="fa fa-circle-o" />
           - Email template not yet set up
        </li>
        <li>
          <i className="fa fa-circle" />
           - Email template composed
        </li>
        <li>
          <i className="fa fa-arrow-down font-red-soft" />
           - DCL expects incoming RMA
        </li>
        <li>
          <i className="fa fa-arrow-up font-blue-soft" />
           - DCL ships replacement
        </li>
      </ul>
    </div>
  )
}

export default React.memo(IconDescriptions)