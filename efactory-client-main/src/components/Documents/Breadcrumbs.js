import React from 'react'
import PropTypes from 'prop-types'

const Breadcrumbs = ({
  breadcrumbs = [],
  onBreadcrumbClick,
  rootPath
}) => {
  return (
    <div>
      { 
        breadcrumbs.length === 0 &&
        <span>{ rootPath }</span>  
      }
      {
        breadcrumbs.length > 0 && 
        <a onClick={ event => onBreadcrumbClick() }>
          { rootPath }
        </a>
      }
      { 
        breadcrumbs.map( 
          ( breadcrumb, index ) => {
            if( index === breadcrumbs.length - 1 ){
              return (
                <span key={`breadcrumb-${index}`}> 
                  &gt; {breadcrumb.name} 
                </span>
              )
            }
            return (
              <span key={`breadcrumb-${index}`}>
                <span className="inlineFixSpan"> &gt; </span>
                <a onClick={ event => onBreadcrumbClick(breadcrumb.id) }>
                  {breadcrumb.name}
                </a>
              </span>
            )
          }
      )}
    </div>
  )
}

Breadcrumbs.propTypes = {
  rootPath : PropTypes.string.isRequired,
  breadcrumbs : PropTypes.array.isRequired,
  onBreadcrumbClick : PropTypes.func.isRequired
}

export default Breadcrumbs