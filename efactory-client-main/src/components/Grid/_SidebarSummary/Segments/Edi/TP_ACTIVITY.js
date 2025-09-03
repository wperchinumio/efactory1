import React from 'react'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const TpActivity = ({
  detail
}) => {
  let {
    partner,
    connectivity,
    edi_ver,
    edi_810_counter,
    edi_812_counter,
    edi_816_counter,
    edi_820_counter,
    edi_824_counter,
    edi_846_counter,
    edi_850_counter,
    edi_852_counter,
    edi_855_counter,
    edi_856_counter,
    edi_856L_counter,
    edi_860_counter,
    edi_864_counter,
    edi_865_counter,
    edi_940_counter,
    edi_945_counter,
    edi_215_counter,
    edi_753_counter,
    edi_754_counter,
    comments,
  } = detail

  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Product Activity </div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Connectivity:</div>
          <div className="col-md-7">{ connectivity }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI_Ver:</div>
          <div className="col-md-7">{ edi_ver }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 810 Invoice:</div>
          <div className="col-md-7">{ formatNumber( edi_810_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 812 Cr/Dbt Adj:</div>
          <div className="col-md-7">{ formatNumber( edi_812_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 816 Org Rel:</div>
          <div className="col-md-7">{ formatNumber( edi_816_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 820 Remit:</div>
          <div className="col-md-7">{ formatNumber( edi_820_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 824 Application Advice:</div>
          <div className="col-md-7">{ formatNumber( edi_824_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 846 Inventory:</div>
          <div className="col-md-7">{ formatNumber( edi_846_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 850 Purchase Order:</div>
          <div className="col-md-7">{ formatNumber( edi_850_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 852 Product Activity:</div>
          <div className="col-md-7">{ formatNumber( edi_852_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 855 PO Ack:</div>
          <div className="col-md-7">{ formatNumber( edi_855_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 856 ASN:</div>
          <div className="col-md-7">{ formatNumber( edi_856_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 856 ASN Label:</div>
          <div className="col-md-7">{ formatNumber( edi_856L_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 860 PO Change:</div>
          <div className="col-md-7">{ formatNumber( edi_860_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 864 Text Message:</div>
          <div className="col-md-7">{ formatNumber( edi_864_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 865 PO Change Ack:</div>
          <div className="col-md-7">{ formatNumber( edi_865_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 940 WHS 850:</div>
          <div className="col-md-7">{ formatNumber( edi_940_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 945 WHS 856:</div>
          <div className="col-md-7">{ formatNumber( edi_945_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 215 Carrier 856:</div>
          <div className="col-md-7">{ formatNumber( edi_215_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 753 Request for routing:</div>
          <div className="col-md-7">{ formatNumber( edi_753_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 754 Routing instructions:</div>
          <div className="col-md-7">{ formatNumber( edi_754_counter, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Comments:</div>
          <div className="col-md-7">{ comments }</div>
        </div>
      </div>
    </div>
  )
}

export default TpActivity