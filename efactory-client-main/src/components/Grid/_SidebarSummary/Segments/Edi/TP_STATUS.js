import React from 'react'

const TpStatus = ({
  detail: {
    partner,
    partner_name,
    connectivity,
    edi_ver,
    edi_810_flag,
    edi_812_flag,
    edi_816_flag,
    edi_820_flag,
    edi_824_flag,
    edi_830_flag,
    edi_832_flag,
    edi_846_flag,
    edi_850_flag,
    edi_852_flag,
    edi_855_flag,
    edi_856_flag,
    edi_856l_flag,
    edi_860_flag,
    edi_861_flag,
    edi_864_flag,
    edi_865_flag,
    edi_869_flag,
    edi_870_flag,
    edi_940_flag,
    edi_945_flag,
    edi_215_flag,
    edi_753_flag,
    edi_754_flag,
    comments,
    start_at,
    csr_email,
    acctmgr_email,
  }
}) => {
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
          <div className="col-md-5 seg-label">Partner Name:</div>
          <div className="col-md-7">{ partner_name }</div>
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
          <div className="col-md-7">{ edi_810_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 812 Cr/Dbt Adj:</div>
          <div className="col-md-7">{ edi_812_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 816 Org Rel:</div>
          <div className="col-md-7">{ edi_816_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 820 Remit:</div>
          <div className="col-md-7">{ edi_820_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 824 Application Advice:</div>
          <div className="col-md-7">{ edi_824_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 830 Planning:</div>
          <div className="col-md-7">{ edi_830_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 832 Product/Price Catalog:</div>
          <div className="col-md-7">{ edi_832_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 846 Inventory:</div>
          <div className="col-md-7">{ edi_846_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 850 Purchase Order:</div>
          <div className="col-md-7">{ edi_850_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 852 Product Activity:</div>
          <div className="col-md-7">{ edi_852_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 855 PO Ack:</div>
          <div className="col-md-7">{ edi_855_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 856 ASN:</div>
          <div className="col-md-7">{ edi_856_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 856 ASN Label:</div>
          <div className="col-md-7">{ edi_856l_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 860 PO Change:</div>
          <div className="col-md-7">{ edi_860_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 861 Receiving Advice:</div>
          <div className="col-md-7">{ edi_861_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 864 Text Message:</div>
          <div className="col-md-7">{ edi_864_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 865 PO Change Ack:</div>
          <div className="col-md-7">{ edi_865_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 869 Order Status Inq.:</div>
          <div className="col-md-7">{ edi_869_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 870 Order Status Resp.:</div>
          <div className="col-md-7">{ edi_870_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 940 WHS 850:</div>
          <div className="col-md-7">{ edi_940_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 945 WHS 856:</div>
          <div className="col-md-7">{ edi_945_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 215 Carrier 856:</div>
          <div className="col-md-7">{ edi_215_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 753 Request for routing:</div>
          <div className="col-md-7">{ edi_753_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">EDI 754 Routing instruction:</div>
          <div className="col-md-7">{ edi_754_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Comments:</div>
          <div className="col-md-7">{ comments }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Start At:</div>
          <div className="col-md-7">{ start_at }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">CSR Email:</div>
          <div className="col-md-7">{ csr_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">AcctMgr Email:</div>
          <div className="col-md-7">{ acctmgr_email }</div>
        </div>
      </div>
    </div>
  )
}

export default TpStatus