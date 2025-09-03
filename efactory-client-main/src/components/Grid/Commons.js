import React from 'react';


/*----------  Commonly used grid components  ----------*/

export const

	/**
	 *
	 * This module contains common components
	 * tr, th, td, thead, table, col, colgroup
	 *
	 */

	GridRow = ({children, ...rest}) => <tr {...rest}>{children}</tr>,

	GridHeader = ({children, ...rest}) => <th {...rest}>{children}</th>,

	GridData = ({children, ...rest}) => <td {...rest}>{children}</td>,

	GridHead = ({ children }) => <thead>{ children }</thead>,

	GridBody = ({ children, ...rest }) => <tbody {...rest}>{ children }</tbody>,

	GridTable = ({ children, ...rest }) => <table {...rest}>{ children }</table>,

	GridCol = ({ width , ...rest}) => <col style={{width : (width+"px")}} {...rest} ></col>;



