import Fetcher                      from '../../../util/Request'
import { defineAction }             from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }              from '../../_Helpers/actions'
import rmaConfig                    from '../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'
import { getFulfillmentsAsync }     from '../../Overview/redux/fulfillments'
import { 
  setRootReduxStateProp as grid_setRootReduxStateProp 
}                                   from '../../Grid/redux'
const
  namespace = 'RMA/ENTRY',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  READ_RMA_INITIAL_VALUES = defineAction( 'READ_RMA_INITIAL_VALUES', subActions, namespace ),

  /* for normal actions , doesn t include subactions */

  ADD_RMA_DETAIL_ITEM = defineAction( 'ADD_RMA_DETAIL_ITEM', namespace ),
  EDIT_RMA_DETAIL_ITEM_FIELD = defineAction( 'EDIT_RMA_DETAIL_ITEM_FIELD', namespace ),
  INITIALIZE_REDUX_STATE = defineAction( 'INITIALIZE_REDUX_STATE', namespace ),
  SET_SHIPPING_ADDRESS_VALUE = defineAction( 'SET_SHIPPING_ADDRESS_VALUE', namespace ),
  SET_SHIPPING_VALUES = defineAction( 'SET_SHIPPING_VALUES', namespace ),
  SET_EDIT_VALUES = defineAction( 'SET_EDIT_VALUES', namespace ),
  SET_EDIT_VALUES_VALUE = defineAction( 'SET_EDIT_VALUES_VALUE', namespace ),
  SET_OTHERS_VALUES = defineAction( 'SET_OTHERS_VALUES', namespace ),
  SET_RMA_HEADER_VALUE = defineAction( 'SET_RMA_HEADER_VALUE', namespace ),
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),

  /* initial state for this part of the redux state */
  initialState = {
    checkedItems : {
      to_receive : {},
      to_ship : {},
      allChecked : false
    },
    shipping_address : {
      country : 'US'
    },
    rma_detail: {
      to_receive: [],
      to_ship : []
    },
    rmaHeader : {},
    /*
      following shipping, amounts and others objects are for sidebar values
    */
    shipping : {
      fob : '',
      payment_type : ''
    },
    amounts : {
      order_subtotal : '0.00',
      shipping_handling : '0.00',
      sales_tax : '0.00',
      international_handling : '0.00',
      total_due : '0.00',
      amount_paid : '0.00',
      net_due_currency : '0.00',
      balance_due_us : '0.00',
      international_declared_value : '0.00',
      insurance : '0.00'
    },
    others : {
      original_account_number: '',
      original_order_number: '',
      return_weight_lb: 0,
      shipping_instructions: '',
      comments: '',
      customer_number: ''
    },
    /*
      following edit object has edit modals of above objects
      name conventions are important, take a look at setEditValues action creator
      to see why
    */
    edit : {
      editShipping : {},
      editAmounts : {},
      editOthers : {}
    },

    authTotalLines : 0,
    authTotalQty : 0,
    toShipTotalLines : 0,
    toShipTotalQty : 0,
    toShipTotalExtPrice : 0,
    // cart related props
    activeCartButton : '', // 'auth' or 'ship'
    addItemSearchFilterValue : '',
    // entryPageType might be one of
    // 'new_rma' ,'edit_rma', 'edit_draft'
    entryPageType : 'new_rma',

    dirty : false,

    rma_id : 0,

    open : false,
    voided : false,

    newRmaClicked : false,
    // used on the place rma success modal to show number
    createdRmaNumber : '',
    correct_address : {  }
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {
    case ADD_RMA_DETAIL_ITEM:
    case EDIT_RMA_DETAIL_ITEM_FIELD:
    case READ_RMA_INITIAL_VALUES.SUCCESS:
    case SET_SHIPPING_ADDRESS_VALUE:
    case SET_SHIPPING_VALUES:
    case SET_EDIT_VALUES:
    case SET_EDIT_VALUES_VALUE:
    case SET_OTHERS_VALUES:
    case SET_RMA_HEADER_VALUE:
    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return initialState
    default:
      return state

  }

}


