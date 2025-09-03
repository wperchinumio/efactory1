import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { formatNumber } from '../../_Helpers/FormatNumber'
import FilterLink from '../FilterLink'

const MultipleValueStat = ({
  colorClassName,
  iconClassName,
  config,
  apps,
  leadingTitles,
  uniqueId,
  customization,
  styleObj
}) => {
  return (
    <div 
      className={ classNames({
        'multiple-value-stat' : true,
        'col-lg-3 col-md-3 col-sm-6 col-xs-12': customization === undefined
      }) }
    >
      <div 
        className={ classNames('dashboard-stat', { [colorClassName]: true }) }
        style={styleObj}
      >
        <div className="visual noprint">
          <i className={ iconClassName }></i>
        </div>
        <div className="multi-stat-title">
          <span>{ `${leadingTitles[ 0 ]} ${leadingTitles[ 1 ]}` }</span>
        </div>
        <div className="multi-stat-section">
          {
            config.map( ({
              value,
              title,
              app_id,
              filters,
              filter_route
            }, index) => {
              return <div key={ `MultipleValueStat-${title}-${index}-${uniqueId}` } className="a-multi-stat-section">
                {
                  ( apps.includes( app_id ) &&  customization === undefined ) ?
                    filters ? 
                      <FilterLink
                        className={ classNames({
                          'text-decoration-none' : true,
                          'no-filter-route' : !filter_route
                        }) }
                        to={ filter_route }
                        filters={ filters }
                      >
                        <span className="title-value">
                          <span className="stat-title">
                            { formatNumber( value , 0 ) }
                          </span>
                          <span className="stat-value"> 
                            { title } 
                          </span>
                        </span>
                      </FilterLink>
                      : <Link
                          to={ filter_route || '/'  }
                          className={ classNames({
                            'text-decoration-none' : true,
                            'no-filter-route' : !filter_route
                          }) }
                        >
                          <span className="title-value">
                            <span className="stat-title">
                              { formatNumber( value , 0 ) }
                            </span>
                            <span className="stat-value"> 
                              { title } 
                            </span>
                          </span>
                      </Link>
                    : <span className="no-filter-route">
                      <span className="title-value">
                        <span className="stat-title"> { formatNumber( value , 0 ) } </span>
                        <span className="stat-value"> { title } </span>
                      </span>
                    </span>
                }
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MultipleValueStat