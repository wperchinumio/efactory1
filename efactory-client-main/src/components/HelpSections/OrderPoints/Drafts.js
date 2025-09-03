import React from 'react'

const HelpDrafts = () => {
  return (
    <div className="help-content">
      <h1 className="text-left">OrderPoints - Order Drafts</h1>
      <p className="text-left">Drafts shows a list of saved drafts.  Each draft can be updated, placed as a live order, or used as an order template.</p>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
            &nbsp;
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Drafts  
          </h4>
          <p className="text-left">
            Clicking on Drafts Link in the Navigation on OrderPoints tab will bring up the Drafts List View.<br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/orderPoints_Drafts.jpg"/>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
            &nbsp;
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Draft Actions - Delete 
          </h4>
          <p className="text-left">
            A draft can be selected and Deleted, Edited or Toggled between draft and template using the 3 actions from the drop down.<br/><br/>
            Multiple drafts/templates can be selected for deletion.
            <br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/orderPoints - DraftActions.jpg"/>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
            &nbsp;
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Draft Actions - Toggle Template
          </h4>
          <p className="text-left">
            A draft starts with the letter "D" and can be edited to either update the draft or to place an order.<br/>
            Once a draft has been used to place an order, it does not appear in the "Drafts" List.
            Click on "Toogle Template" from Action drop down to convert the draft into a template.
            A template starts with the letter "T" and can be updated. When an order needs to be placed, a saved template must be toggled back to a "draft".
            <br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/OrderPoints_DraftToggle.jpg"/>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
            &nbsp;
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Draft Actions - Template
          </h4>
          <p className="text-left">
            Once a draft has been converted to a template, the first letter of the name now shows up as "T" - for template.
            A template can be edited and updated.
            <br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/OrderPoints_DraftToggled.jpg"/>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
              &nbsp;
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Draft Actions - Edit Draft
          </h4>
          <p className="text-left">
            A draft starts with the letter "D" and can be edited to either update the draft or to place an order.<br/>
            Once a draft has been used to place an order, it does not appear in the "Drafts" List.
            <br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/OrderPoints_DraftEntry.jpg"/>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-left">
            &nbsp;
          </p>
        </div>
       </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-left"></p>
          <h4 className="text-left">
            Draft Actions - Edit Template
          </h4>
          <p className="text-left">
            Click on a Template and choose "Edit Template" from the Actions Menu.
            Template can be updated, it will still show up in the draft list as a template.
            Toggle it back to a draft in order to place an order.
            <br/><br/>
          </p>
        </div>
        <div className="col-md-8">
          <p className="text-right">
            <img role="presentation" src="/src/styles/images/help/op/drafts/OrderPoints_EditTemplate.jpg"/>
          </p>
          <div className="col-md-8">
            <p className="text-left">
              <br/><br/>
              Clicking on Edit Template will bring up the following screen:-
            </p>
            <p className="text-right">
              <img role="presentation" src="/src/styles/images/help/op/drafts/OrderPoints_UpdateTemplate.jpg"/>
            </p>
          </div>
        </div>
        <br/>
        <p></p>
      </div>
    </div>
  )
}

export default React.memo(HelpDrafts)