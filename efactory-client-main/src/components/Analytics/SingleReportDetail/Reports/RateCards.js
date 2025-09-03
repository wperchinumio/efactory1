import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Report17 = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
		},
		[]
	)
    const [serviceIndex, setServiceIndex]  = useState(0)
    const [services]  = useState([...new Set(reportData.rows.map(row => row.service))])
    //const [region]  = useState(analyticsState.filter.region[0].value)
    const [region]  = useState(analyticsState.filter && analyticsState.filter.region && analyticsState.filter.length >0? analyticsState.filter.region[0].value: '')
    //console.log(analyticsState.filter)

    //const services = [...new Set(reportData.rows.map(row => row.service))];
    //console.log(services);
    let select_service = services[serviceIndex];


    reportData.rows = reportData.rows.sort((a,b) => a.weight_limit - b.weight_limit);


    /*reportData.rows.map(row => {
        if (row.service === select_service && row.zone !== undefined)
        console.log(row.zone)
    });*/

    const zones = [...new Set(reportData.rows.map(row => {
        if (row.service === select_service && row.zone !== undefined)
        return row.zone
        else return null;
    }))].filter(z => z !== null);

    if (zones.every((element) => !isNaN(element))) {
        zones.sort((a,b) => Number(a)-Number(b));
    }

    const weights = [...new Set(reportData.rows.map(row => {
        if (row.service === select_service && row.weight_limit !== undefined)
        return row.weight_limit
        else return null;
    }))].filter(z => z !== null).sort((a,b) => a-b);

    //console.log(zones)
    //console.log(weights)

    const sel_rows = reportData.rows.filter(row => row.service === select_service);
    const rate_grid = [];

    weights.forEach(weight => {
        
        var rate_row = { weight: weight, book_rates: []};
        zones.forEach(zone => {
            var cell = sel_rows.filter(f => f.weight_limit === weight && f.zone === zone)[0];
            //console.log(cell);
            if (cell) rate_row.book_rates.push(cell.book_rate);
        });
        rate_grid.push(rate_row);
    });
    //console.log(rate_grid);

    function changeService (service_index) {
        const rows = Array.from(document.querySelectorAll('tbody tr.ratecards_tr_zones'));
        rows.forEach((row) => {
            row.classList.remove('ratecards_tr_selected');
        });
        setServiceIndex(service_index)
    }

    function selectRowClick(index) {
        const rows = Array.from(document.querySelectorAll('tbody tr.ratecards_tr_zones'));
        rows.forEach((row,i) => {
            row.classList.remove('ratecards_tr_selected');
            if (i === index) {
                row.classList.add('ratecards_tr_selected');
            }
        });
    }

      if(!sel_rows || sel_rows.length === 0)
      {
         return (
                    <div>
                        <div>
                            <div className='ratecards_no_rates'>No rates found</div>
                        </div>
                    </div>
                )
      }          
     
    return (
  	<div>
        <div>
            {
                services.map((service, service_index) => {
                    return <span 
                    className={classNames({
                        'ratecards_service': true,
                        'rc_service_apc': sel_rows[0].carrier === 'APC',
                        'rc_service_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                        'rc_service_dhl': sel_rows[0].carrier.startsWith('DHL'),
                        'rc_service_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                        'rc_service_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                        'rc_service_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),

                        'ratecards_service_selected':service_index === serviceIndex,
                        'rc_service_selected_apc':service_index === serviceIndex && sel_rows[0].carrier === 'APC',
                        'rc_service_selected_apc_dcl':service_index === serviceIndex && sel_rows[0].carrier === 'APC_DCL',
                        'rc_service_selected_dhl':service_index === serviceIndex && sel_rows[0].carrier.startsWith('DHL'),
                        'rc_service_selected_fedex':service_index === serviceIndex && sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                        'rc_service_selected_usps':service_index === serviceIndex && sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                        'rc_service_selected_selectship':service_index === serviceIndex && sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                      })}
                    
                   key={service}
                        onClick={() => changeService(service_index)}
                    >{service}</span>
                })
            }
            <div className={classNames({
                        'ratecards_container': true,
                        'rc_container_apc': sel_rows[0].carrier === 'APC',
                        'rc_container_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                        'rc_container_dhl': sel_rows[0].carrier.startsWith('DHL'),
                        'rc_container_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                        'rc_container_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                        'rc_container_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                      })}>
                    <table 
                    className={classNames({
                        'ratecards_table': true,
                        'rc_table_apc': sel_rows[0].carrier === 'APC',
                        'rc_table_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                        'rc_table_dhl': sel_rows[0].carrier.startsWith('DHL'),
                        'rc_table_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                        'rc_table_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                        'rc_table_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                      })}>
                        <thead >
                            <tr className={classNames({
                        'ratecards_tr_title': true,
                        'rc_tr_title_apc': sel_rows[0].carrier === 'APC',
                        'rc_tr_title_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                        'rc_tr_title_dhl': sel_rows[0].carrier.startsWith('DHL'),
                        'rc_tr_title_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                        'rc_tr_title_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                        'rc_tr_title_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                      })}>
                                <td className='ratecards_td_col0'><i>Customer Rate</i></td>
                                {sel_rows.length > 0 &&
                                    <td className='ratecards_td_col_max' colSpan={zones.length}><i>Zones</i> <span style={{marginLeft:'10px'}}> [Carrier: <b>{sel_rows[0].carrier === 'APC'? 'Passport': sel_rows[0].carrier}</b>{sel_rows[0].carrier === 'SELECTSHIP' ? (sel_rows[0].region ? <> - Location Nodes: <b>{sel_rows[0].region}</b></> : '') : (<> - Region: <b>{region}</b></>)} ]</span></td>
                                }
                                {!sel_rows.length > 0 &&
                                    <td className='ratecards_td_col_max' colSpan={zones.length}><i>Zones</i></td>
                                }
                            </tr>
                            {sel_rows.length > 0 &&
                            <tr className='ratecards_tr_zones'>
                                <td 
                                className={classNames({
                                    'ratecards_td_rates_col0': true,
                                    'rc_td_rates_col0_apc': sel_rows[0].carrier === 'APC',
                                    'rc_td_rates_col0_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                                    'rc_td_rates_col0_dhl': sel_rows[0].carrier.startsWith('DHL'),
                                    'rc_td_rates_col0_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                                    'rc_td_rates_col0_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                                    'rc_td_rates_col0_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                                  })} style={{zIndex:1}}>Weight (lbs)</td>
                                {
                                    zones.map((zone) => {
                                        return <td key={zone} 
                                        className={classNames({
                                            'ratecards_td_zone': true,
                                            'rc_td_zone_apc': sel_rows[0].carrier === 'APC',
                                            'rc_td_zone_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                                            'rc_td_zone_dhl': sel_rows[0].carrier.startsWith('DHL'),
                                            'rc_td_zone_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                                            'rc_td_zone_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                                            'rc_td_zone_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),                                            
                                          })}>{zone}</td>
                                    })

                                }
                            </tr>
                            }
                        </thead>
                        {sel_rows.length > 0 &&
                        <tbody >
                        {
                                rate_grid.map((row, idx) => {
                                    return (
                                        <tr className='ratecards_tr_zones' key={row.weight} onClick={() => selectRowClick(idx)}>
                                            <td className={classNames({
                                    'ratecards_td_rates_col0': true,
                                    'rc_td_rates_col0_apc': sel_rows[0].carrier === 'APC',
                                    'rc_td_rates_col0_apc_dcl': sel_rows[0].carrier === 'APC_DCL',
                                    'rc_td_rates_col0_dhl': sel_rows[0].carrier.startsWith('DHL'),
                                    'rc_td_rates_col0_fedex': sel_rows[0].carrier.toUpperCase().startsWith('FEDEX'),
                                    'rc_td_rates_col0_usps': sel_rows[0].carrier.toUpperCase().startsWith('USPS'),
                                    'rc_td_rates_col0_selectship': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                                  })}>{row.weight}</td>
                                            {
                                                row.book_rates.map((book_rate, index) => {
                                                    return <td 
                                                    className={classNames({
                                                        'ratecards_td_rates': true,
                                                        'ratecards_td_rates_odd':idx % 2 === 1,
                                                        'rc_td_zone_align': sel_rows[0].carrier.toUpperCase().startsWith('SELECTSHIP'),
                                                    })}
                                                    
                                                    key={index}>${book_rate.toFixed(2)}</td>
                                                })
                                            }
                                        </tr>
                                    )
                                })
                        }
                        </tbody>
                        }
                </table>             
            </div>
            <div style={{display: 'flex', height: '120px'}}>
                <div style={{minWidth: '300px'}}>
                    <div style={{marginTop: '5px'}}>
                       {sel_rows && sel_rows.length > 0 &&
                        <table style={{fontSize: '12px', marginBottom: '2px'}}>
                            <tbody>
                                <tr>
                                    <td style={{width:'180px'}}><b>Effective Date:</b></td>
                                    <td style={{align:'right'}}>{sel_rows[0].carrier.toUpperCase() === 'USPS'? '1/19/2025':
                                                                 sel_rows[0].carrier.toUpperCase() === 'DHL GLOBAL MAIL'? '1/19/2025':
                                                                 sel_rows[0].carrier.toUpperCase() === 'APC'? '1/5/2025':
                                                                 sel_rows[0].carrier.toUpperCase() === 'SELECTSHIP'? '07/01/2025':
                                                                 sel_rows[0].carrier.toUpperCase() === 'FEDEX'? '1/6/2025':
                                                                 '12/23/2024'}
                                                                 {sel_rows[0].carrier.toUpperCase() !== 'USPS' && <sup> *</sup>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                       }
                       <div style={{fontSize: '12px', paddingBottom: '0px'}}><b>Delivery Surcharges:</b></div>
                       {sel_rows && sel_rows.length > 0 &&
                        <table style={{fontSize: '12px', marginLeft: '7px'}}>
                            <tbody>
                                <tr>
                                    <td style={{width:'180px'}}>Ground Residential:</td>
                                    <td style={{align:'right'}}>${sel_rows[0].sc_g.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Air Residential:</td>
                                    <td style={{align:'right'}}>${sel_rows[0].sc_a.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Signature Required:</td>
                                    <td style={{align:'right'}}>${sel_rows[0].sc_sr.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Adult Signature Required:</td>
                                    <td style={{align:'right'}}>${sel_rows[0].sc_asr.toFixed(2)}</td>
                                </tr>
                        </tbody>
                        </table>
                       }
                       {sel_rows[0].carrier.toUpperCase() !== 'USPS' &&
                            <span>
                                <i><span style={{fontSize: "10px"}}>(*) transportation rates include fuel surcharges</span></i>
                            </span>
                       }
                    </div>
                </div>
                <div style={{fontSize: '11px', marginTop: '5px'}}>
                    <b>Note</b>: Net rate tables are estimates only.  Net rate tables exclude all potential 
                    surcharges except for fuel where applicable (these surcharges include signature 
                    required, residential, delivery area surcharge, and more).  Surcharges may change 
                    based on the carrier’s discretion.  Fuel changes on a weekly basis.    
                    <span style={{display: 'block', height: '5px'}}/>
                    <b>Disclaimer</b>:  Although the shipping cost data presented has been produced and 
                    processed from sources believed to be reliable, no warranty expressed or implied is 
                    made regarding accuracy, adequacy, completeness, legality, reliability, or 
                    usefulness of any information.  DCL is providing this information “as is” and 
                    disclaims all warranties of any kind.  In no event will DCL be liable to you or any 
                    third party for any direct, indirect, or consequential damages resulting from the use 
                    or misuse of this data.                        
                </div>
            </div>
		</div>
    </div>
	)
}

Report17.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default Report17