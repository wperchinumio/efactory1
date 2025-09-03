import superagent             from 'superagent';
import config                 from './config';
import * as es6Promise        from 'es6-promise';
import Interceptors           from './Interceptors';

es6Promise.polyfill();

const methods = ['get', 'post', 'put', 'patch', 'del'];

export default class Request extends Interceptors {

  constructor(){

      super();

      methods.forEach( (method) => {

        this[method] = ( path, data, headers, file ) => {

          return new Promise( ( resolve, reject ) => {

              const url = `${config.host}${path}`;

              const request = superagent[method]( url );

              super.setHeaders( request );

              headers.forEach( header => request.set( header.name, header.value ) );

              if( file ) request.attach( 'file', file );

              request.send( data );

              super.interceptResponse( request, resolve, reject );

          } )

        }

      } )

  }

  fetch( path, { method, data, headers = [], file } ){

      return this[ method ]( path, data, headers );

  }

}
