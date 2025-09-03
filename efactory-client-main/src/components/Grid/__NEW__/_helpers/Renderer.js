import React from 'react'
import { HeaderRendererTypes, BodyRendererTypes } from './RendererTypes'

export function getDefaultHeaderCells( 
	columnTypes = [], 
	id = '', 
	isDoubleLine, 
	isGridFiltersHidden,
	isWithCheckboxes,
	onCheckAllItemsStatusChanged
){

	if( !id ) return console.error('id is required for getDefaultHeaderCells')

	if( !columnTypes.length ){
		return console.error(
			'getDefaultHeaderCells method expected param to '+
			' be an array with none-zero length' 
		)
	}

	return columnTypes.map( 
		columnType => {
			let HeaderCellRendered = HeaderRendererTypes[ columnType ]
			return <HeaderCellRendered 
				key={ `h-c-r-${id}-${columnType}` } 
				isDoubleLine={ isDoubleLine } 
				isGridFiltersHidden={ isGridFiltersHidden }
				isWithCheckboxes={ isWithCheckboxes }
				onCheckAllItemsStatusChanged={ onCheckAllItemsStatusChanged }
			/>
		}
	)
}

export function getDefaultBodyCells( 
	columnTypes = [], 
	id = '',
	data = {},
	isWithCheckboxes,
	checked
){

	if( !id ) return console.error('id is required for getDefaultHeaderCells')

	if( !columnTypes.length ){
		return console.error(
			'getDefaultHeaderCells method expected param to '+
			' be an array with none-zero length' 
		)
	}

	return columnTypes.map( 
		columnType => {
			let BodyCellRendered = BodyRendererTypes[ columnType ]
			return (
				<BodyCellRendered 
					key={ `b-c-r-${id}-${columnType}` }
					isWithCheckboxes={ isWithCheckboxes }
					checked={ checked }
					{ ...data }
				/>
			)
		}
	)
}