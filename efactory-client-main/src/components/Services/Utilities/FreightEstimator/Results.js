import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import warehouses from './Warehouses'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const Results = props => {
  function createTableData ({days, service, air, colSpan, entry}) {
    let dataJsx = []
    dataJsx.push( <td key={`data-key-service`} >
        <span className="sh-cost-carrier">
          { service }
        </span>
      </td>
    )
    for( let i = 0; i < +days - 1; i++ ){
      dataJsx.push( <td key={`data-key-before-${i}`} > &nbsp; </td> )
    }
    dataJsx.push( <td key={`data-key-colspan`} colSpan={colSpan}>
        { entry }
        <span className={ `freight-bar ${ !air ? 'ground' : ''}` }></span>
      </td>
    )
    for( let i = 0; i < (6 - +days - +colSpan + 1 ); i++ ){
      //let width = i + 1 === (6 - +days - +colSpan) ? '20%' : '12%'
      dataJsx.push( <td key={`data-key-after-${i}`} > &nbsp; </td> )
    }
    return dataJsx
  }

  let {
    results,
    calculatedTabs,
    calculatedValues,
    activeTab
  } = props
  results = results[ activeTab ]
  calculatedValues = calculatedValues[ activeTab ]
  let {
    warehouse = '',
    zip_code = '',
    weight = '',
    pieces = ''
  } = calculatedValues

  return (
    <td className="freight-result">
      <div className="table-responsive">
        <table className="table table-striped table-hover order-column table-clickable documents-table">
          <thead>
          <tr className="uppercase bg-dark">
            <th className="font-grey-salt" style={{ width : '20%' }}>Service</th>
            <th className="font-grey-salt" style={{ width : '12%' }}>1 day</th>
            <th className="font-grey-salt" style={{ width : '12%' }}>2 days</th>
            <th className="font-grey-salt" style={{ width : '12%' }}>3 days</th>
            <th className="font-grey-salt" style={{ width : '12%' }}>4 days</th>
            <th className="font-grey-salt" style={{ width : '12%' }}>5 days</th>
            <th className="font-grey-salt" style={{ width : '20%' }}>6 or more days</th>
          </tr>
          </thead>
          <tbody>
              {
                results.map( (result,index) => {
                  let {
                    days,
                    maxdays,
                    air,
                    service,
                    price
                  } = result

                  let entry = (
                    <span>
                      <span className="sh-cost-carrier">
                        <i className={
                          air ? 'fa fa-plane font-blue-soft' : 'fa fa-truck freight-ground-color'
                        }></i>
                      </span>
                      <span className="sh-cost-price">${formatNumber( price, 2 )  }</span>
                    </span>
                  )
                  maxdays = +maxdays > 6 ? 6 : +maxdays
                  let colSpan = maxdays - +days + 1
                  return (
                    <tr className="odd gradeX clickable-row" key={`days-freight-${index}`}>
                      { createTableData({ days, service, air, colSpan, entry }) }
                    </tr>
                  )
                })
              }
              {
                results.length === 0 &&
                ['','','',''].map( (x,index) => {
                  return (
                    <tr
                      className="odd gradeX clickable-row"
                      key={`days-freight-empty-${index}`}
                      style={{ height : '60px' }}
                    >
                      <td style={{width:"20%"}}>
                        &nbsp;
                      </td>
                      <td style={{width:"12%"}}>
                        &nbsp;
                      </td>
                      <td style={{width:"12%"}} className="freight-col-even">
                        &nbsp;
                      </td>
                      <td style={{width:"12%"}}>
                        &nbsp;
                      </td>
                      <td style={{width:"12%"}} className="freight-col-even">
                        &nbsp;
                      </td>
                      <td style={{width:"12%"}}>
                        &nbsp;
                      </td>
                      <td style={{width:"20%"}} className="freight-col-even">
                        &nbsp;
                      </td>
                     </tr>
                  )
                })
              }
          </tbody>
        </table>
      </div>
      {
        calculatedTabs[activeTab] &&
        <p className="freight-address">
          <span className="fr-title"> Cost estimate for:</span><br/>
          { warehouse ? warehouses[warehouse].replace(/ - .*/,'') : '' } <i className="fa fa-arrow-circle-right font-green-seagreen"></i> { zip_code }
          <br/>
          { activeTab === 'freight'? <span>Pallet</span>: <span>Package</span>} Weight: { weight ? weight : 0 } lb<br/>
          No of { activeTab === 'freight'? <span>Pallets</span>: <span>Packages</span>}: { pieces ? pieces : 0 }
        </p>
      }
      {
        calculatedTabs[activeTab] && activeTab === 'freight' &&
        <div style={{fontSize: "12px", fontFamily: "monospace"}}>
        Note: The rates are:
          <ul>
            <li>
              Based on CZAR light rates September 2015 FAK rate 92.5
            </li>
            <li>
              Based on LTL carrier CH Robinson, UPS Freight, Federal Express Freight
            </li>
            <li>
              If your freight class is greater than class 150 call DCL to get a quote
            </li>
            <li>
              Actual cost may vary slightly at the time of shipment
            </li>
          </ul>
          <p>
            <span style={{textDecoration: "underline"}}>Disclaimer</span>:
            Although the shipping cost data presented has been produced and processed from sources believed to be reliable,
            no warranty expressed or implied is made regarding accuracy, adequacy, completeness, legality, reliability or usefulness
            of any information. DCL is providing this information “as is” and disclaims all warranties of any kind.
            In no event will DCL be liable to you or any third party for any direct, indirect or consequential damages resulting
            from the use or misuse of this data.
          </p>
        </div>
      }
      {
        calculatedTabs[activeTab] && activeTab === 'package' &&
        <div style={{fontSize: "12px", fontFamily: "monospace"}}>
          <p>
            <span style={{textDecoration: "underline"}}>Excluded Charges</span>:
              Shipping cost estimates provided include the current fuel surcharge and any customer specific discounts.
              Special surcharges for Delivery Area, Confirmation, Large Package, Address correction, Saturday delivery and others
              are excluded.
          </p>
          <p>
            <span style={{textDecoration: "underline"}}>Disclaimer</span>:
            Although the shipping cost data presented has been produced and processed from sources believed to be reliable,
            no warranty expressed or implied is made regarding accuracy, adequacy, completeness, legality, reliability or usefulness
            of any information. DCL is providing this information “as is” and disclaims all warranties of any kind.
            In no event will DCL be liable to you or any third party for any direct, indirect or consequential damages resulting
            from the use or misuse of this data.
          </p>
        </div>
      }
    </td>
  )
}

Results.propTypes = {
  freightEstimatorActions: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired
}

export default connect(
  state => ({
    activeTab: state.services.utilities.freightEstimator.activeTab,
    calculatedTabs: state.services.utilities.freightEstimator.calculatedTabs,
    calculatedValues: state.services.utilities.freightEstimator.calculatedValues,
    formData: state.services.utilities.freightEstimator.formData,
    results: state.services.utilities.freightEstimator.results
  })
)(Results)