import React from 'react'

const DclPartners = ({
  detail: {
    partner_code,
    partner_group,
    partner_name,
    partner_flag,
    inactive,
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
    prod_identifier,
    prod_qualifier,
    prod_routing,
    test_identifier,
    test_qualifier,
    test_routing,
    protocol,
    control_version,
    group_version,
    standards_id,
    segment_terminator,
    element_seperator,
    component_seperator,
    releasereplace_seperator,
    app_namespace,
    customer_routing,
    registered,
    register_now,
  }
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse"/>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Invoice</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner Code:</div>
          <div className="col-md-7">{ partner_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Partner Group:</div>
          <div className="col-md-7">{ partner_group }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Partner Name:</div>
          <div className="col-md-7">{ partner_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">partner_flag</div>
          <div className="col-md-7">{ partner_flag }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">inactive</div>
          <div className="col-md-7">{ inactive }</div>
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
          <div className="col-md-5 seg-label">Identifier:</div>
          <div className="col-md-7">{ prod_identifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qualifier:</div>
          <div className="col-md-7">{ prod_qualifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Routing:</div>
          <div className="col-md-7">{ prod_routing }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Test Identifier:</div>
          <div className="col-md-7">{ test_identifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Test Qualifier:</div>
          <div className="col-md-7">{ test_qualifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Test Routing:</div>
          <div className="col-md-7">{ test_routing }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Protocol:</div>
          <div className="col-md-7">{ protocol }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Control Version:</div>
          <div className="col-md-7">{ control_version }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Group Version:</div>
          <div className="col-md-7">{ group_version }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Standards ID:</div>
          <div className="col-md-7">{ standards_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Segment Terminator:</div>
          <div className="col-md-7">{ segment_terminator }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Element Separator:</div>
          <div className="col-md-7">{ element_seperator }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Component Separator:</div>
          <div className="col-md-7">{ component_seperator }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Release/Replace Separator:</div>
          <div className="col-md-7">{ releasereplace_seperator }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">App Namespace:</div>
          <div className="col-md-7">{ app_namespace }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Customer Routing:</div>
          <div className="col-md-7">{ customer_routing }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Registered:</div>
          <div className="col-md-7">{ registered ? '1' : '0' }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Register Now:</div>
          <div className="col-md-7">{ register_now }</div>
        </div>
      </div>
    </div>
  )
}

export default DclPartners