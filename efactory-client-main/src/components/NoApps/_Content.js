import React     from 'react'

const NoApps = () => (
    <div className="row">
        <div className="col-md-6 col-md-offset-3">
            <div className="notfound-body">
                <h1 className="font-red-soft">No application available.</h1>
                <br />
                <h4>You don't have permission to open any application.</h4>
                <h4>Please contact your account administrator.</h4>
            </div>
        </div>
    </div>
)

export default NoApps
