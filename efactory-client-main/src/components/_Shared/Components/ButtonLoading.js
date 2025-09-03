import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import LoadingComponent from  './LoadingComponent'

const ButtonLoading = ({
	className = 'btn',
	disabled = false,
	handleClick,
	iconClassName = '',
	id = '',
	loading,
	name = '',
	style
}) => {
	let classNamesList = {}
	classNamesList[ className ] = true
	classNamesList[ 'loading-state' ] = loading
	classNamesList[ 'loading-button' ] = true
  return (
  	<span>
  		{
  			id &&
  			<button 
		      type="button"
		      className={ classNames( classNamesList ) }
			  	style={ style ? style : {} }
		      disabled={ disabled }
		      onClick={ handleClick }
		      id={ id }
		    >
		    	{ loading && <LoadingComponent /> }
		    	{ iconClassName && <i className={ iconClassName }></i> }
					<span className="button-name"> 
		    		{ name } 
		    	</span>
		    </button>
  		}
  		{
  			!id &&
  			<button 
		      type="button"
		      className={ classNames( classNamesList ) }
			  	style={ style ? style : {} }
		      disabled={ disabled }
		      onClick={ handleClick }
		    >
		    	{ loading && <LoadingComponent /> }
		    	{ iconClassName && <i className={ iconClassName }></i> }
					<span className="button-name"> 
		    		{ name } 
		    	</span>
		    </button>
  		}
  	</span>
  )
}

ButtonLoading.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.any.isRequired,
	iconClassName: PropTypes.string,
	style: PropTypes.object
}

export default ButtonLoading