import React from 'react'
import PropTypes from 'prop-types'
import AmCharts from '../../../lib/amcharts3-react'
import FormatNumber from '../../_Helpers/FormatNumber'
import { getUserData } from '../../../util/storageHelperFuncs'
import { fmtdemandqty2 } from '../../_Helpers/_Renderers'

const ItemDetailBody = ({
  fetchItemDetailData,
  fetchItems,
  itemDetail,
}) => {
  const warehouses = getUserData("warehouses") || {}

  function onWarehouseChange ( event ) {
    fetchItems({ warehouse : event.target.value })
  }

  function onIntervalTypeChange ( event ) {
    fetchItems({ weeks : event.target.value === 'weeks' })
  }

  function onAccountWarehouseChange (event) {
    fetchItems({ account_wh : event.target.value })
  }

  function getWarehouseOptions () {
    let options = []
    Object.keys(warehouses).forEach( ( aWarehouse, i1 ) => {
      warehouses[aWarehouse].forEach( ( invType, i2 ) => {
        Object.keys( invType ).forEach( ( anInvType, i3) => {
          let optionValue = `${aWarehouse}.${anInvType}`
          options.push( (
            <option
              key={`${i1}${i2}${i3}-pair`}
              value={ optionValue } >
              { `${aWarehouse} - ${anInvType}` }
            </option>
          ) )

        } )
      } )
    } )
    return options
  }

  function getAccountWarehouseOptions () {
    let accounts = []
    let calc_account_regions = getUserData('calc_account_regions') || {}
    let calc_account_regions_keys = Object.keys( calc_account_regions )
    calc_account_regions_keys.sort( (a, b) => {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    })
    calc_account_regions_keys.forEach( accountObj => {
      accounts.push(
        <option key={accountObj} value={accountObj}>{ calc_account_regions[accountObj] }</option>
      )
    })
    if( accounts.length !== 1 ){
      accounts.unshift( <option value="" key="empty-account-wh"></option> )
    }
    return accounts
  }

  let {
    detail = {},
    shipping = {},
    export : export_,
    dg = {},
    edi = [],
    charts = [],
    stock = []
  } = itemDetail

  detail    = detail ? detail : {}
  shipping  = shipping ? shipping : {}
  export_   = export_ ? export_ : {}
  dg        = dg ? dg : {}
  edi       = edi ? edi : []
  charts    = charts ? charts : []
  stock     = stock ? stock : []

  const intervalValue = fetchItemDetailData.weeks ? 'weeks' : 'days'
  const warehouseValue = fetchItemDetailData.warehouse || ''

  return (
    <div className="portlet-body order-status">
      <div className="row">
        <div className="col-md-9">
          <div className="row ">
            <div className="col-xs-12 ">
              {/*<span className="caption-subject font-red-sunglo bold uppercase">WAREHOUSE DISTRIBUTION</span>*/}
              <div className="table-responsive">
                <table className="table table-hover ">
                  <thead className="table-header-1 bg-print">
                  <tr>
                    <th className="text-center ">WH</th>
                    <th className="text-right ">Q ON HAND</th>
                    <th className="text-right ">Q ON HOLD</th>
                    <th className="text-right ">Q COMMITTED</th>
                    <th className="text-right ">Q IN PROCESS</th>
                    <th className="text-right ">Q ON FF</th>
                    <th className="text-right ">Q NET AVAIL.</th>
                    <th className="text-right ">OPEN WO</th>
                    <th className="text-right ">OPEN PO</th>
                    <th className="text-right ">OPEN RMA</th>
                  </tr>
                  </thead>
                  <tbody>
                  {stock && stock.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center text-primary sbold" style={{borderRight: "3px double #aaa"}}>{item.location} - {item.branch}</td>
                      <td className="text-right "><FormatNumber number={item.qty_onhand} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.qty_onhold} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.qty_comm} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.qty_proc} decimals="0" dimZero="true"/></td>
                      {/*<td className="text-right "><FormatNumber number={item.qty_ff} decimals="0" dimZero="true"/></td>*/}
                      <td className="text-right ">{fmtdemandqty2({item_number: detail.item_number, location: `${item.location} - ${item.branch}`, qty_demand: item.qty_ff}, 'qty_demand')}</td>
                      <td className="text-right bold" style={{borderRight: "1px double #ccc", paddingRight:"10px"}}><FormatNumber number={item.qty_net} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.open_wo} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.open_po} decimals="0" dimZero="true"/></td>
                      <td className="text-right "><FormatNumber number={item.open_rma} decimals="0" dimZero="true"/></td>
                    </tr>
                  ))}
                  </tbody>
                  { stock && stock.length > 1 &&
                    <tfoot className="table-header-1 bg-print" style={{opacity: 0.9}}>
                    <tr>
                      <td>&nbsp;</td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_onhand, 0)} decimals="0" dimZero="true"/>
                      </td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_onhold, 0)} decimals="0" dimZero="true"/>
                      </td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_comm, 0)} decimals="0" dimZero="true"/>
                      </td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_proc, 0)} decimals="0" dimZero="true"/>
                      </td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_ff, 0)} decimals="0" dimZero="true"/></td>
                      <td className="text-right " style={{fontWeight: 500, paddingRight: "10px"}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.qty_net, 0)} decimals="0" dimZero="true"/></td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.open_wo, 0)} decimals="0" dimZero="true"/></td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.open_po, 0)} decimals="0" dimZero="true"/></td>
                      <td className="text-right " style={{fontWeight: 500}}><FormatNumber
                        number={stock.reduce((sum, item) => sum + item.open_rma, 0)} decimals="0" dimZero="true"/>
                      </td>
                    </tr>
                    </tfoot>
                  }
                </table>
              </div>
            </div>
          </div>

          <div style={{padding: "10px", border: "1px solid #ddd", borderRadius: "10px"}} className="chart-background">
            <div className="row">
              <div className="col-md-3">
                <label className="sbold">Warehouse:</label>
                <select
                  name=""
                  value={ warehouseValue}
                  className="form-control input-sm"
                  onChange={ onWarehouseChange }
                >
                  <option value="">Warehouse: All</option>

                    { getWarehouseOptions() }

                </select>
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-3">
                <label className="sbold">Interval:</label>
                <select
                  className="form-control input-sm"
                  value={ intervalValue }
                  onChange={ onIntervalTypeChange }
                >
                  <option value="days">Last 10 days</option>
                  <option value="weeks">Last 10 weeks</option>
                </select>
              </div>
            </div>

            <hr/>

            <div style={{height: "250px"}}>
              <AmCharts.React
                type="serial"
                fontFamily='Open Sans'
                color='#888888'
                legend={{
                  equalWidths :      false,
                  useGraphSettings : true,
                  valueAlign :       "left",
                  valueWidth :       120,
                  position   : 'top'
                }}
                dataProvider={charts}
                valueAxes={[{
                  id :        "orderAxis",
                  axisAlpha : 0,
                  gridAlpha : 0,
                  position :  "left",
                  title :     "Qty Shipped/Returned"
                }]}
                graphs={[
                  {
                    lineColor :       "#249d8e",
                    fillColors :      "#44bdae",
                    fillAlphas :      1,
                    type :            "column",
                    labelText:        "[[value]]",
                    title :           "Qty Shipped",
                    valueField :      "shipped",
                    clustered :       true,
                    columnWidth :     0.75,
                    legendPeriodValueText : "[[value.sum]]",
                    balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                  },
                  {
                    lineColor :       "#c7303a",
                    fillColors :      "#e7505a",
                    fillAlphas :      1,
                    type :            "column",
                    labelText:        "[[value]]",
                    title :           "Qty Returned",
                    valueField :      "returned",
                    clustered :       true,
                    columnWidth :     0.75,
                    legendPeriodValueText : "[[value.sum]]",
                    balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                  }
                ]}
                chartCursor={{
                  cursorAlpha :               0.015,
                  cursorColor :               "#333",
                  fullWidth :                 true,
                  valueBalloonsEnabled :      false,
                  zoomable :                  false
                }}
                categoryField="period"
                categoryAxis={{
                  parseDates :    false,
                  autoGridCount : false,
                  axisColor :     "#555555",
                  gridAlpha :     0.1,
                  gridColor :     "#FFFFFF",
                  gridCount :     50
                }}
              />
            </div>
            <hr/>
            <div style={{height: "250px"}}>
              <AmCharts.React
                type="serial"
                fontFamily='Open Sans'
                color='#888888'
                legend={{
                  equalWidths :      false,
                  useGraphSettings : true,
                  valueAlign :       "left",
                  valueWidth :       120,
                  position   : 'top'
                }}
                dataProvider={charts}
                valueAxes={[{
                  id :        "orderAxis",
                  axisAlpha : 0,
                  gridAlpha : 0,
                  position :  "left",
                  title :     "Qty Received/Adjusted"
                }]}
                graphs={[
                  {
                    lineColor :       "#135a97",
                    fillColors :      "#337ab7",
                    fillAlphas :      1,
                    type :            "column",
                    labelText:        "[[value]]",
                    title :           "Qty Received",
                    valueField :      "received",
                    clustered :       true,
                    columnWidth :     0.75,
                    legendPeriodValueText : "[[value.sum]]",
                    balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                  },
                  {
                    lineColor :       "#555",
                    fillColors :      "#777",
                    fillAlphas :      1,
                    type :            "column",
                    labelText:        "[[value]]",
                    title :           "Qty Adjusted",
                    valueField :      "adjusted",
                    clustered :       true,
                    columnWidth :     0.75,
                    legendPeriodValueText : "[[value.sum]]",
                    balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                  }

                ]}
                chartCursor={{
                  cursorAlpha :               0.015,
                  cursorColor :               "#333",
                  fullWidth :                 true,
                  valueBalloonsEnabled :      false,
                  zoomable :                  false
                }}
                categoryField="period"
                categoryAxis={{
                  parseDates :    false,
                  autoGridCount : false,
                  axisColor :     "#555555",
                  gridAlpha :     0.1,
                  gridColor :     "#FFFFFF",
                  gridCount :     50
                }}
                /*exportConfig={{
                 menuBottom : "20px",
                 menuRight :  "22px",
                 menuItems :  [{
                 icon :   global.App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
                 format : 'png'
                 }]
                 }}*/
              />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="row" style={{paddingBottom: "5px"}}>
            <div className="col-md-7 ext-title">
              <label className="sbold" style={{paddingTop: "4px"}}>ACCOUNT # - WH:</label>
            </div>
            <div className="col-md-5">
              <select
                className="form-control input-sm"
                value={ fetchItemDetailData.account_wh }
                onChange={ onAccountWarehouseChange }
              >
                { getAccountWarehouseOptions() }

              </select>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">Shipping</span>
              </div>
              <div className="col-md-2 ext-title">
                UPC
              </div>
              <div className="col-md-5">

              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipping.upc }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 ext-title">
                Weight
              </div>
              <div className="col-md-5">

              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipping.weight }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 ext-title">
                Dimension
              </div>
              <div className="col-md-5">
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipping.dimension }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ext-title">
                Serial/Lot No
              </div>
              <div className="col-md-3">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipping.serial_no }
                </span>
                <span className="small text-muted" style={{display:"block", marginTop:"-5px"}}>No</span>
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipping.serial_format }
                </span>
                <span className="small text-muted" style={{display:"block", marginTop:"-5px",marginBottom:"5px"}}>Format</span>
              </div>
            </div>
          </div>

          <div style={{paddingTop:"5px"}}>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">Export</span>
              </div>
              <div className="col-md-7 ext-title">
                ECCN
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.eccn }
                </span>
              </div>
              <div className="col-md-7 ext-title">
                Harmonized Code
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.hcode }
                </span>
              </div>
              <div className="col-md-7 ext-title">
                Harmonized Code (CA)
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.hcode_ca }
                </span>
              </div>
              <div className="col-md-7 ext-title">
                Country Of Origin
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.coo }
                </span>
              </div>
              <div className="col-md-7 ext-title">
                GL Symbol
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.gl }
                </span>
              </div>
              <div className="col-md-7 ext-title">
                Category
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { export_.cat }
                </span>
              </div>
            </div>
          </div>

          <div style={{paddingTop:"5px"}}>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">DG Data</span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Li Battery Category
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.li_b_cat }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Li Battery Config.
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.li_b_conf }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Li Battery Type
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.li_t_type }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Cell/Batt. Per Retail Pack.
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.cell_rp }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Retail Units Per Inner Carton
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.unit_innerc }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Retail Units Per Master Carton
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.unit_masterc }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Watt/Hour Per Cell/Battery (&lt;=)
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.wh_cell }
                </span>
              </div>
              <div className="col-md-7 ef-oh ext-title">
                Net Wgt of Li Battery (g)
              </div>
              <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { dg.net_wh }
                </span>
              </div>
            </div>
          </div>

          <div className="row" style={{paddingTop:"5px"}}>
            <div className="col-md-12">
              <span className="item-section table-header-1">Basic</span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Warehouse
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.warehouse }
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Cat 1.
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.cat1 }
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 ext-title">
              Cat 2.
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.cat2 }
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 ext-title">
              Cat 3.
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.cat3 }
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Lot # Assign.
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.lot_assign }
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Shelf Life Days
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.lot_exp }
                </span>
            </div>
          </div>


          <div className="row">
            <div className="col-md-2 ext-title">
              Re-Order Point
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.reorder }
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Re-Order Quantity
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.reorder_qty }
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 ext-title">
              Pack Multiple
            </div>
            <div className="col-md-5">

            </div>
            <div className="col-md-5">
                <span className="ext-value ext-value-input ext-value-pile">
                  { detail.pack }
                </span>
            </div>
          </div>

          <div style={{paddingTop:"5px"}}>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">EDI</span>
              </div>
              { edi.length !== 0 &&
                <div>
                  <div className="col-md-3">
                    TP
                  </div>
                  <div className="col-md-9">
                    Buyer Item #
                  </div>
                </div>
              }
              { edi.length !== 0 &&
                edi.map((item) => (
                  <div key={item.tp}>
                    <div className="col-md-3">
                      <span className="ext-value ext-value-input ext-value-pile">
                        { item.tp }
                      </span>
                        </div>
                        <div className="col-md-9">
                      <span className="ext-value ext-value-input ext-value-pile">
                        { item.item_number }
                      </span>
                    </div>
                  </div>
                  ))
              }
              { edi.length === 0 &&
                <div className="col-md-12">
                  <div style={{backgroundColor: "#ffffc4", padding: "10px", border: "1px solid #bbb", margin: "10px", color: "#444", textAlign:"center"}}>
                    No TP Item Configured!
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

ItemDetailBody.propTypes = {
  fetchItemDetailData : PropTypes.shape({
    item_number   : PropTypes.string,
    warehouse     : PropTypes.string,
    account_wh    : PropTypes.string,
    weeks         : PropTypes.bool
  }),
  fetchItems : PropTypes.func,
  itemDetail : PropTypes.shape({
    detail : PropTypes.shape({
      item_number : PropTypes.string,
      desc1 : PropTypes.string,
      desc2 : PropTypes.string,
      lot_exp : PropTypes.string,
      reorder : PropTypes.string,
      reorder_qty : PropTypes.any,
      lot_assign : PropTypes.string,
      pack : PropTypes.string,
      cat1 : PropTypes.string,
      cat2 : PropTypes.string,
      cat3 : PropTypes.string,
      cat4 : PropTypes.string,
      warehouse: PropTypes.string
    }),
    shipping : PropTypes.shape({
      upc : PropTypes.string,
      weight : PropTypes.string,
      dimension : PropTypes.string,
      serial_no : PropTypes.string,
      serial_format : PropTypes.string,
      lot_days : PropTypes.string,
      lot_format : PropTypes.string
    }),
    export : PropTypes.shape({
      eccn : PropTypes.string,
      hcode : PropTypes.string,
      hcode_ca : PropTypes.string,
      coo : PropTypes.string,
      gl : PropTypes.string,
      cat : PropTypes.string
    }),
    dg : PropTypes.shape({
      li_b_cat : PropTypes.string,
      li_b_conf : PropTypes.string,
      li_t_type : PropTypes.string,
      cell_rp : PropTypes.string,
      unit_innerc : PropTypes.string,
      unit_masterc : PropTypes.string,
      wh_cell : PropTypes.string,
      net_wh : PropTypes.string
    }),
    edi : PropTypes.arrayOf( PropTypes.shape({
      tp : PropTypes.string,
      item_number : PropTypes.string
    })),
    charts : PropTypes.arrayOf( PropTypes.shape({
      period : PropTypes.any,
      shipped : PropTypes.any,
      returned : PropTypes.any,
      received : PropTypes.any,
      adjusted : PropTypes.any
    })),
    stock : PropTypes.arrayOf( PropTypes.shape({
      location : PropTypes.any,
      branch : PropTypes.any,
      qty_onhand : PropTypes.any,
      qty_onhold : PropTypes.any,
      qty_comm : PropTypes.any,
      qty_proc : PropTypes.any,
      qty_ff : PropTypes.any,
      qty_net : PropTypes.any,
      open_wo : PropTypes.any,
      open_po : PropTypes.any,
      open_rma : PropTypes.any
    }) )
  }),
  warehouses : PropTypes.object
}

export default ItemDetailBody