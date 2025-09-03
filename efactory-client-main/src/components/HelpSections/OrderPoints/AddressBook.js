import React from 'react'

const AddressBookHelp = () => {
	return (
    <div className="help-content">
		  <h1 className="text-left">OrderPoints - Address Book</h1>
		  <p className="text-left">Address Book shows you a list of your saved addresses. You may add, edit, duplicate, or delete addresses from this page.</p>
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
		        Address Book  
		      </h4>
		      <p className="text-left">
		        Clicking on Address Book in the Navigation on OrderPoints tab will bring up the Address Book List View.<br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook.jpg"/>
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
		        Address Book - Add 
		      </h4>
		      <p className="text-left">
		        A new address can be added to the Address Book. The Shipping Address can be copied over to the Billing Address, or if needed the Billing Address can be entered separately.
		        <br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddAddress.jpg"/>
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
		        Address Book - Edit
		      </h4>
		      <p className="text-left">
		        In order to update an existing address, first select it and then click on "Edit"
		        <br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_EditAddress.jpg"/>
		      </p>
		      <div className="col-md-8">
		        <p className="text-left">
		          <br/><br/>
		          Clicking on Edit will bring up the screen below. Make changes and click "Save"
		          <br/>
		        </p>
		        <p className="text-right">
		          <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_saveUpdatedAddress.jpg"/>
		        </p>
		      </div>
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
		        Address Book - Duplicate and Delete
		      </h4>
		      <p className="text-left">
		        To duplicate an address (make a copy of it), select the address to duplicate and then select "DUPLICATE". 
		        <br/><br/>
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_Duplicate_btn.png"/><br/><br/>
		        Similarly, to delete an obsolote address, select the address to delete and then select "DELETE".
		        <br/><br/>
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_Delete_btn.png"/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_Duplicate.jpg"/>
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
		        Address Book - Actions
		      </h4>
		      <p className="text-left">
		        Address Books Actions will allow you to Export the address list to a file or Import contacts from a file. 
		        <br/><br/>
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_Action_btn.png"/><br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-left">
		        Exporting the address list to a file will provide a download in Excel format. <br/><br/>
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_ExportContacts.jpg"/><br/><br/>
		        Importing contact will open the following screen. 
		        <br/><br/>
		        <img role="presentation" src="/src/styles/images/help/op/addressBook/OrderPoints_AddressBook_ImportContacts.jpg"/><br/><br/>
		        Follow the instructions shown on the screen.  Select "Download Template" &gt;&gt; Input your contacts into the template &gt;&gt; Import the file &gt;&gt;  Select the appropriate options.  <br/><br/>
		        Select "Import Contacts" when you are ready to import your contacts into the address book.
		        <br/><br/>
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
		</div>
  )
}

export default React.memo(AddressBookHelp)