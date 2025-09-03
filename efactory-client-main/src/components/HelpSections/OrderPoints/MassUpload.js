import React from 'react'

const MassUploadHelp = () => {
	return (
    <div className="help-content">
		  <h1 className="text-left">OrderPoints - Mass Upload</h1>
		  <p className="text-left">Mass Upload provides the ability to upload a batch of orders. Two templates are available to upload, either by one order per excel row or one line per excel row. You can use the mass upload for verification only to test out your upload file, or you can send it to Sandbox or Production.  Sandbox is a staging area, where DCL support can release orders upon request.  Production is live fulfillment, these items will be put into queue for shipping.<a href="Userguide.html">(help list)</a></p>
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
		        Mass Upload  
		      </h4>
		      <p className="text-left">
		        Clicking on Mass Upload link in the Navigation on OrderPoints tab will bring up the Mass Upload View.<br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/massUpload/OrderPoints_MassUpload.jpg"/>
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
		        Mass Upload Excel
		      </h4>
		      <p className="text-left">
		        Download one of the two excel templates and fill them in. Upload the filled excel spreadhseet.
		        Verification process starts immediately and log messages will show whether upload was succesful or not.
		        <br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/massUpload/OrderPoints_MassUploadVerify.jpg"/>
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
		  <br/><br/>
		  <p></p>
		</div>
  )
}

export default React.memo(MassUploadHelp)