import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as detailActions from '../../../Invoices/Open/redux'
import ShippingTab from './ShippingTab'
import ExportTab from './ExportTab'
import DgTab from './DgTab'
import EdiTab from './EdiTab'
import Tabs from '../../../_Shared/Components/Tabs'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const OthersMain = ({
  activeTab,
  editItemData = {},
  detailActions,
}) => {
  const [ loading1, setLoading1 ] = useState(false)
  const [ loading2, setLoading2 ] = useState(false)

  function onTabClicked (tab) {
    detailActions.setRootReduxStateProp({
      field : 'activeEditItemTab',
      value : tab
    })
  }

  function onKeyItemValueChanged (event) {
    detailActions.setRootReduxStateProp({
      field : 'editItemData',
      value : {
        ...editItemData,
        updateParams : {
          ...editItemData.updateParams,
          key_item : event.target.checked
        }
      }
    })
  }

  function saveChangesThisWh () {
    setLoading2(true)
    detailActions.saveEditItemChanges( false ).then(
      ({ success }) => {
        setLoading2(false)
        if( success ){
          global.$('#edit-item').modal('hide')
        }
    } )
    .catch(()=> {
      setLoading2(false)
    })
  }

  function saveChangesAllWh () {
    setLoading1(true)
    detailActions.saveEditItemChanges( true ).then(
      ({ success }) => {
        setLoading1(false)
        if( success ){
          global.$('#edit-item').modal('hide')
        }
    })
    .catch(()=> {
      setLoading1(false)
    })
  }

  let {
    shipping,
    export : exportData,
    dg,
    edi,
    updateParams
  } = editItemData


  let {
    account_wh = '',
    item_number = '',
    key_item,
    desc1 = ''
  } = updateParams

  return (

    <div
      className="modal fade"
      id="edit-item"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header rs_title_bar">
            <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
            <h4 className="uppercase"><i className="fa fa-edit font-green-soft" style={{fontSize: "15px"}}></i> EDIT ITEM</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal">
              <div className="form-body">
                <Tabs
                  activeTab={ activeTab }
                  onTabClicked={ onTabClicked }
                  tabs={
                    [{
                      type : 'shipping',
                      name : 'Shipping'
                    },{
                      type : 'export',
                      name : 'Export'
                    },{
                      type : 'dg',
                      name : 'DG Data'
                    },{
                      type : 'edi',
                      name : 'EDI'
                    }]
                  }
                />

                <div className="tabbable-line">

                  <div style={{ padding: '20px 10px' }}>
                    <table style={{width: "100%"}}>
                      <tbody>
                      <tr>
                        <td style={{width:"130px", verticalAlign:"top"}}>
                          <span style={{fontWeight: 600}}>Item #: </span>
                        </td>
                        <td>
                          <span className="text-primary">{ item_number }<br/><i className="text-muted">{ desc1 }</i></span>
                        </td>
                        <td>
                        </td>
                        <td style={{textAlign:"right"}}>
                          <label className="mt-checkbox mt-checkbox-outline">
                            <input
                              type="checkbox"
                              value={ key_item }
                              checked={ key_item }
                              onChange={ onKeyItemValueChanged }
                            /> Mark as Key Item
                            <span></span>
                          </label>
                        </td>
                      </tr>
                      <tr><td colSpan="4">&nbsp;</td></tr>
                      <tr>
                        <td>
                          <span style={{fontWeight: 600}}>Account # - WH:</span>
                        </td>
                        <td>
                          <span> { `${ account_wh.replace( /\.\w+/, '' ) } - ${ account_wh.replace( /[0-9]+\./, '' ) }` }</span>
                        </td>
                        <td>

                        </td>
                        <td>

                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="tab-content" style={{padding: "10px 0"}}>
                    {
                      activeTab === 'shipping' &&
                      <ShippingTab
                        shippingData={ shipping }
                        detailActions={ detailActions }
                        editItemData={ editItemData }
                      />
                    }

                    {
                      activeTab === 'export' &&
                      <ExportTab
                        detailActions={ detailActions }
                        exportData={ exportData }
                        editItemData={ editItemData }
                      />
                    }

                    {
                      activeTab === 'dg' &&
                      <DgTab
                        detailActions={ detailActions }
                        dgData={ dg }
                        editItemData={ editItemData }
                      />
                    }

                    {
                      activeTab === 'edi' &&
                      <EdiTab
                        detailActions={ detailActions }
                        ediData={ edi }
                        editItemData={ editItemData }
                      />
                    }
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal">
              Cancel
            </button>&nbsp;&nbsp;

            <ButtonLoading
              className="btn red-soft"
              handleClick={ saveChangesAllWh }
              name={'Save Changes all WHs'}
              loading={ loading1 }
            />&nbsp;&nbsp;

            <ButtonLoading
              className="btn green-soft"
              handleClick={ saveChangesThisWh }
              name={'Save Changes this WH'}
              loading={ loading2 }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    activeTab     : state.invoices.open.activeEditItemTab,
    editItemData  : state.invoices.open.editItemData
  }),
  dispatch => ({
    detailActions : bindActionCreators( detailActions, dispatch )
  })
)(OthersMain)
