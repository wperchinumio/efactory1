import { getAuthData, clearAuthData } from './storageHelperFuncs';
import history from '../history'
import {store} from '../index'
import { showToaster } from '../components/_Helpers/actions'

export default class Interceptors {

  setHeaders(request){

      this._setAccessTokenHeader(request);

      this._setDefaultHeaders(request);

  }

  interceptResponse( request, resolve, reject ){

      request.end( ( error, response ) => {

          if( error ) this._handleError( response, reject );
          
          response = response ? response.body : {}
          
          var underMaintenance = false;
          if ( response && response.internal_version && response.internal_version.endsWith('_M') ) {
            underMaintenance = true;
            response.internal_version = response.internal_version.substring(0, response.internal_version.length - 2);

          }

          if( response && response.internal_version ){
            if( !window.internal_version ){
              window.internal_version = response.internal_version
            } else {
              if( window.internal_version !== response.internal_version || underMaintenance ){
                if (!(underMaintenance && window.location.pathname === '/login')) {
                  window.location.reload()
                }
              }
            }
          }
          
          return resolve( response );

      } )

  }

  _handleError( response, reject ){

      if( !response ) return reject({ error : 'There is an error.' });

      this.showToasterMessage( response )

      if( response.status === 401 ){
          
          if( window.location.href.indexOf('login') === -1 ){
            clearAuthData()
            history.push("/login")
          }

      }

      if( response.status === 409 ){
        return reject({
           ...response.body,
           anotherUserLoggedIn : true
        });  
      }

      return reject( response.body );

  }

  showToasterMessage( response ){
    let { 
      error_message = 'An error occured',
      error_dialog = false
    } = response.body ? response.body : {}
        
    showToaster({
      isSuccess : false,
      message : error_message,
      isNoTimeout : error_dialog ? true : false
    })( store.dispatch, store.getState )
  }

  _setAccessTokenHeader(request){

      let authData = getAuthData();

      if( authData &&  authData.api_token ){

          request.set('X-Access-Token', authData.api_token );

      }

  }

  _setDefaultHeaders(request){

      request.set('Accept', 'application/json');

      request.set('Content-Type', 'application/json');

  }

}