/************ ACTIONS ************/

export function generateRmaNumber(){
  return function( dispatch, getState ){
    
    dispatch(showSpinner())

    const fetcher = new Fetcher()
    
    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: "generate_number"
        }
      })
      .then( response => {

        dispatch(hideSpinner())
        
        let { rmaHeader = {} } = getState().returnTrak.entry

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            rmaHeader : {
              ...rmaHeader,
              rma_number : response.data.number
            },
            dirty     : true
          }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function updateCartAsRmaTypeChange({ newRmaType, to_ship = [], to_receive = [] }){
  return function( dispatch, getState ){
    if( !newRmaType ){
      return console.error(`updateCartAsRmaTypeChange expects newRmaType param to be a valid rma_type, received <${newRmaType}>`)
    }

    /*
      below we check if the rma_type set 
      and if set, if auth items need to be copied to ship array 
      if so, should copy to ship
    */
    
    let isToShipButtonBlue = rmaConfig[ newRmaType ][1][1] ? true : false
    let new_to_ship = []
    if( isToShipButtonBlue ){
      let authHashTable = Object.create(null)
      let shipHashTable = Object.create(null)

      to_receive.forEach( 
        item => { 
          if( item.voided ) return 
          authHashTable[ item.item_number ] = item 
        } 
      )
      let maxLineNumber = 0
      to_ship.forEach( 
        (item,i) => { 
          if( +item.line_number > maxLineNumber ) maxLineNumber = +item.line_number
          shipHashTable[ item.item_number ] = item 
        } 
      )
      
      let returnTotalQuantity = (item_number) => {
        return to_receive.filter( 
          i => {
            if( i.item_number !== item_number || i.voided || +i.quantity === 0 ) return false
            return true
          } 
        ).concat( 
          [{quantity:0}] 
        ).reduce( 
          (p,n) => {
            return { 
              quantity : +p.quantity + +n.quantity}
        }, {quantity : 0} )['quantity']
      }
      Object.keys( authHashTable ).forEach( ( item_number, index ) => {
        if( !shipHashTable[ item_number ] ){
          maxLineNumber += 1
          let { description } = authHashTable[ item_number ]
          new_to_ship = [
            ...new_to_ship,
            {
              detail_id: 0,  // or 0 if new line
              line_number: maxLineNumber,
              item_number,
              description,
              quantity : returnTotalQuantity(item_number),
              unit_price: '0.00',
              voided: false
            }
          ]
        }else{
          new_to_ship = [
            ...new_to_ship,
            {
              ...shipHashTable[ item_number ],
              quantity : returnTotalQuantity(item_number),
            }
          ]
        }

      } )
    }else{
      new_to_ship = to_ship.filter( item => item.voided )
    }

    dispatch({ type : SET_ROOT_REDUX_STATE, data : { rma_detail : {
      to_ship : new_to_ship, to_receive
    }  } })
  }
}

export function createRmaFromOrder({ account_number, order_number }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read_from_order',
          order_number,
          account_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let { rma_header, to_receive, to_ship } = response.data

        /*
          below we check if the rma_type set 
          and if set, if auth items need to be copied to ship array 
          if so, should copy to ship
        */
        if( rma_header.rma_type_code ){
          let { rma_type } = rma_header
          let isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
          if( isToShipButtonBlue ){
            let authHashTable = Object.create(null)
            let shipHashTable = Object.create(null)

            to_receive.forEach( 
              (item,i) => { authHashTable[ item.item_number ] = item } 
            )
            let maxLineNumber = 0
            to_ship.forEach( 
              (item,i) => { 
                if( +item.line_number > maxLineNumber ) maxLineNumber = +item.line_number
                shipHashTable[ item.item_number ] = item 
              } 
            )
            to_receive.forEach( ( item, index ) => {
              if( !shipHashTable[ item.item_number ] ){
                maxLineNumber += 1
                let {
                  item_number,
                  description
                } = item
                to_ship = [
                  ...to_ship,
                  {
                    detail_id: 0,  // or 0 if new line
                    line_number: maxLineNumber,
                    item_number,
                    description,
                    quantity : to_receive.filter( 
                        i => {
                          if( i.item_number !== item_number || i.voided || +i.quantity === 0 ) return false
                          return true
                        } 
                      ).concat( 
                        [{quantity:0}] 
                      ).reduce( 
                        (p,n) => {
                          return { 
                            quantity : +p.quantity + +n.quantity}
                      }, {quantity : 0} )['quantity'],
                    unit_price: '0.00',
                    voided: false
                  }
                ]
              }

            } )
          }
        }
        


        let {
          rma_id,
          open,
          rma_number,
          original_account_number,
          original_order_number,
          account_number,
          location,
          shipping_account_number,
          shipping_warehouse,

          shipping_address,

          customer_number,
          freight_account,
          consignee_number,
          comments,
          //rma_type_name, @todo should change the logic on rma_header part to use this
          // disposition_name, @todo should change the logic on rma_header part to use this
          rma_type_code,
          disposition_code,
          cf1,
          cf2,
          cf3,
          cf4,
          cf5,
          cf6,
          cf7,
          international_code,
          order_subtotal,
          shipping_handling,
          sales_tax,
          international_handling,
          total_due,
          amount_paid,
          net_due_currency,
          balance_due_us,
          international_declared_value,
          insurance,
          return_weight_lb,
          shipping_carrier,
          shipping_service,
          shipping_instructions,
          payment_type,
          terms,
          fob,
          packing_list_type,
          voided,
        } = rma_header

        let accountShippingWarehouse = '', accountReceivingWarehouse = ''

        if( shipping_warehouse && shipping_account_number ){
          accountShippingWarehouse = `${shipping_account_number}.${shipping_warehouse}`
        }
        if( location && account_number ){
          accountReceivingWarehouse = `${account_number}.${location}`
        }


        /* rmaHeader STARTS */
        let rmaHeader = {
          rma_number,
          rma_type : rma_type_code,
          accountShippingWarehouse,
          accountReceivingWarehouse,
          disposition : disposition_code,
          option1 : cf1,
          option2 : cf2,
          option3 : cf3,
          option4 : cf4,
          option5 : cf5,
          option6 : cf6,
          option7 : cf7
        }
        /* rmaHeader ENDS */



        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            activeCartButton : rmaHeader.rma_type ? 'auth' : '',
            rma_id,
            rmaHeader,
            shipping_address,
            shipping : {
              shipping_carrier,
              shipping_service,
              packing_list_type,
              freight_account,
              consignee_number,
              int_code : international_code,
              terms,
              fob,
              payment_type
            },
            amounts : {
              order_subtotal : order_subtotal ? (+order_subtotal).toFixed(2) : '0.00',
              shipping_handling : shipping_handling ? (+shipping_handling).toFixed(2) : '0.00',
              balance_due_us : balance_due_us ? (+balance_due_us).toFixed(2) : '0.00',
              amount_paid : amount_paid ? (+amount_paid).toFixed(2) : '0.00',
              total_due : total_due ? (+total_due).toFixed(2) : '0.00',
              net_due_currency : net_due_currency ? (+net_due_currency).toFixed(2) : '0.00',
              international_handling : international_handling ? (+international_handling).toFixed(2) : '0.00',
              international_declared_value : international_declared_value ? (+international_declared_value).toFixed(2) : '0.00',
              sales_tax : sales_tax ? (+sales_tax).toFixed(2) : '0.00',
              insurance : insurance ? (+insurance).toFixed(2) : '0.00'
            },
            others : {
              original_order_number,
              original_account_number,
              customer_number,
              shipping_instructions,
              comments,
              return_weight_lb
            },
            rma_detail : {
              to_receive,
              to_ship
            },
            open,
            voided,
            entryPageType : 'new_rma',
            dirty : true
          }
        })

        return Promise.resolve({ isSuccess : true })

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.resolve({ isSuccess : false })
      })
  }
}


