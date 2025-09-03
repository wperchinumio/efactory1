import React from 'react'
import MainContent from './ContentComponent'

const LayoutNotFound = props => {
	return (
    <div>
      <MainContent notFoundStyleFix="true">
        {props.content}
      </MainContent>
    </div>
  )
}

export default LayoutNotFound