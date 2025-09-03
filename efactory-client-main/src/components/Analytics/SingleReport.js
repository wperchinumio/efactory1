import React from 'react'
import { Link } from 'react-router-dom'

const SingleReport = ({
  description,
  iconClassname,
  id,
  title
}) => {
  return (
    <div className="single-report-analytics col-xl-12 col-sm-6 col-md-6 col-lg-4 order-single-report noselect">
      <Link to={`/orders/analytics/${id}`} >
        <div className="widget-thumb widget-bg-color-white margin-bottom-20 bordered">
          <h4 className="widget-thumb-heading font-dark">
            { title }
          </h4>
          <div className="widget-thumb-wrap">
            <i className={ iconClassname }></i>
            <div className="widget-thumb-body">
              <span className="widget-thumb-subtitle">
                { description  }
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SingleReport 