export function readEntry({ rma_id }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read',
          rma_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let { rma_header, to_receive, to_ship } = response.data

        let {
          rma_id,
          is_draft,
          open,
          rma_number,
          original_account_number,
          original_order_number,
          account_number,
          location,
          shipping_account_number,
          shipping_warehouse,

          shipping_address,

          customer_number,
          freight_account,
          consignee_number,
          comments,
          //rma_type_name, @todo should change the logic on rma_header part to use this
          // disposition_name, @todo should change the logic on rma_header part to use this
          rma_type_code,
          disposition_code,
          cf1,
          cf2,
          cf3,
          cf4,
          cf5,
          cf6,
          cf7,
          international_code,
          order_subtotal,
          shipping_handling,
          sales_tax,
          international_handling,
          total_due,
          amount_paid,
          net_due_currency,
          balance_due_us,
          international_declared_value,
          insurance,
          return_weight_lb,
          shipping_carrier,
          shipping_service,
          shipping_instructions,
          payment_type,
          terms,
          fob,
          packing_list_type,
          voided,
        } = rma_header

        let accountShippingWarehouse = '', accountReceivingWarehouse = ''

        if( shipping_warehouse && shipping_account_number ){
          accountShippingWarehouse = `${shipping_account_number}.${shipping_warehouse}`
        }
        if( location && account_number ){
          accountReceivingWarehouse = `${account_number}.${location}`
        }


        /* rmaHeader STARTS */
        let rmaHeader = {
          rma_number,
          rma_type : rma_type_code,
          accountShippingWarehouse,
          accountReceivingWarehouse,
          disposition : disposition_code,
          option1 : cf1,
          option2 : cf2,
          option3 : cf3,
          option4 : cf4,
          option5 : cf5,
          option6 : cf6,
          option7 : cf7
        }
        /* rmaHeader ENDS */



        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            activeCartButton : rmaHeader.rma_type ? 'auth' : '',
            entryPageType : is_draft ? 'edit_draft' : 'edit_rma',
            rma_id,
            rmaHeader,
            shipping_address,
            shipping : {
              shipping_carrier,
              shipping_service,
              packing_list_type,
              freight_account,
              consignee_number,
              int_code : international_code,
              terms,
              fob,
              payment_type
            },
            amounts : {
              order_subtotal : order_subtotal ? (+order_subtotal).toFixed(2) : '0.00',
              shipping_handling : shipping_handling ? (+shipping_handling).toFixed(2) : '0.00',
              balance_due_us : balance_due_us ? (+balance_due_us).toFixed(2) : '0.00',
              amount_paid : amount_paid ? (+amount_paid).toFixed(2) : '0.00',
              total_due : total_due ? (+total_due).toFixed(2) : '0.00',
              net_due_currency : net_due_currency ? (+net_due_currency).toFixed(2) : '0.00',
              international_handling : international_handling ? (+international_handling).toFixed(2) : '0.00',
              international_declared_value : international_declared_value ? (+international_declared_value).toFixed(2) : '0.00',
              sales_tax : sales_tax ? (+sales_tax).toFixed(2) : '0.00',
              insurance : insurance ? (+insurance).toFixed(2) : '0.00'
            },
            others : {
              original_order_number,
              original_account_number,
              customer_number,
              shipping_instructions,
              comments,
              return_weight_lb
            },
            rma_detail : {
              to_receive,
              to_ship
            },
            open,
            voided
          }
        })

        return Promise.resolve({ response, getState })

      })
      .catch( error => {

        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function saveEntry({ is_draft }){ // @@todo
  return function( dispatch, getState ){

    if( is_draft === undefined ) return console.error('is_draft is required to save entry')

    dispatch(showSpinner())

    let { entry, settings } = getState().returnTrak
    let {
      amounts,
      shipping_address,
      rma_detail,
      rmaHeader,
      rma_id,
      shipping,
      others,

      open,
      voided
    } = entry

    let { rmaSettingsData } = settings
    let { to_receive = [], to_ship = [] } = rma_detail

    let {
      rma_number = '',
      rma_type,
      accountShippingWarehouse = '',
      accountReceivingWarehouse = '',
      disposition = ''
      // remember other option values are written below
    } = rmaHeader

    let
      account_number = '',
      location = '',
      shipping_account_number = '',
      shipping_warehouse = ''

    if( accountShippingWarehouse ){
      shipping_warehouse = accountShippingWarehouse.replace(/[0-9]+\./,'')
      shipping_account_number = accountShippingWarehouse.replace(/\.[a-zA-Z]+/,'')
    }
    if( accountReceivingWarehouse ){
      location = accountReceivingWarehouse.replace(/[0-9]+\./,'')
      account_number = accountReceivingWarehouse.replace(/\.[a-zA-Z]+/,'')
    }

    let {
      shipping_carrier = '',
      shipping_service = '',
      packing_list_type = '',
      freight_account = '',
      consignee_number = '',
      int_code = '',
      terms = '',
      fob = '',
      payment_type = ''
    } = shipping

    const fetcher = new Fetcher()
    
    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'save',
          data : {
            rma_header : {

              is_draft,

              /* rma header related fields STARTS */
              cf1: rmaHeader['option1'] || '',
              cf2: rmaHeader['option2'] || '',
              cf3: rmaHeader['option3'] || '',
              cf4: rmaHeader['option4'] || '',
              cf5: rmaHeader['option5'] || '',
              cf6: rmaHeader['option6'] || '',
              cf7: rmaHeader['option7'] || '',
              disposition_code: disposition,
              disposition_name: disposition ? rmaSettingsData['dispositions'].filter( r => r.code === disposition )[0]['title'] : '',
              rma_number,
              rma_id, // @todo
              rma_type_code: rma_type,
              rma_type_name: rma_type ? rmaSettingsData['rma_types'].filter( r => r.code === rma_type )[0]['title'] : '',

              account_number : account_number ? account_number : '',
              location : location ? location : '',

              shipping_account_number : shipping_account_number ? shipping_account_number : '',
              shipping_warehouse : shipping_warehouse ? shipping_warehouse : '',

              /* rma header related fields ENDS */


              /* shipping address fields STARTS */
              shipping_address,
              /* shipping address fields ENDS */


              /* shipping fields STARTS */
              shipping_carrier,
              shipping_service,
              packing_list_type,
              freight_account,
              consignee_number,
              international_code: int_code,
              terms,
              fob,
              payment_type,
              /* shipping fields ENDS */


              /* amounts fields STARTS */
              ...amounts,
              /* amounts fields ENDS */


              /* others fields STARTS */
              ...others,
              /* others fields ENDS */

              voided,
              open
            },

            to_receive, /// @remember
            to_ship
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())
        if( is_draft && +rma_id < 1 ){

          grid_setRootReduxStateProp( 'badgeCounterValues', {
            ...getState().grid.badgeCounterValues,
            '/returntrak/drafts' : response.data.total_drafts
          } )( dispatch, getState )

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              entryPageType : 'edit_draft',
              dirty: false,
              rma_id: response.data.draft_rma.rma_header.rma_id,
              rma_detail: {
                to_receive: response.data.draft_rma.to_receive,
                to_ship: response.data.draft_rma.to_ship,
              }
            }
          })
        }

        if( is_draft && +rma_id > 0 ){
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              entryPageType : 'edit_draft',
              dirty: false,
              rma_id: response.data.rma_header.rma_id,
              rma_detail: {
                to_receive: response.data.to_receive,
                to_ship: response.data.to_ship,
              }
            }
          })
        }

        showToaster({
          isSuccess : true,
          message : is_draft ? `${ +rma_id > 0 ? 'Updated' : 'Created' } draft successfully!` : 'Placed rma successfully!'
        })( dispatch, getState )

        if( !is_draft ){

          createNewRma()( dispatch, getState )
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : { createdRmaNumber : response.data.rma_number }
          })
          getFulfillmentsAsync(true)( dispatch, getState )
          global.$('#rma-success-modal').modal('show')

          grid_setRootReduxStateProp( 'badgeCounterValues', {
            ...getState().grid.badgeCounterValues,
            '/returntrak/drafts' : response.data.total_drafts
          } )( dispatch, getState )
        }
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())

        return Promise.reject()
      })
  }
}



