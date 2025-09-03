import React from 'react';

const TableBlockUi = ({ loadingRows }) => <div className="blockUI blockMsg blockElement blockRR"
    style={{display : loadingRows ? "block" : "none"}}
    >
    <div className="loading-message ">
    <div className="block-spinner-bar">
    <div className="bounce1">
        </div>
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    </div>
</div>;

export default TableBlockUi;