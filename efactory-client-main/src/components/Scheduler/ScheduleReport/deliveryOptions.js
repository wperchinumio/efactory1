import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const DeliveryOptions = props => {
	const [ftpTabActive, setFtpTabActive] = useState(true)

	function handleProtocol (event, protocol) {
  	if (!protocol) {
  		return console.error('handleProtocol expected a valid protocol as the second param')
  	}
  	props.scheduleActions.setScheduleDeliveryFtpField({...props.ftp, protocol})
  }

  function handleFtpField (event, field) {
  	props.scheduleActions.setScheduleDeliveryFtpField({...props.ftp, [field]: event.target.value})
  }

  function handleEmailField (event, field) {
  	props.scheduleActions.setScheduleDeliveryEmailField({...props.email, [field]: event.target.value})
  }

  return (
		<div>
			<div>
				<h5 className="font-red-soft bold"><i className="fa fa-send"></i> Delivery options</h5>
			</div>
			<div className="tabbable-line">
				<ul className="nav nav-tabs ">
				  <li className="active">
				    <a href="#email" data-toggle="tab" aria-expanded="true"><i className="fa fa-envelope font-dark"></i> Email </a>
				  </li>
				  <li className="">
				    <a
				    	href="#ftp"
				    	data-toggle="tab"
				    	aria-expanded="false"
				    	onClick={ event => setFtpTabActive(false) }
				    ><i className="fa fa-cloud-upload font-dark"></i> FTP </a>
				  </li>
				</ul>
				<div className="tab-content" style={{padding: "10px 0"}}>
				  <div className="tab-pane active" id="email">
				    <form
		          autoComplete="off"
				    	className="form-horizontal"
				    	onSubmit={ event => event.preventDefault() }
				    >
				      <div className="form-group">
				        <label htmlFor="email" className="col-sm-2 control-label">Email</label>
				        <div className="col-sm-9">
				          <input
				          	type="text"
				          	className="form-control"
				          	id="email"
				          	placeholder="Email"
				          	value={ props.email.to }
				          	onChange={ event => handleEmailField(event, 'to') }
				          />
				        </div>
				      </div>
				    </form>
				  </div>
				  <div className="tab-pane" id="ftp">
				    <form
		          autoComplete="off"
				    	className="form-horizontal"
				    	
				    >
				      <div className="form-group col-md-6">
				        <label htmlFor="url" className="col-sm-4 control-label">URL</label>
				        <div className="col-sm-8">
				          <input
				          	type="text"
				          	className="form-control"
				          	value={ props.ftp.url }
				          	onChange={ event => handleFtpField(event, 'url') }
				          	id="url" placeholder="URL"/>
				        </div>
				      </div>
				      <div className="form-group col-md-6">
				        <div className="col-sm-12 col-md-offset-4">
				          <label className="mt-radio mt-radio-outline" style={{paddingRight: "20px"}}> FTP
				            <input
				            	type="radio"
				            	value="ftp"
				            	name="ftp_type"
				            	checked={ props.ftp.protocol === 'ftp' }
				            	onChange={ event => handleProtocol(event, 'ftp') }
				            />
				            <span></span>
				          </label>&nbsp;&nbsp;
				          <label className="mt-radio mt-radio-outline"> SFTP
				            <input
				            	type="radio"
				            	value="sftp"
				            	name="ftp_type"
				            	checked={ props.ftp.protocol === 'sftp' }
				            	onChange={ event => handleProtocol(event, 'sftp') }
				            />
				            <span></span>
				          </label>
				        </div>
				      </div>
				      <div className="form-group col-md-6">
				        <label htmlFor="username" className="col-sm-4 control-label">Username</label>
				        <div className="col-sm-8">
				          <input
				          	type="text"
				          	readOnly={ftpTabActive}
				          	className="form-control"
				          	id="username"
				          	placeholder="Username"
				          	value={ props.ftp.username }
				          	onChange={ event => handleFtpField(event, 'username') }
				          />
				        </div>
				      </div>
				      <div className="form-group col-md-6">
				        <label htmlFor="password" className="col-sm-4 control-label">Password</label>
				        <div className="col-sm-8">
				          <input
				          	type="password"
				          	readOnly={ftpTabActive}
				          	className="form-control"
				          	id="password"
				          	placeholder="Password"
				          	value={ props.ftp.password }
				          	onChange={ event => handleFtpField(event, 'password') }
				          />
				        </div>
				      </div>
				      <div className="form-group col-md-6">
				        <label htmlFor="home" className="col-sm-4 control-label">Home dir</label>
				        <div className="col-sm-8">
				          <input
				          	type="text"
				          	className="form-control"
				          	id="home"
				          	placeholder="Home dir"
				          	value={ props.ftp.home_dir }
				          	onChange={ event => handleFtpField(event, 'home_dir') }
				          />
				        </div>
				      </div>
				      <div className="form-group col-md-6">
				        &nbsp;
				      </div>
				    </form>
				  </div>
				</div>
			</div>
		</div>
  )
}

DeliveryOptions.propTypes = {
  ftp: PropTypes.shape({
		url: PropTypes.string,
		username: PropTypes.string,
    password: PropTypes.string,
    home_dir: PropTypes.string,
    protocol: PropTypes.oneOf([ 'ftp', 'sftp' ])
  }),
  email: PropTypes.shape({
    to: PropTypes.string
  }),
  scheduleActions: PropTypes.object.isRequired
}

export default connect(
	state => ({
		delivery_options: state.scheduler.modal.delivery_options
	})
)(DeliveryOptions)