import React from 'react'

const PasswordPolicy = () => (
	<div className="col-md-12 small">
	  Passwords must meet these requirements:
	  <ul>
	    <li>be at least <strong>8</strong> characters in length</li>
	    <li>contain both letters and numbers</li>
	    <li>contain at least one special character: ~ ` ! @ # $ % ^ &amp; * ( ) - _ + = {'{'} {'}'} [ ] | \ ; " &lt; &gt; , . / ?</li>
	  </ul>
	</div>
)

export default PasswordPolicy