/*
  adds item to rma_detail

  if item doesn t already exist
  or exist but has voided field true
  it adds item to the end of the array
*/
export function addRmaDetailItem({
  fieldType = '', // one of 'to_ship' or 'to_receive'
  itemObject = {}
}){
  return function( dispatch, getState ){
    if( !fieldType ) return console.error('fieldType required for addRmaDetailItem')

    let { rma_detail } = getState().returnTrak.entry

    let arrayToAddItem = rma_detail[ fieldType ]
    let matchedItems = arrayToAddItem.filter(
      item => item.item_number === itemObject.item_number && !item.serialnumber
    )

    // if item already exists
    if( matchedItems.length === 1 && ( fieldType === 'to_receive' ? !matchedItems[0].serialnumber : true ) ) {

      return Promise.resolve({
        item_number: matchedItems[0].item_number,
        line_number : matchedItems[0].line_number
      })
    }

    if( fieldType === 'to_ship' ){
      let maxLineNumber = 0
      arrayToAddItem.forEach(
        item => { maxLineNumber = item.line_number > maxLineNumber ?
               item.line_number : maxLineNumber
             }
      )
      itemObject = {
        detail_id: 0,  // or 0 if new line
        line_number: +maxLineNumber + 1,
        quantity: 1,
        unit_price: '0.00',/*
        do_not_ship_before : moment().format('YYYY-MM-DD'), //today
        ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
        comments: '',
        custom_field1: '',
        custom_field2: '',
        custom_field5: '',*/
        voided: false,
        ...itemObject
      }
    }else{
      let maxLineNumber = 0
      arrayToAddItem.forEach(
        item => { maxLineNumber = item.line_number > maxLineNumber ?
               item.line_number : maxLineNumber
             }
      )
      itemObject = {
        detail_id: 0,  // or 0 if new line
        line_number: +maxLineNumber + 1,
        quantity: 1,
        serialnumber: '',
        voided: false,
        //received_quantity: 0,
        //received_serial_number: 0,
        // @todo what to assign for received_date
        //received_date : moment().format('YYYY-MM-DD'), //today
        ...itemObject
      }
    }
    dispatch({
      type: ADD_RMA_DETAIL_ITEM,
      data : {
        rma_detail : {
          ...rma_detail,
          [ fieldType ] : [
            ...rma_detail[ fieldType ],
            { ...itemObject }
          ]
        }
      }
    })
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { dirty     : true }
    })
    
    return Promise.resolve({
      item_number : itemObject.item_number,
      line_number : itemObject.line_number
    })
  }
}

