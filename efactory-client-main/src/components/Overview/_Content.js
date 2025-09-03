import React from 'react'
import { withRouter } from 'react-router-dom'
import Overview from './Overview'
import Notes from '../Notes/_Content'

const OverviewDefaultBody = props => {
  let { 
    location,
    config
  } = props

  const {
    pathname,
    search
  } = location

  return (
    <div>
      { 
        (
          (
            !search && 
            ( 
              pathname.indexOf("overview") === 0 || 
              pathname === "/overview"
            )
          ) 
          ||      
          (
            search.indexOf("?orderNum=") === 0 ||
            search.indexOf("?itemNum=") === 0
          )
        )
        &&  
        <Overview 
          location={props.location}
          config={ config }
        /> 
      }
      { 
        pathname.indexOf("/overview/notes") === 0 && 
        <Notes/> 
      }
    </div>
  )
}

export default withRouter(OverviewDefaultBody) 