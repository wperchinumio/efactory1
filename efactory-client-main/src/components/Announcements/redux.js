import Fetcher                          from '../../util/Request'
import {
  showToaster,
  showSpinner,
  hideSpinner
}                                        from '../_Helpers/actions'
import { setBadgeCounterValues }         from '../Grid/redux'

const
  namespace = 'announcements',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `${namespace}/SET_ROOT_REDUX_STATE__`,
  INITIALIZE_REDUX_STATE  = `${namespace}/INITIALIZE_REDUX_STATE__`,

  /* initial state for this part of the redux state */
  initialState = {
    groups : [],
    articles : [],
    active_group_id : 0,
    active_group_name : 'All',
    open_thread_id : ''
  }

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- REDUCER ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return {
        ...initialState,
        //badgeCounterValues : state.badgeCounterValues
      }
    default:
      return state

  }

}


/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ACTIONS ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

/*
  this is a common purpose action creator which updates this part
  of the redux state tree, rather than creating different action
  creators, this one might be used to change a single property
  of this part of the redux tree
*/
export function setRootReduxStateProp( field, value ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { [ field ] : value }
    })
    return Promise.resolve()
  }
}

export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

export function initializeReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

export function toggleToasterVisibility( show = true ){
  return function( dispatch, getState ){
    dispatch( show ? showSpinner() : hideSpinner() )
  }
}

export function showErrorToaster( error_message ){
  return function( dispatch, getState ){
    showToaster({
      isSuccess : false,
      message : error_message
    })( dispatch, getState )
  }
}

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */



/*==============================================
=                   SECTION                    =
==============================================*/



export function listArticles({ isInitialRequest } = {}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          action    : 'list',
          resource  : 'articles'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let {
          groups = [],
          articles = []
        } = response.data || {}

        let all = groups.reduce( 
          ( prev, next ) => {
            return {
              unread_count : prev[ 'unread_count' ] + next[ 'unread_count' ],
              total_articles : prev[ 'total_articles' ] + next[ 'total_articles' ],
            }
          },
          { unread_count : 0, total_articles : 0 }
        )

        groups = [
          {
            id : 0,
            name : 'All',
            ...all
          },
          ...groups
        ]

        dispatch({
          type: SET_ROOT_REDUX_STATE,
          data : {
            groups,
            articles
          }
        })

        if( isInitialRequest ){
          let unReadIndex = articles.findIndex( ({ is_read }) => !is_read )
          if( unReadIndex !== -1 ){
            let unReadItem = articles[ unReadIndex ]
            let {
              id
            } = unReadItem || {}
            if( id ){
              fetchArticlePreviewData( id, unReadIndex )( dispatch, getState )
            }else{
              console.warn(`id is required for an article, instead got ${id}`)
            }
          }
        }

        return Promise.resolve()

      })
      .catch( error => {
        
        dispatch(hideSpinner())
        
        return Promise.resolve()
      })
  }
}

export function fetchArticlePreviewData( id, index ){
  return function ( dispatch, getState ){
    
    dispatch(showSpinner())

    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        preview_data : {
          index
        },
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'preview_client',
          id
        }
      })
      .then(
        response => {

          dispatch(hideSpinner())

          let { articles } = getState().announcements

          let {
            attachments = [],
            body = '',
            groups = [],
            is_read = false,
            title = ''
          } = response.data

          articles = articles.map( 
            article => {
              if( +article.id === +id ){
                return {
                  ...article,
                  is_read
                }
              }
              return article
            }
          )

          let all = groups.reduce( 
            ( prev, next ) => {
              return {
                unread_count : prev[ 'unread_count' ] + next[ 'unread_count' ],
                total_articles : prev[ 'total_articles' ] + next[ 'total_articles' ],
              }
            },
            { unread_count : 0, total_articles : 0 }
          )

          groups = [
            {
              id : 0,
              name : 'All',
              ...all
            },
            ...groups
          ]

          let newBadgeValue = all[ 'unread_count' ]

          setBadgeCounterValues({
            '/announcements' : newBadgeValue
          })(dispatch, getState)
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              preview_data : {
                attachments,
                body,
                groups,
                is_read,
                title,
                index
              },
              groups,
              articles,
              loading : false,
              open_thread_id : id
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {

          dispatch(hideSpinner())

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

/*=====  End of FILTER RELATED ACTIONS  ======*/
			
    