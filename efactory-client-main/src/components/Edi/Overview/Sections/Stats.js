import React from 'react'
import DashboardStat from '../DashboardStat'

const Stats = ({
  sub_areas,
  ediState
}) => {
  return (
    <div className="row">
      {
        sub_areas.map(
          ({ name, visible }) => {
            if( visible ){
              return <DashboardStat
                ediState={ ediState } 
                name={ name }
                key={ name }
              />
            }
            return '';
          }
        )
      }
    </div>
  )
}

export default Stats