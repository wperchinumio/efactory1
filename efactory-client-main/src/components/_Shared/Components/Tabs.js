import React from 'react'

const Tabs = ({
  activeTab,
  onTabClicked,
  tabs,
  children
}) => {
  return (
    <div className="tabbable-line">
      <ul className="nav nav-tabs">
        {
          tabs.map(
            ({type, name}) => {
              return (
                <li 
                  className={ activeTab === type ? 'active' : ''}
                  onClick={ event => onTabClicked( type ) }
                  key={ `tabs-key-${type}` }
                >
                  <a>{name}</a>
                </li>
              )
            }
          )
        }
      </ul>
      {children}
    </div>
  )
}

export default Tabs