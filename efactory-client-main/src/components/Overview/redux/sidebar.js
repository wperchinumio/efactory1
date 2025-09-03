// ACTIONS
const

  TYPE_ORDER_NUMBER = 'TYPE_ORDER_NUMBER',


// REDUCER
  initialState = {
    orderNumber : ''
  };

export const reducer = (state = initialState, action) => {

  switch(action.type) {

    case TYPE_ORDER_NUMBER :

      return Object.assign({}, state, {
        orderNumber : action.orderNumber
      });

    default:

      return state;

  }

};

// ACTIONS
export const typeOrderNumber = (orderNumber) => dispatch => dispatch({
  type : TYPE_ORDER_NUMBER,
  orderNumber
});

export default reducer;
