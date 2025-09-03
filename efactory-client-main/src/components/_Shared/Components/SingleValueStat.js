import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { formatNumber } from '../../_Helpers/FormatNumber'
import FilterLink from '../FilterLink'

const SingleValueStat = ({  
	colorClassName,
	iconClassName,
	value,
	title,
	app_id,
	filter_route,
	filters,
  apps,
  customization
}) => {
  return (
    <div
      className={ classNames({
        'col-lg-3 col-md-3 col-sm-6 col-xs-12': customization === undefined
      }) }
    >
      <div 
        className={ classNames({
          'dashboard-stat': true,
          [colorClassName]: true
        }) }
      >
        <div className="visual noprint">
          <i className={ iconClassName }></i>
        </div>
        <div className="details">
          <div className="number ng-binding"> { formatNumber( value, 0 ) } </div>
          <div className="desc"> { title } </div>
        </div>
        {
          ( apps.includes( app_id ) &&  customization === undefined ) ?
            filters ? 
              <FilterLink
                className="more"
                to={ filter_route }
                filters={ filters }
              >
                View more
                <i className="m-icon-swapright m-icon-white"></i>
              </FilterLink>
             : <Link
                className="more"
                to={ filter_route }
              >
                View more
                <i className="m-icon-swapright m-icon-white"></i>
              </Link>
          :
          <span className="more" >
            View more
            <i className="m-icon-swapright m-icon-white"></i>
          </span>
        }
      </div>
    </div>
  )
}

export default SingleValueStat