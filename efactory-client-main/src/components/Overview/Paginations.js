import React from 'react'

const Paginations = ({
  activePagination,
  numberOfPaginations,
  paginateToDirection,
  setActivePagination
}) => {
  let getPaginationComponents = () => {
    let paginationComponents = []
    let leftArrow = (
      <li 
        key="random1"
        className={activePagination === 1 ? "disabled" : ""}
        onClick={
          event => {
            event.preventDefault()
            if (activePagination !== 1) {
                paginateToDirection("left")
            }
          }
        }
      >
        <a href="#">
          <i className="fa fa-angle-left"/>
        </a>
      </li>
    )
    let rightArrow = (
      <li
        key="random2"
        className={activePagination === numberOfPaginations ? "disabled" : ""}
        onClick={
          event => {
            event.preventDefault()
            if (activePagination !== numberOfPaginations) {
              paginateToDirection("right")
            }
          }
        }
      >
        <a href="#">
          <i className="fa fa-angle-right"/>
        </a>
      </li>
    )
    paginationComponents = [leftArrow]
    for (let i = 0; i < numberOfPaginations; i++) {
      paginationComponents.push(
        <li 
          key={i}
          className={activePagination === (i+1) ? "active" : ""}
          onClick={
            event => {
              event.preventDefault()
              setActivePagination(i+1)
            }
          }
        >
          <a href="#" className="ng-binding">
            {i+1}
          </a>
        </li>
      )
    }
    paginationComponents.push(rightArrow)
    return paginationComponents
  }

  return (
    <ul className="pagination pagination-circle">
      { numberOfPaginations > 0 && getPaginationComponents()}
    </ul>
  )
}

export default Paginations