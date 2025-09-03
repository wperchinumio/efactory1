import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tabs from '../../../_Shared/Components/Tabs'
import BlockUi from 'react-block-ui'

const EdiOverviewModal = (props) => {
  const [activeTab, setActiveTab] = useState('') // one of 'ENV' 'EDI' 'XML'
  const [activeTabData, setActiveTabData] = useState({})
  const [ediDocumentsActiveTab, setEdiDocumentsActiveTab] = useState('')

  useEffect(
    () => {
      let { rowData, gridActions } = props
      gridActions.getEdiDocuments( rowData.order_number, rowData.po_number ).then(
        ({ edi_documents }) => {
          let activeTab = ''
          let activeTabData = ''
          let ediDocumentsActiveTab = ''
          if ( edi_documents[ 'po' ] ) {
            activeTab = 'EDI'
            activeTabData = { ...edi_documents[ 'po' ] }
            ediDocumentsActiveTab = 'po'
          } else if ( edi_documents[ 'asn' ] ) {
            activeTab = 'ENV'
            activeTabData = { ...edi_documents[ 'asn' ][0] }
            ediDocumentsActiveTab = 'asn'
          } else if ( edi_documents[ 'invoice' ] ) {
            activeTab = 'ENV'
            activeTabData = { ...edi_documents[ 'invoice' ][0] }
            ediDocumentsActiveTab = 'invoice'
          } else {
            console.error('Error with edi documents api missing values.')
          }

          setActiveTab(activeTab)
          setActiveTabData(activeTabData)
          setEdiDocumentsActiveTab(ediDocumentsActiveTab)
          let format_type = activeTab
          let { document_type, reference_id, document_id } = activeTabData
          props.gridActions.readEdiDocument({
            document_type,
            reference_id,
            format_type,
            document_id
          })
        }
      ).catch( () => {} )

      return () => {
        props.gridActions.setRootReduxStateProp_multiple({
          edi_documents: {},
        })
      }
    },
    []
  )

  function onTabClicked (activeTab) {
    setActiveTab(activeTab)
    let {
      document_type,
      reference_id,
      document_id
    } = activeTabData || {}
    props.gridActions.readEdiDocument({
      document_type,
      reference_id,
      format_type: activeTab,
      document_id
    })
  }

  function onLeftTabClicked (event) {
    let name = event.currentTarget.getAttribute('data-tab-name')
    if ( ediDocumentsActiveTab === name ) {
      return
    }
    let { edi_documents = {} } = props.gridState
    let activeTabNext = ''
    let activeTabDataNext = ''
    let ediDocumentsActiveTabNext = ''

    if ( name === 'po' && edi_documents[ 'po' ] ) {
      activeTabNext = 'EDI'
      activeTabDataNext = { ...edi_documents[ 'po' ] }
      ediDocumentsActiveTabNext = 'po'
    } else if ( name === 'asn' && edi_documents[ 'asn' ] ) {
      activeTabNext = 'ENV'
      activeTabDataNext = { ...edi_documents[ 'asn' ][0] }
      ediDocumentsActiveTabNext = 'asn'
    } else if ( name === 'invoice' && edi_documents[ 'invoice' ] ) {
      activeTabNext = 'ENV'
      activeTabDataNext = { ...edi_documents[ 'invoice' ][0] }
      ediDocumentsActiveTabNext = 'invoice'
    } else {
      console.error('Error with edi documents api missing values.')
    }

    setActiveTab(activeTabNext)
    setActiveTabData(activeTabDataNext)
    setEdiDocumentsActiveTab(ediDocumentsActiveTabNext)

    let {
      document_type,
      reference_id,
      document_id
    } = activeTabDataNext

    props.gridActions.readEdiDocument({
      document_type,
      reference_id,
      format_type: activeTabNext,
      document_id
    })
  }

  function onLeftTabOptionChanged (event) {
    let { edi_documents } = props.gridState
    let document_id = event.currentTarget.getAttribute('data-document-id')
    let ediDocumentsActiveTab_ = event.currentTarget.getAttribute('data-tab-name')
    let isActiveTabChanged = ediDocumentsActiveTab !== ediDocumentsActiveTab_

    let format_type = isActiveTabChanged ? 'ENV' : activeTab

    let activeTabDataNext = edi_documents[ ediDocumentsActiveTab_ ] && 
                            edi_documents[ ediDocumentsActiveTab_ ].filter( 
                              ({ document_id : document_id_ } = {}) => document_id === document_id_ 
                            )[0]

    activeTabDataNext = activeTabDataNext || {}

    let { reference_id, document_type } = activeTabDataNext

    setActiveTab(format_type)
    setActiveTabData(activeTabDataNext)
    setEdiDocumentsActiveTab(ediDocumentsActiveTab_)
    
    props.gridActions.readEdiDocument({
      document_type,
      reference_id,
      format_type,
      document_id
    })
  }

  function downloadDocument (event) {
    let {
      document_type,
      reference_id,
      document_id,
    } = activeTabData
    props.gridActions.downloadDocument({
      document_type,
      reference_id,
      format_type: activeTab,
      document_id
    })
  }

  function getTabs () {
    if (ediDocumentsActiveTab === 'po') {
      return [
        {
          type : 'EDI',
          name : 'Original EDI Document'
        },
        {
          type : 'XML',
          name : 'DCL XML Document'
        }                      
      ]
    } else {
      return [
        {
          type : 'ENV',
          name : 'Envelope'
        },
        {
          type : 'EDI',
          name : 'Original EDI Document'
        },
        {
          type : 'XML',
          name : 'DCL XML Document'
        }                      
      ]
    }
  }

  let {
    edi_documents,
    loadingEdiDocument,
    loadingGetEdiDocument
  } = props.gridState

  let {
    po = {},
    asn = [],
    invoice = []
  } = edi_documents

  po = po ? po : {}
  asn = asn ? asn : []
  invoice = invoice ? invoice : []

  let { order_number = '' } = props.rowData

  let tabs_array = getTabs()
  
  let poDisabled = !( po && po.display_text )
  let asnDisabled = !( asn && asn.length > 0 )
  let invoiceDisabled = !( invoice && invoice.length > 0 )

  return (
    <div>
      <div>
        <div id="overlay-content" className="fade-in-up xml-modal">
          <div className="order-body" style={{marginBottom: 20}}>
            <div 
              className="portlet light" 
              style={{ backgroundColor: 'transparent', borderBottom: 'none', marginBottom: '20px', paddingBottom: '0' }}
            >
              <div 
                className="portlet-title" 
                data-refresh-on="refresh-ui"
                style={{
                  margin: '-12px -20px',
                  padding: '3px 21px',
                  background: 'white',
                  marginBottom: '12px'
                }}
              >
                <div className="pull-left actions hidden-print" style={{marginRight: 20}}>
                  <a style={{textDecoration: 'none', color: 'white', display: 'block'}}>
                    <button 
                      className="btn btn-transparent red btn-circle btn-sm"
                      onClick={ props.onCloseClicked }
                    >
                      Close
                    </button>
                  </a>
                </div>
                <div className="caption">
                  <span className="caption-subject font-green-seagreen sbold" style={{paddingRight: 10}}>
                    ORDER #:
                  </span>
                  <span className="caption-subject font-gray sbold" style={{paddingRight: 30}}>
                    { order_number }
                  </span>
                </div>
              </div>
              <div className="portlet-body" style={{height: 'auto'}} >
                <div className="inbox edi-document__inbox">
                  <div className="row">
                    <div className="col-md-3">
                    <BlockUi tag="div" blocking={ loadingGetEdiDocument }>
                      <div className="inbox-sidebar">
                        <h3 style={{ fontWeight : '400' }} className="font-green-soft" >EDI Documents</h3>
                        <ul className="inbox-nav">
                          <li 
                            className={ classNames({
                              'active' : ediDocumentsActiveTab === 'po',
                              'disabled' : poDisabled
                            }) }
                          >
                            <div className="form-group">
                              <label className="col-md-4 control-label">
                                PO #:
                              </label>
                              <div className="col-md-8">
                                <div className="btn-group" style={{ width : '100%' }}>
                                  <button 
                                    disabled={ poDisabled } 
                                    type="button" 
                                    className={ classNames({
                                      'btn btn-topbar no-animation' : true,
                                      'btn-outline' : ediDocumentsActiveTab !== 'po'
                                    }) } 
                                    style={{ textAlign : 'left', width : '100%' }}
                                    data-tab-name={ 'po' }
                                    onClick={ poDisabled ? () => {} : onLeftTabClicked }
                                  >
                                    {
                                      !poDisabled 
                                      ? ( po.display_text || '' )
                                      : 'No PO'
                                    }
                                  </button>
                                </div>
                              </div>
                            </div> 
                          </li>
                          <li 
                            className={ classNames({
                              'active' : ediDocumentsActiveTab === 'asn',
                              'disabled' : asnDisabled
                            }) }
                          >
                            <div className="form-group">
                                <label className="col-md-4 control-label">
                                  ASN #:
                                </label>
                                <div className="col-md-8">
                                  {
                                    asnDisabled 
                                    ? <div className="btn-group" style={{ width : '100%' }}>
                                        <button disabled={ true } type="button" className={ classNames({
                                          'btn btn-topbar no-animation' : true,
                                          'btn-outline' : ediDocumentsActiveTab !== 'asn'
                                        }) } style={{ textAlign : 'left', width : 'calc( 100% - 38px )' }}>
                                          No ASNs
                                        </button>
                                        <button type="button" disabled={ true } className="btn btn-topbar no-animation dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay={1000} data-close-others="true" aria-expanded="false">
                                          <i className="fa fa-angle-down" />
                                        </button>
                                      </div>
                                    : <div className="btn-group" style={{ width : '100%' }}>
                                        <button 
                                          type="button" 
                                          className={ classNames({
                                            'btn btn-topbar no-animation' : true,
                                            'btn-outline' : ediDocumentsActiveTab !== 'asn'
                                          }) } 
                                          style={{ textAlign : 'left', width : 'calc( 100% - 38px )' }}
                                          data-tab-name={ 'asn' }
                                          onClick={ asnDisabled ? () => {} : onLeftTabClicked }
                                        >
                                          {
                                            ediDocumentsActiveTab === 'asn' 
                                            ? activeTabData[ 'display_text' ]
                                            : asn[ 0 ][ 'display_text' ]
                                          }
                                        </button>
                                        <button type="button" className="btn btn-topbar no-animation dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay={1000} data-close-others="true" aria-expanded="false">
                                          <i className="fa fa-angle-down" />
                                        </button>
                                        <ul className="dropdown-menu" role="menu">
                                          {
                                            asn.map( 
                                              ({
                                                reference_id,
                                                document_type,
                                                document_id,
                                                display_text
                                              }) => {
                                                return (
                                                  <li 
                                                    key={ document_id }
                                                    data-document-id={ document_id }
                                                    onClick={ onLeftTabOptionChanged }
                                                    data-tab-name={ 'asn' }
                                                  >
                                                    <a> { display_text } </a>
                                                  </li>
                                                )      
                                              }
                                            )
                                          }
                                        </ul>
                                      </div>
                                  }
                                </div>
                              </div>
                          </li>
                          <li 
                            className={ classNames({
                              'active' : ediDocumentsActiveTab === 'invoice',
                              'disabled' : invoiceDisabled
                            }) }
                          >
                            <div className="form-group">
                                <label className="col-md-4 control-label">
                                  Invoice #:
                                </label>
                                <div className="col-md-8">
                                  {
                                    invoiceDisabled 
                                    ? <div className="btn-group" style={{ width : '100%' }}>
                                        <button disabled={ true } type="button" className={ classNames({
                                          'btn btn-topbar no-animation' : true,
                                          'btn-outline' : ediDocumentsActiveTab !== 'invoice'
                                        }) } style={{ textAlign : 'left', width : 'calc( 100% - 38px )' }}>
                                          No Invoices
                                        </button>
                                        <button type="button" disabled={ true } className="btn btn-topbar no-animation dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay={1000} data-close-others="true" aria-expanded="false">
                                          <i className="fa fa-angle-down" />
                                        </button>
                                      </div>
                                    : <div className="btn-group" style={{ width : '100%' }}>
                                        <button 
                                          type="button" 
                                          className={ classNames({
                                            'btn btn-topbar no-animation' : true,
                                            'btn-outline' : ediDocumentsActiveTab !== 'invoice'
                                          }) } 
                                          style={{ textAlign : 'left', width : 'calc( 100% - 38px )' }}
                                          data-tab-name={ 'invoice' }
                                          onClick={ invoiceDisabled ? () => {} : onLeftTabClicked }
                                        >
                                          {
                                            ediDocumentsActiveTab === 'invoice' 
                                            ? activeTabData[ 'display_text' ]
                                            : invoice[ 0 ][ 'display_text' ]
                                          }
                                        </button>
                                        <button type="button" className="btn btn-topbar no-animation dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay={1000} data-close-others="true" aria-expanded="false">
                                          <i className="fa fa-angle-down" />
                                        </button>
                                        <ul className="dropdown-menu" role="menu">
                                          {
                                            invoice.map( 
                                              ({
                                                reference_id,
                                                document_type,
                                                document_id,
                                                display_text
                                              }) => {
                                                return (
                                                  <li 
                                                    key={ document_id }
                                                    data-document-id={ document_id }
                                                    onClick={ onLeftTabOptionChanged }
                                                    data-tab-name={ 'invoice' }
                                                  >
                                                    <a> { display_text } </a>
                                                  </li>
                                                )      
                                              }
                                            )
                                          }
                                        </ul>
                                      </div>
                                  }
                                </div>
                              </div>
                          </li>
                        </ul>
                      </div>
                      </BlockUi>
                    </div>
                    <div 
                      className="col-md-9" 
                      style={{ backgroundColor: 'white', border: '1px solid #dddddd', paddingTop: '5px' }}
                    >
                    <Tabs 
                      tabs={ tabs_array }
                      activeTab={ activeTab }
                      onTabClicked={ onTabClicked }
                    >
                      {
                        <div 
                            style={{
                              position: 'relative',
                              top: '-40px'
                            }}
                          > 
                
                        <div className="page-toolbar pull-right">
                          <button
                            className="btn green-soft btn-sm"
                            type="button"
                            onClick={ downloadDocument }
                          >
                            <i className="fa fa-file-o"></i>
                            Export
                          </button>
                        </div>
                      </div>
                      }
                    </Tabs>
                    <div style={{padding: "20px"}}>
                      <BlockUi tag="div" blocking={ loadingEdiDocument }>
                        <div 
                          style={{
                            backgroundColor: "rgb(247, 247, 247)", 
                            border: "1px solid #ccc",
                            overflowY: "auto", 
                            color: "#ddd", 
                            padding: "15px", 
                            width : '100%',
                            height: 'calc(100vh - 270px)',
                            marginBottom: '15px'
                          }}>
                            <div id="document-content-display">
                              
                            </div>
                        </div>
                      </BlockUi>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

EdiOverviewModal.propTypes = {
  onCloseClicked: PropTypes.func.isRequired,
  gridState: PropTypes.object.isRequired,
  gridActions: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
}

export default EdiOverviewModal