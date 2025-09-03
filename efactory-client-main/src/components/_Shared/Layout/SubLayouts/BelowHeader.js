import React from 'react'
import MainContent from './ContentComponent'

const BelowHeaderMain = props => {
  if(!this.props.content){
    console.error("'content' props has to be defined for the layout to be rendered properly")
  }
  return (
    <div>
      { this.props.sidebar }
      <MainContent>
        {this.props.content}
      </MainContent>
    </div>
  )
}

export default BelowHeaderMain