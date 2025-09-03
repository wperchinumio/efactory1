import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import TableConfig from './TableConfig'

const TemplateTableRow = ({
  active,
	name,
  onRowClicked,
	rma_type,
  templates: {
    issue: { active: issueActive },
    receive: { active: receiveActive },
    ship: { active: shipActive },
    cancel: { active: cancelActive },
  },
	show
}) => {
	return (
		<tr
      className={
        classNames({
        'clickable-row': true,
        'active': active
      })}
      onClick={ event => onRowClicked(rma_type) }
    >
      <td
      	className={ classNames({
      		'font-grey-salsa': !show,
      		'title': true
      	}) }
      >
      	<span className="rma">
      		{ rma_type }
      	</span>
      	: { name }
      </td>
      <td className="counter">
        <i className={ classNames({
        	'fa': true,
        	'fa-circle': issueActive,
          'fa-circle-o': !issueActive,
          'font-grey': !TableConfig[ rma_type ][0][0]
        }) }/>
        { ' ' }
        <i className={ classNames({
          'fa': true,
          'fa-circle': receiveActive,
          'fa-circle-o': !receiveActive,
          'font-grey': !TableConfig[ rma_type ][0][1]
        }) }/>
        { ' ' }
        <i className={ classNames({
          'fa': true,
          'fa-circle': shipActive,
          'fa-circle-o': !shipActive,
          'font-grey': !TableConfig[ rma_type ][0][2]
        }) }/>
        { ' ' }
        <i className={ classNames({
          'fa': true,
          'fa-circle': cancelActive,
          'fa-circle-o': !cancelActive,
          'font-grey': !TableConfig[ rma_type ][0][3]
        }) }/>
      </td>
      <td className="in-out">
      	<i
      		className={ classNames({
      			'fa fa-arrow-down': true,
      			'font-red-soft': TableConfig[ rma_type ][1][0],
      			'font-grey': !TableConfig[ rma_type ][1][0]
      		}) }
      	/>
        { ' ' }
      	<i
      		className={ classNames({
      			'fa fa-arrow-up': true,
      			'font-blue-soft': TableConfig[ rma_type ][1][1],
      			'font-grey': !TableConfig[ rma_type ][1][1]
      		}) }
      	/>
      </td>
    </tr>
	)
}

TemplateTableRow.propTypes = {
	name: PropTypes.string.isRequired,
	rma_type: PropTypes.string.isRequired,
  templates: PropTypes.shape({
    issue: PropTypes.shape({
      active: PropTypes.bool.isRequired
    }),
    receive: PropTypes.shape({
      active: PropTypes.bool.isRequired
    }),
    ship: PropTypes.shape({
      active: PropTypes.bool.isRequired
    }),
    cancel: PropTypes.shape({
      active: PropTypes.bool.isRequired
    })
  }),
  show: PropTypes.bool.isRequired
}

export default TemplateTableRow