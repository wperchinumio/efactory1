import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as teamMemberActions from '../Utilities/FreightEstimator/redux'

const TeamMembersMain = props => {
  useEffect(
    () => {
      props.teamMemberActions.fetchTeamMembers()
      global.$('body').addClass('page-full-width')
      return () => {
        global.$('body').removeClass('page-full-width')
      }
    },
    []
  )

  let { teamMembers = [] } = props
  return (
    <div className="team-container">
      <h3 className="sbold">Team Members </h3>
      <p>List of DCL team members assigned to your account.<br/><br/></p>
      <div>
        <table style={{width: "100%"}} className="hidden-sm hidden-xs">
          <tbody>
            <tr>
              <td style={{width: "145px"}}>&nbsp;</td>
              <td><div className="row">
                <div className="col-md-2">
                  <span className="team-title">First Name</span>
                </div>
                <div className="col-md-3">
                  <span className="team-title">Last Name</span>
                </div>
                <div className="col-md-4">
                  <span className="team-title">Job Title</span>
                </div>
                <div className="col-md-3">
                  <span className="team-title">Contact</span>
                </div>
              </div></td>
              <td style={{width: "35px"}}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="timeline  white-bg ">
        {
          teamMembers.map( 
            ( teamMember, index ) => {

              let {
                pic_url,
                first_name,
                last_name,
                job_title,
                email,
                phone
              } = teamMember
              return (
                <div className="timeline-item" key={`teamMember-${index}`} >
                  <div className="timeline-badge">
                    {
                      pic_url ? 
                      <img 
                        className="timeline-badge-userpic" 
                        role="presentation" 
                        src={ pic_url }
                      />
                      :  
                      <div className="timeline-icon">
                        <i className="icon-user-following font-green-haze"></i>
                      </div>
                    }
                  </div>
                  <div className="timeline-body">
                    <div className="timeline-body-arrow"> </div>
                    <div className="timeline-body-head">
                      <div>
                        <div className="col-md-2">
                          <span className="team-name font-blue-madison">
                            { first_name }
                          </span>
                        </div>
                        <div className="col-md-3">
                          <span className="team-name font-blue-madison">
                            { last_name }
                          </span>
                        </div>
                        <div className="col-md-4">
                          <span className="team-value">
                            { job_title }
                          </span>
                        </div>
                        <div className="col-md-3">
                          <span className="team-value">
                            <i className="fa fa-phone font-green-seagreen"></i> { phone }
                          </span>
                          <br/>
                          <span className="team-value team-email">
                            <i className="fa fa-envelope font-green-seagreen"></i> { email }
                          </span>
                          &nbsp;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>        
              )
            } 
          )
        }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    teamMembers: state.services.utilities.freightEstimator.teamMembers
  }),
  dispatch => ({
    teamMemberActions: bindActionCreators( teamMemberActions, dispatch )
  })
)(TeamMembersMain)