import React from 'react'

const Preview = ({ body }) => {
  return (
    <div>
      <div 
        className="announcement-preview-body"
      >
        {
          body
          ? <div dangerouslySetInnerHTML={{ __html: body }} /> 
          : <div className="empty-preview-message">Choose an article to preview</div>
        }
      </div>
    </div>
  )
}

export default Preview