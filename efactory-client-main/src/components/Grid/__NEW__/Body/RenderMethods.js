import React from 'react'
import { Link } from 'react-router-dom'
import OrderStage from '../../../_Helpers/OrderStage'
import FormatNumber from '../../../_Helpers/FormatNumber'
import FormatDate from '../../../_Helpers/FormatDate'
import getDeepProperty from '../../../_Helpers/getDeepProperty'
import { getUserData } from '../../../../util/storageHelperFuncs'
import classNames from 'classnames'

// temp here
const colorTable = {
	'I' : '#f98585',
	'N' : '#ff0',
	'M' : '#8ff18f',
	'R' : '#5da8d9',
  'O' : '#a6cfea',
  'P' : '#92d050',
  'T' : '#ffc000'
}

export function fmtorderstage( dataObject, fieldName ){
	return (
		<OrderStage
	  	order_stage={ dataObject[ 'order_stage' ] }
	  	stage_description={ dataObject[ 'stage_description' ] }
	  />
	)
}

export function fmtshipto( dataObject, fieldName ){

	let shipping_address = dataObject.shipping_address || {};

  return (
  	<div className={`ship-to-outer`} key={dataObject.id+"shipto"}>
      <i className="font-blue-soft">
        {`${shipping_address.company || ''} ${shipping_address.company && shipping_address.attention ? '|' : ''} ${shipping_address.attention || ''}`}
      </i><br />
      {`${shipping_address.city || ''}, ${shipping_address.state_province || ''} ${shipping_address.postal_code || ''} - ${shipping_address.country || ''}`}
    </div>
  )
}

export function fmtcarrier( dataObject, fieldName ){
	return (
    <span>
      <span className="bold">{dataObject['shipping_carrier']}</span> - <span>{dataObject['shipping_service']}</span><br/>
      {dataObject['trl']?
        <a href={dataObject['trl']} target="_blank">{dataObject['tr']}</a>:<span>{dataObject['tr']}</span>
      }
    </span>
  )
}

export function fmtdate( dataObject, fieldName ){

	let value = dataObject[ fieldName ]

	if( value ){
		return <FormatDate date={ value } noTime="true"/>
	}
	return ''
}

export function fmtdatetime( dataObject, fieldName ){

	let value = dataObject[ fieldName ]

	if( value ){
		return <FormatDate date={ value } noTime="false"/>
	}
	return ''
}

export function fmtorderstatus( dataObject, fieldName ){

	let value = dataObject.order_status

	if( value === 0 ){
		return <span className="font-red-soft sbold ">On Hold</span>
	}else if( value === 1 ){
		return <span>Normal</span>
	}else if( value === 2 ){
		return <span className="font-purple-plum sbold">Rush</span>
	}else{
		return <span>Unknown</span>
	}
}

export function fmttracking( dataObject, fieldName ){

	if( fieldName !== 'trl' ) return 'Unknown'

	if( dataObject.trl ){
		return (
	    <span className="text-primary bold">
	      <Link to={`${dataObject.trl}`} target={"_blank"}>
	        {dataObject.tr}
	      </Link>
	    </span>
	  )
	}else{
		return (
	    <span className="text-primary bold">
        {dataObject.tr}
	    </span>
	  )
	}
}

export function fmtnumber(
	dataObject,
	fieldName,
  decimals,
  strong = 'false',
  dimZero = 'false',
  hideNull = 'false',
  redIfOne = null,
  color
){

	if( String(strong).includes('#') ) color = String(strong)
	if( String(dimZero).includes('#') ) color = String(dimZero)
	if( String(hideNull).includes('#') ) color = String(hideNull)
	if( String(redIfOne).includes('#') ) color = String(redIfOne)

	let props = {
    obj : dataObject,
    'number' : dataObject[fieldName],
    decimals,
    strong,
    dimZero,
    hideNull,
    redIfOne
  }
  if( !color ) return <FormatNumber {...props} />

  return <div
		style={{
			height: '38px',
			margin: '-3px -5px',
			backgroundColor : color,
			paddingTop: '3px'
		}}
	>
		<FormatNumber {...props} />
	</div>
}

export function fmtedidclpartner( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	let {
		partner_flag,
		registered,
		register_now
	} = dataObject
	let backgroundColor = 'inherit'
	let fontStyle = 'inherit'
	if ( partner_flag === 'A' ) {
    if( !registered ){
			if( !register_now ){
				backgroundColor = '#F8FF88'
			}else if( register_now ){
				backgroundColor = '#8FF18F'
			}
    }
	}
	if ( partner_flag === 'N' ) {
		fontStyle = 'italic'
	}

	return (
		<div
			style={{
				height: '38px',
				margin: '-3px -5px',
				backgroundColor,
				fontStyle,
				paddingTop: '3px'
			}}
		>
			<span className="sbold">{ value }</span>
		</div>
	)
}

