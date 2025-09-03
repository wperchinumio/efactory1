import React from 'react'
import classNames from 'classnames'
import rmaConfig from '../ReturnTrak/Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'

const RMAType = props => {
  let { rma_type_code, rma_type_name } = props
  return (      
    <span>
      <i 
        className={ classNames({
          'fa fa-arrow-down' : true,
          'font-red-soft' : rma_type_code && rmaConfig[rma_type_code][1][0]
        }) }
      ></i>
      <i className={ classNames({
        'fa fa-arrow-up' : true,
        'font-grey-salsa': rma_type_code && !rmaConfig[ rma_type_code ][1][1],
        'font-blue-soft' : rma_type_code && rmaConfig[ rma_type_code ][1][1]
      }) }></i>
      &nbsp;
      <span className="bold" >
        { rma_type_code }
      </span> 
      <br/> 
      <span className="small" >
        { rma_type_name }
      </span>
    </span>           
  )  
}

export default RMAType