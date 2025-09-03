import React from 'react'

const ShippingCostEstimatorHelp = () => {
	return (
		<div className="help-content">
		  <h1 className="text-left">Transportation - Cost Estimator</h1>
		  <p className="text-left">Cost Estimator estimates the freight cost and package cost for shipments. <a href="Userguide.html">(help list)</a></p>
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
		        Cost Estimator
		      </h4>
		      <p className="text-left">
		        Cost Estimator is found in Transportation <br/><br/>
		        It is found in the left sidebar navigation menu.<br/><br/>
		      </p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-center">
		        <img role="presentation" src="/src/styles/images/help/op/shippingCostEstimator/shipping-cost-estimator-btn.png"/>
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
		    <div className="col-md-12">
		      <p className="text-left">
		        &nbsp;
		      </p>
		    </div>
		  </div>
		  <div className="row">
		    <div className="col-md-4">
		      <h4 className="text-left">
		        Estimate Freight
		      </h4>
		      <p className="text-left">
		        Start by selecting either Freight or Package <br/><br/>
		        Here Freight is selected<br/><br/>
		        The underline indicates which section is selected. <br/><br/>
		        Less Than Truckload (LTL) Freight is available for large items that do not fit into traditional packaging or heavy items that are greater than 150 pounds.  
		        <br/><br/>
		        LTL Freight avoids the use of a full truck.  LTL shipments are usually in the range of 150 lbs to 20,000 lbs.  <br/><br/>
		        Shipments by LTL have longer transit times due to the additional stops it makes along the route.
		      </p>
		      <p></p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/shippingCostEstimator/shipping-cost-estimator-screen.jpg"/>
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
		    <div className="col-md-12">
		      <p className="text-left">
		        &nbsp;
		      </p>
		    </div>
		  </div>
		  <div className="row">
		    <div className="col-md-4">
		      <h4 className="text-left">
		        Estimate Package
		      </h4>
		      <p className="text-left">
		        You may also select Package to estimate freight for a package.<br/><br/>
		        Here Package is selected<br/><br/>
		        The underline indicates which section is selected. <br/><br/>
		        Packages that are less than 150 pounds can be transported by Ground or Air. <br/><br/> 
		        Packages can be up to 165 inches (419 cm) in length and girth combined. Packages can be up to 108 inches (270 cm) in length.<br/><br/> 
		        Packages with a large size-to-weight ratio require special pricing and dimensional weight calculations.
		      </p>
		      <p></p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/shippingCostEstimator/shipping-cost-estimator-screen2.jpg"/>
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
		    <div className="col-md-12">
		      <p className="text-left">
		        &nbsp;
		      </p>
		    </div>
		  </div>
		  <div className="row">
		    <div className="col-md-4">
		      <h4 className="text-left">
		        Example Package Estimate
		      </h4>
		      <p className="text-left">
		        Here we see the shipment cost estimate for a package from our Fremont warehouse to Colorado Springs, that is 3 lb, 7 inches in length, 7 inches in width, 3 inches in height, and shipping to a residential address. 
		      </p>
		      <p></p>
		    </div>
		    <div className="col-md-8">
		      <p className="text-right">
		        <img role="presentation" src="/src/styles/images/help/op/shippingCostEstimator/shipping-cost-estimator-example.jpg"/>
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
		    <div className="col-md-12">
		      <p className="text-left">
		        &nbsp;
		      </p>
		    </div>
		  </div>
		</div>
  )
}

export default React.memo(ShippingCostEstimatorHelp)