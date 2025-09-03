import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import config from '../../../util/config'

const PreviewVideoModal = ({
  documentActions,
  watchVideoData: {
    id,
    mime,
    name,
  },
}) => {
  const firstRun = useRef(true)
  const [showVideo, setShowVideo] = useState(false)

  const onModalHidden = useCallback(
    () => {
      setTimeout( () => {
        setShowVideo(false)
        documentActions.setRootStatePropertyDocuments({
          watchVideoData : {
            id : '', // used as source
            name : '',
            mime: ''
          }
        })
        window.afterglow.getPlayer('video-player').pause()
        // Cause issue. Commented
        //window.afterglow.destroyPlayer('video-player')  
      }, 50 )
    },
    []
  )

  useEffect(
    () => {
      global.$("#preview-video").on('hide.bs.modal', onModalHidden )
      return () => {
        global.$("#preview-video").off('hide.bs.modal', onModalHidden )
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (!id) {
        return
      }
      setShowVideo(true)
      initializeVideo()
    },
    [id]
  )

  function initializeVideo () {
    window.afterglow.init()
  }

  function createVideoSourceUrl () {
    return `${config.host}/video/?source=${id}`
  }

  return (

    <div 
      className="modal modal-themed fade" 
      data-backdrop="static"
      id="preview-video" 
      tabIndex="-1" 
      role="dialog" 
      aria-hidden="true"
    >
      <div className="modal-dialog video-modal">
        <div 
          className="modal-content" 
          style={{ background: 'rgb(0, 0, 0)', color: 'white' }}
        >
          <h4 className="video-modal-title" style={{padding: "10px"}}>
            { name }
            <a className="btn btn-circle btn-icon-only dark pull-right" data-dismiss="modal">
                <i className="fa fa-remove"></i>
            </a>
          </h4>
          {
            showVideo &&
            <div className="modal-body">
              <video  
                id='video-player'
                className='afterglow'
                controls
                preload='auto'
                width="960"
                height="540"
                data-autoresize="fit"
                data-skin="dark"
              >
              <source 
                src={ createVideoSourceUrl() }
                type={mime}
              />
              </video>
            </div>
          }

        </div>
      </div>
    </div>
  )
}

PreviewVideoModal.propTypes = {
  watchVideoData: PropTypes.shape({
    id: PropTypes.any,
    mime: PropTypes.any,
    name: PropTypes.any,
  }),
  documentActions: PropTypes.object.isRequired
}

export default PreviewVideoModal