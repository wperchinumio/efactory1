import React from 'react'

const OrderStage = props => {
  function stageClass (stage) {
    stage = parseInt(stage,10)
    let className = 'progress-bar '
    if (stage === 2) {
      className += "dark"
    }
    else if (stage > 2 && stage < 10) {
      className += "red-thunderbird"
    }
    else if (stage === 10) {
      className += "red"
    }
    else if (stage === 20) {
      className += "yellow-gold"
    }
    else if (stage === 40) {
      className += "yellow-haze"
    }
    else if (stage > 40 && stage < 60) {
      className += "yellow-mint"
    }
    else if (stage >= 60) {
      className += "green-soft"
    }
    else className += "yellow-gold"

    return className
  }

  return (
    <div>
      {props.order_stage &&
        <div className="order-stage-outer">
          <div className="order-stage-inner">
            {props.order_stage}
            <span className="order-stage-inner-text">
          <small>{props.stage_description}</small>
        </span>
          </div>
          <div className="progress" style={{margin:"0"}}>
            <div  className={stageClass(props.order_stage)}
                  role="progressbar"
                  aria-valuenow={props.order_stage}
                  aria-valuemin="0"
                  aria-valuemax="62"
                  style={
                  {'width': ((props.order_stage >= 60? 62: props.order_stage) / 62 * 100) + '%'}
                  }
            >
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default OrderStage