import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Editor from './Editor'
import EditorBottomControls from './EditorBottomControls'
import EmailSample from './EmailSample'
import KeywordsTable from './KeywordsTable'
import Tabs from './Tabs'
import getDeepProperty from '../../../../../_Helpers/getDeepProperty'
import TableGreyConfig from '../RmaTemplatesTable/TableConfig'

const TemplateEditors = props => {
  function onEditorChanged (html) {
    props.templateActions.updateTemplateData({ field: 'html', value: html })
  }

  let {
    activeRmaType,
    activeTab,
    activeTemplate,
    templateActions
  } = props

  /* @todo improve, move this to somewhere else */
  let html = getDeepProperty( activeTemplate, [ activeTab, 'html' ], '' )
  let active = getDeepProperty( activeTemplate, [ activeTab, 'active' ], false )

  let activeTabIndex = [ 'issue', 'receive', 'ship', 'cancel' ].indexOf(activeTab)

  return (
    <div className="col-md-9">
      <div className="portlet light bordered">
        <div className="portlet-title tabbable-line">
          <Tabs
            activeTab={activeTab}
            onTabClicked={props.templateActions.setActiveTab}
            tabs={
              [{
                type: 'issue',
                name: 'Issue RMA'
              },{
                type: 'receive',
                name: 'Receive RMA'
              },{
                type: 'ship',
                name: 'Ship RMA'
              },{
                type: 'cancel',
                name: 'Cancel RMA'
              }]
            }
          />
        </div>
        <div className="portlet-body">
          <div className="tab-content">
            <div className="tab-pane active">
              <div className="row">
                <div className="col-md-8">
                  <div className={ classNames({
                    'disable-email-template-editing': true,
                    'hidden': TableGreyConfig[activeRmaType][0][activeTabIndex]
                  }) }>
                    Template disabled
                  </div>
                  <Editor
                    value={html}
                    handleEditorChange={ onEditorChanged }
                    templateActions={ templateActions }
                  />
                  <EditorBottomControls
                    enabled={active}
                    value={html}
                    templateActions={ templateActions }
                  />
                  <hr />
                  <EmailSample
                    templateActions={ templateActions }
                  />
                </div>
                <div className="col-md-4">
                  <KeywordsTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    activeTab: state.returnTrak.mailTemplates.activeTab,
    activeTemplate: state.returnTrak.mailTemplates.activeTemplate,
    activeRmaType: state.returnTrak.mailTemplates.activeRmaType,
  })
)(TemplateEditors)