import React from 'react'

const OthersMain = () => {
	return (
		<div className="help-content">
		  <h1 className="text-left">Orders</h1>
			<p className="text-left">
				The order list quickly loads all orders from
				which you can filter as needed.
			</p>
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
						Orders - Open
					</h4>
					<p className="text-left">
						Open orders is the default for the order tab.
						<br /><br />
						Click or tap on a menu item to view details for
						additional predefined filters.
						<br /><br />
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-2.jpg'}  />
						<br /><br />
						The number next to the menu item shows the
						number of items in the list for that specific filter.
						<br /><br />
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-indicator.png'} />
						- This indicators there are 434 items in this list.
						<br /><br />
					</p>
				</div>
				<div className="col-md-8">
					<p className="text-right">
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-1.jpg'}  />
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
						Pagination
					</h4>
					<p className="text-left">
						Click or tap on on the arrows to view additional pages,
						<br /><br />
						Or enter a page number and press the enter or return key.
						<br /><br />
					</p>
				</div>
				<div className="col-md-8">
					<p className="text-right">
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-pagination.jpg'}  />
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
						Change filters
					</h4>
					<p className="text-left">
						You can change a filter at any time,
						<br /><br />
						Select it from the drop down arrow.
						<br /><br />
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-drop-down.png'}  />
					</p>
				</div>
				<div className="col-md-8">
					<p className="text-right">
						<img role="presentation" src={'/src/styles/images/help/order/list-orders-filter-drop-downs.png'}  />
					</p>
				</div>
			</div>
		</div>
  )
}

export default React.memo(OthersMain)