export function editRmaDetailItemField({
  fieldType,
  indexOfFieldsObject : fieldIndex,
  fieldName,
  value
}){
  return function( dispatch, getState ){

    let { rma_detail } = getState().returnTrak.entry
    fieldIndex = +fieldIndex
    if( fieldName === 'unit_price' ) value = ( +value ).toFixed(2)
    dispatch({
      type: EDIT_RMA_DETAIL_ITEM_FIELD,
      data : {
        rma_detail : {
          ...rma_detail,
          [ fieldType ] : [
            ...rma_detail[ fieldType ].slice(0, fieldIndex ),
            {
              ...rma_detail[ fieldType ][fieldIndex],
              [ fieldName ] : value
            },
            ...rma_detail[ fieldType ].slice( fieldIndex + 1 )
          ]
        }
      }
    })
  }
}

/*
  this action creator updates a root property,
  rather than creating seperate action creators
  simple changes might be done via this method
*/
export function setRootReduxStateProp({ field, value }){
  return function( dispatch, getState ){
    dispatch({ type: SET_ROOT_REDUX_STATE, data : { [ field ] : value } })
    return Promise.resolve()
  }
}


/*
  This method gets called everytime the edit modals opens on entry page
  we copy sidebar values to state.returnTrak.entry.edit[ arg ]
  so that the modal form fields gets filled with this data
*/

