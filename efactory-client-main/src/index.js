import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
require('es6-object-assign').polyfill()
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import history from './history'
import store from './redux/store'
import { IntercomProvider } from 'react-use-intercom';
import config from './util/config'

export {store}

import App from './App'

// CustomEvent pollyfill for ie
if ( !(typeof window.CustomEvent === "function") ){
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

const renderApplication = () => {
  if( window.doneWithLoadingAllCss ){
    ReactDOM.render(
      <IntercomProvider appId={config.INTERCOM_APP_ID}
      onHide={() => {
        if (document.getElementById('intercom-container')) {
          document.getElementById('intercom-container').style.opacity="0.6";
        }
        //console.log('on Hide')
        if (window.intercomSettings) {
          window.intercomSettings.is_open = false;
        }
      }}
      onShow={() => {
        if (document.getElementById('intercom-container')) {
          document.getElementById('intercom-container').style.opacity="1";
        }
        //console.log('on Show')
        if (window.intercomSettings) {
          window.intercomSettings.is_open = true;
        }
      }}
      >
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>
      </IntercomProvider>,
      document.getElementById('root')
    )
  }else{
    setTimeout(
      () => {
        renderApplication()
      },
      500
    )
  }
}

renderApplication()
