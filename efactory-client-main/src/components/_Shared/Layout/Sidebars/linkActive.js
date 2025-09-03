import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const LinkActive = ({ children, isActive, isStart, to }) => {
	return (
		<li className={ classNames({ 'active': isActive(to), 'start' : isStart }) }>
    	<Link to={to} activeClassName="link-active">
    		{children}
    	</Link>
		</li>
	)
}

export default LinkActive