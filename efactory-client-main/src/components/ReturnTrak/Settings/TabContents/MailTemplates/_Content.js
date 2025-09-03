import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as templateActions from './redux'
import RmaTemplatesTable from './RmaTemplatesTable/_Content'
import TemplateEditors from './TemplateEditors/_Content'

const MailTemplates = props => {
  return (
    <section className="mail-templates-content">
      <div className="container-page-bar-fixed">
        <RmaTemplatesTable 
          templateActions={props.templateActions}
        />
        <TemplateEditors 
          templateActions={props.templateActions}
        />
      </div>
    </section>
  )
}

export default connect(
  null,
  dispatch => ({
    templateActions: bindActionCreators( templateActions, dispatch )   
  })
)(MailTemplates)