export function setEditValues( fieldOfEdit = '' ){
  return function( dispatch, getState ){

    if( ![ 'editShipping', 'editAmounts', 'editOthers'].includes(fieldOfEdit) ){
      return console.error( `setEditValues action creator expects first param to be one of `+
                            `< editShipping, editAmounts, editOthers> but received <${fieldOfEdit}>`)
    }

    /*
      since we will copy sidebar values to edit[ ?editShipping, ?editAmounts, ?editOthers ]
      we will get the word after edit and lowercase it
    */

    let sidebarValueToCopyFieldName = fieldOfEdit.replace(/edit/,'').toLowerCase()

    let { entry } = getState().returnTrak

    let sidebarValueToCopy = entry[ sidebarValueToCopyFieldName ]

    let { edit } = entry

    dispatch({
      type: SET_EDIT_VALUES,
      data : { edit : {
        ...edit,
        [ fieldOfEdit ] : sidebarValueToCopy
      } }
    })
  }
}
/*  */
export function setEditValuesValue( fieldOfEdit = '' ,{ field, value }){
  return function( dispatch, getState ){

    if( ![ 'editShipping', 'editAmounts', 'editOthers'].includes(fieldOfEdit) ){
      return console.error( `setEditValues action creator expects first param to be one of `+
                            `< editShipping, editAmounts, editOthers> but received <${fieldOfEdit}>`)
    }

    /*
      since we will copy sidebar values to edit[ ?editShipping, ?editAmounts, ?editOthers ]
      we will get the word after edit and lowercase it
    */

    let { entry } = getState().returnTrak

    let { edit } = entry

    dispatch({
      type: SET_EDIT_VALUES_VALUE,
      data : {
        edit : {
          ...edit,
          [ fieldOfEdit ] : {
            ...edit[ fieldOfEdit ],
            [ field ] : value
          }
        } }
    })

    return Promise.resolve()
  }
}


