const env = process.env.NODE_ENV;

export const config = {

  env,

  // Local server
  //host : process.env.host || (location.href.includes('edemo') || location.href.includes('localhost')? decodeURIComponent(atob('aHR0cDovL2xvY2FsaG9zdDo4MDgx').split('').map(function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')): ''),

  // Production
  host: process.env.host || (location.href.includes('edemo') || location.href.includes('localhost') || location.href.includes('10.0.2.2') ? decodeURIComponent(atob('aHR0cHM6Ly9lZGVtb2FwaS5kY2xjb3JwLmNvbQ==').split('').map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')) : ''),

  mockApi: env === 'demo' || localStorage.getItem('mock') === 'true',

  loggerActive: true,

  INTERCOM_APP_ID: 'ab0nxah2',

  GOOGLE_ANALYTICS_ID: 'G-JFR17E5R3S', // (Walter's test: 'G-4FJKSCZB4P')

};

export default config;





