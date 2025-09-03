import React from 'react'
import PropTypes from 'prop-types'
import keywordsTableConfig from './keywordsTableConfig'

const KeywordsTable = props => {
  let activeTabKeywords = keywordsTableConfig[ props.activeTab ]
  return (
    <div className="table-responsive">
      <table className="rma-type table table-striped table-hover">
        <thead>
          <tr className="uppercase noselect table-header-1 cart-row">
            <th>Keyword</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {
            activeTabKeywords.map( k => {
              let { keyword, desc } = k
              return (
                <tr key={`kywrd-tbl-${keyword}`}>
                  <td className="keyword">
                    { keyword }
                  </td>
                  <td className="desc">
                    { desc }
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

KeywordsTable.propTypes = {
  activeTab: PropTypes.string.isRequired
}

export default KeywordsTable