/*
  method used in shipping sidebar of returntrak entry

  as the country changes we fill shipping with domestic
  or international values of shipping
*/
export function setShippingValues( receivedShippingValues = {}, merge = true ){
  return function( dispatch, getState ){

    let updatedShipping = { ...receivedShippingValues }

    if( merge ){
      let { shipping } = getState().returnTrak.entry
      updatedShipping = {
        ...shipping,
        ...updatedShipping
      }
    }

    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { shipping : updatedShipping }
    })
  }
}

export function setOthersValues( receivedOthersValues = {} ){
  return function( dispatch, getState ){

    dispatch({
      type: SET_OTHERS_VALUES,
      data : { others : receivedOthersValues }
    })
  }
}

export function setOthersValue({ field, value }){
  return function( dispatch, getState ){

    let { others } = getState().returnTrak.entry

    dispatch({
      type: SET_SHIPPING_ADDRESS_VALUE,
      data : {
        others : {
          ...others,
          [ field ] : value
        } }
    })
  }
}

export function setShippingAddressValue({ field, value }){
  return function( dispatch, getState ){

    let { shipping_address } = getState().returnTrak.entry

    dispatch({
      type: SET_SHIPPING_ADDRESS_VALUE,
      data : {
        shipping_address : {
          ...shipping_address,
          [ field ] : value
        } }
    })
  }
}

export function setRmaHeaderValue({ field, value }){
  return function( dispatch, getState ){

    let { rmaHeader } = getState().returnTrak.entry

    dispatch({
      type: SET_RMA_HEADER_VALUE,
      data : {
        rmaHeader : {
          ...rmaHeader,
          [ field ] : value
        } }
    })
  }
}

export function createNewRma(){
  return function( dispatch, getState ){
    initializeReduxState()(dispatch, getState)
    setRootReduxStateProp({
      field : 'newRmaClicked',
      value : false
    })(dispatch, getState)
    setTimeout( () => {
      setRootReduxStateProp({
        field : 'newRmaClicked',
        value : true
      })(dispatch, getState)
    }, 0 )
  }
}

export function initializeReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
  }
}
