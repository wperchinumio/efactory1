import React from 'react'
import classNames from 'classnames'
import { orderStatusClass, orderStatus, orderTypeClass } from '../../../_Helpers/OrderStatus'

const HeaderRendererTypes = {
	indexCol : ({ isDoubleLine, isGridFiltersHidden, isWithCheckboxes, onCheckAllItemsStatusChanged }) => (
		<div
			className="grid-header-cell"
			style={{
			width : isWithCheckboxes ? '70px' : '50px',
	      WebkitBoxFlex : isWithCheckboxes ? '70' : '50',
	      MsFlexPositive : isWithCheckboxes ? 70 : 50,
	      flexGrow : isWithCheckboxes ? '70' : '50',
	      MsFlexNegative : 1,
	      flexShrink : 1,
		    textAlign: 'right'
			}}
		>
			<div
				className={ classNames({
					'grid-header-title header-index-col' : true,
					'double-lined-title' : isDoubleLine
				}) }
				style={{ paddingRight: '10px' }}
			>	
				{
					isWithCheckboxes &&
					<label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
						<input 
							type="checkbox" 
							className="pull-right" 
							style={{ marginLeft: '5px', marginTop: '4px' }}
							checked={ false }
              				onChange={ onCheckAllItemsStatusChanged }
						/>
						<div className="title noselect" style={{ minWidth : '18px', marginLeft: '-8px' }}>
							#
						</div>
						<span className="bg-grey" style={{ margin: '3px 5px' }}/>
					</label>
				}
					
				{
					!isWithCheckboxes &&
					<div className="title noselect">
						#
					</div>
				}
			</div>
			{
				!isGridFiltersHidden &&
				<div className="grid-header-filter table-header-filter">
					<span></span>
				</div>
			}
		</div>
	),

	orderTypeCol : ({ isDoubleLine, isGridFiltersHidden }) => (
		<div
			className="grid-header-cell"
			style={{
				width : '75px',
	      WebkitBoxFlex : '75',
	      MsFlexPositive : 75,
	      flexGrow : '75',
	      MsFlexNegative : 1,
	      flexShrink : 1,
			}}
		>
			<div
				className={ classNames({
					'grid-header-title' : true,
					'double-lined-title' : isDoubleLine
				}) }
			>
				<div className="title noselect">

				</div>
			</div>
			{
				!isGridFiltersHidden &&
				<div className="grid-header-filter table-header-filter">
					<span></span>
				</div>
			}
		</div>
	),
}

const BodyRendererTypes = {

	indexCol : ({ row, index, isWithCheckboxes, checked }) => {
		return (
			<div
				className="grid-row-cell index-col-wrapper-cell"
				style={{
			    width : isWithCheckboxes ? '70px' : '50px',
		      WebkitBoxFlex : isWithCheckboxes ? '70' : '50',
		      MsFlexPositive : isWithCheckboxes ? 70 : 50,
		      flexGrow : isWithCheckboxes ? '70' : '50',
		      MsFlexNegative : 1,
		      flexShrink : '1',
			  textAlign: isWithCheckboxes ? 'left' : 'right', 
			  paddingRight: '10px',
				}}
			>
				{
					isWithCheckboxes &&
					<label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
						<input 
							type="checkbox" 
							className="pull-right" 
							checked={ false }
              onChange={ event => {} }
						/>
						<span></span>
						<div className="counter">{ row.row_id }</div>
					</label>
				}

				{
					!isWithCheckboxes ? row.row_id : ''
				}
			</div>
		)
	},

	orderTypeCol : ({ row }) => (
		<div
			className="grid-row-cell"
			style={{ 
				width : '75px',
	      WebkitBoxFlex : '75',
	      MsFlexPositive : 75,
	      flexGrow : '75',
	      MsFlexNegative : 1,
	      flexShrink : '1',
				padding: '1px 7px' 
			}}
		>
			<div className="order-type-wrapper">
				<div className="order-type-inner">
					<span className={ orderTypeClass( 'EDI' ) }>
						EDI
					</span>
	        <span className="pull-right order-wh">
					  { row.location }
				  </span>
				</div>
				<span className={ orderStatusClass(row.order_status) }
					style={ row.order_status === 1 ? {display:"none"} : {marginTop: "4px"} }>
					{ orderStatus(row.order_status) }
				</span>
	      <span aria-hidden="true"
	            className="icon-bubble text-muted pull-right"
	            style={ row.shipping_instructions ? {display:"block",paddingTop: "1px"} : {display:"none"} }>
				</span>
			</div>
		</div>
	),
}

export {
	HeaderRendererTypes,
	BodyRendererTypes
}