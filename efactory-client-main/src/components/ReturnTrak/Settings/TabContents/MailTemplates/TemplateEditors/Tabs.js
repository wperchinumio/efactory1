import React from 'react'

const Tabs = ({
  activeTab,
  onTabClicked,
  tabs
}) => {
  return (
    <div className="tabbable-line">
      <ul className="nav nav-tabs">
        {
          tabs.map( tab => {
            let { type, name } = tab
            return (
              <li 
                className={ activeTab === type ? 'active' : ''}
                onClick={ event => onTabClicked( type ) }
                key={ `tabs-key-${type}` }
              >
                <a> 
                  { name } 
                </a>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Tabs