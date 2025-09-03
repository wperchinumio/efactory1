import React from 'react'

const TableHead = () => {
  return (
    <div>
      <div className="table-header-1" style={{ paddingRight: '15px' }}>
        <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
          <colgroup>
            <col style={{width: "40px"}}/>
            <col style={{width: "200px"}}/>
            <col style={{width: "70px"}}/>
            <col style={{width: "70px"}}/>
            <col style={{width: "120px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "100px"}}/>
          </colgroup>
          <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th className="padding-5">
                Line #
              </th>
              <th className="padding-5">
                Item #  
              </th>
              <th className="padding-5">
                Open Qty
              </th>
              <th className="padding-5">
                Recv. Qty
              </th>
              <th className="padding-5">
                Lot #
              </th>
              <th className="padding-5">
                Container (B*/P*)
              </th>
              <th className="padding-5">
                Warehouse
              </th>
              <th className="padding-5">
                Loc #
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default React.memo(TableHead)