import React from 'react'
import { withRouter } from 'react-router-dom'
import SingleReportDetail from '../Analytics/SingleReportDetail/_Content'

const RateCards = ({
    location
  }) => {
  return (
    <div>
        <div>
            {/*Title*/}
            <div className="page-bar orderpoints-page-bar" style={{ margin : '0' }}>
                <div className="page-breadcrumb">
                    <div className="caption" style={{paddingLeft: "35px"}}>
                        <span className="caption-subject font-green-seagreen sbold">
                            <ul className="page-breadcrumb">
                                <li>
                                    <i className="fa fa-truck bold"></i>&nbsp;
                                    <span>
                                        Rate Cards
                                    </span>
                                </li>
                            </ul>
                        </span>
                    </div>
                </div>
                <div className="page-toolbar"></div>
            </div>

            <div>
            <SingleReportDetail 
              id={17}
              key={`single-report-17`}
              pathname={'/services/administration-tasks/invoices/rate-cards'}
            />
            </div>
        </div>
    </div>
  )
}

export default withRouter(RateCards)