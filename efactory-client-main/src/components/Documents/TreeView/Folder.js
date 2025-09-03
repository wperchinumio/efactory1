import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Folder = ({
  empty: emptyReceived,
  open = false,
  selected = false,
  name = 'Folder',
  handleClick,
  loading = false,
  disabled,
}) => {
  const empty = loading ? true : emptyReceived
  return (
    <div
      className={ classNames({
        'folder-wrapper noselect' : true,
        'empty' : empty,
        'selected' : selected,
        'loading' : loading,
        'disabled' : disabled
      }) }
      onClick={ event => { if( !empty || !disabled ) handleClick() } }
    >
      { !empty && <i className={`fa fa-${open ? 'minus' : 'plus'}`} aria-hidden="true"></i> }
      { !empty && <i className={`fa fa-folder${open ? '-open' : ''}`} aria-hidden="true"></i> }
      { !empty && <a>{ name }</a> }
      { loading && <img src="/src/styles/img/global/loading-light.gif" alt="loading gif"/> }
      { empty && !loading && 'no subfolders' }
    </div>
  )
}

Folder.propTypes = {
  empty: PropTypes.bool,
  open: PropTypes.bool,
  selected: PropTypes.bool,
  loading: PropTypes.bool,
  name: PropTypes.string
}

export default Folder