export function fmtedidoc( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	if( value && ['P','N','T','R', 'O' ].includes( value ) ){
		let color = colorTable[ value ]
		if( !color ) console.warn(`fmtedidoc got <${value}> and matched no color on colorTable. Fieldname is <${fieldName}>`)
		return (
			<div
				style={{
					height: '38px',
					margin: '-3px -5px',
					background: color ? color : 'inherit',
					paddingTop: '3px'
				}}
			>
			</div>
		)
	}
	return <span></span>
}

export function fmtedipartner( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	return <span
		className="fmtedipartner"
	>{ value }</span>
}

export function fmtedipartnername( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	let partner_flag = dataObject[ 'partner_flag' ]
	let fontStyle = 'inherit'
	if ( partner_flag === 'N' ) fontStyle = 'italic'
	return (
		<span
			style={{ fontStyle }}
		>
			{ value }
		</span>
	)
}

export function fmtorderlink( dataObject, fieldName ){

	let {
		order_number,
		account_number
	} = dataObject

	let pathname = getDeepProperty( global.window, [ 'location', 'pathname' ], '' )

	let isNotLink = pathname.includes('documents/orders-to-resolve') || pathname.includes('documents/orders-to-approve')

	return !isNotLink
		? <Link
			to={`${global.window.location.pathname}?orderNum=${encodeURIComponent( order_number )}${account_number ? '&accountNum=' + account_number : ''}`}>
			<span style={{ fontWeight : '700' }}>
				{order_number}
			</span>
    </Link>
    : <span style={{ fontWeight : '700', color: '#337ab7' }}>
    		{order_number}
    </span>
}

export function fmtbb( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	let is_new = dataObject[ 'is_new' ]
	return (
		<span
			className={ classNames({
				'bold': true,
				'new_customer' : is_new
			}) }
		 	style={{ color: '#337ab7' }}
		 >
			{value}
		</span>
	)
}

let hasEmailClicked = event => {
	event.preventDefault()
	let custom_event = new CustomEvent('HasEmailClicked', { detail: {
		id : event.currentTarget.getAttribute('data-id')
	} });

	global.document.dispatchEvent( custom_event );
}

export function hasemail( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	return (
		<span style={{ color: '#337ab7' }} >
			{
				value &&
				<a onClick={ hasEmailClicked } data-id={ dataObject[ 'id' ] }>
					<i className="fa fa-eye"></i>
				</a>
			}
		</span>
	)
}

export function errormessage( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	return (
		<span style={{ color: 'red', fontSize : '13px' }} >
			{ value }
		</span>
	)
}

let onDownloadClicked_downloadbatch= event => {
	event.preventDefault()
	let custom_event = new CustomEvent('BatchDownload', { detail: {
		id : event.currentTarget.getAttribute('data-id')
	} });

	global.document.dispatchEvent( custom_event );
}

export function downloadbatch( dataObject, fieldName ){
  let value = dataObject[ fieldName ]

	return (
    dataObject['hide_link'] === true ?
       (<span>{value}</span> )
    :
      (<a onClick={ onDownloadClicked_downloadbatch } data-id={ dataObject[ 'id' ] }>
        { value }
      </a>)
	)
}

let onDownloadClicked_downloadackfile = event => {
	event.preventDefault()
	let custom_event = new CustomEvent('AckFileDownload', { detail: {
		id : event.currentTarget.getAttribute('data-id')
	} });

	global.document.dispatchEvent( custom_event );
}

export function downloadackfile( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	return (
		<a onClick={ onDownloadClicked_downloadackfile } data-id={ dataObject[ 'id' ] }>
			{ value }
		</a>
	)
}

export function notfixedindex( dataObject, fieldName ){
	let value = dataObject[ fieldName ]
	return (
		<div style={{ paddingRight: '15px' }}>
			{ value }
		</div>
	)
}

let onTotalImportedClicked = event => {
	event.preventDefault()
	let custom_event = new CustomEvent('TotalImportedClicked', { detail: {
		id : event.currentTarget.getAttribute('data-id')
	} });
	global.document.dispatchEvent( custom_event );
}

export function totalimported( dataObject, fieldName ){

	let {
		total_imported
	} = dataObject

	let apps = getUserData('apps') || []
	let isOrdersAllAllowed = apps.includes(11)

	return ( isOrdersAllAllowed && +total_imported > 0 ) ? (
		<a
			onClick={ onTotalImportedClicked }
			data-id={ dataObject[ 'id' ] }
		>
			{
				fmtnumber( dataObject, fieldName, 0, false, true )
			}
		</a>
	) : <span> { fmtnumber( dataObject, fieldName, 0, false, true ) } </span>
}

