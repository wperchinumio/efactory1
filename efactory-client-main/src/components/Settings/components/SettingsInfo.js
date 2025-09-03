import React from 'react'

const TableSettingsInfo = () => {
  return (
  	<div className="top-help">
      <p>
      	Move the columns you desire to see from the AVAILABLE FIELDS (right table) to the left table.
      	You can adjust the minimum width (SIZE), provide a different name (ALIAS) and choose a different display position.
      </p>
      <p>
        <strong>Basic</strong> and <strong>All Columns</strong> views cannot be changed.
      </p>
    </div>
  )
}

export default React.memo(TableSettingsInfo)