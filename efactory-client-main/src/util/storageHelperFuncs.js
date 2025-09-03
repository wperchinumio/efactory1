import moment              from 'moment'

import Fetcher             from './Request'


const getAuthData =  () => {
  return JSON.parse(localStorage.getItem("authToken"));
}
const setAuthData = (authData) => {

  // Add calculated properties
  authData.user_data.calc_accounts = [];
  authData.user_data.calc_locations = [];
  authData.user_data.calc_account_regions = {};

  Object.keys(authData.user_data.warehouses).forEach( regionKey => {
    let branches = authData.user_data.warehouses[regionKey];
    authData.user_data.calc_locations.push(regionKey);

    branches.forEach(function (branchObj) {
      Object.keys(branchObj).forEach( BranchElem => {
        branchObj[BranchElem].forEach(function (account) {
          let key = account + '.' + regionKey;
          let value = account + ' - ' + regionKey;
          if (!authData.user_data.calc_account_regions[key]) {
            authData.user_data.calc_account_regions[key] = value;
          }
        })
        authData.user_data.calc_accounts = [
          ...authData.user_data.calc_accounts,
          ...branchObj[BranchElem]
        ]
      })
    });
  })
  let tempSet = new Set([])
  authData.user_data.calc_accounts = authData.user_data.calc_accounts.filter( acc => {
    if( !tempSet.has(acc)  ){
      tempSet.add(acc)
      return true
    }
    return false
  } )
  // ------------------------------

  localStorage.setItem("authToken", JSON.stringify(authData));
  let appdata = {
    pl_domestic : authData.user_data.pl_domestic || {},
    pl_international : authData.user_data.pl_domestic || {}

  }
  localStorage.setItem('appdata', JSON.stringify(appdata))
}
const clearAuthData =  () => {
  const fetcher = new Fetcher()
  fetcher
  .fetch('/api/authentication', {
    method : 'post',
    data : { func: 'logout' }
  })
  .catch( error => {
    console.error(error)
  } )
  localStorage.removeItem("authToken");
  localStorage.removeItem('appdata')
}
const getMultiSelection = () => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings"));
  // if no uiMultiSelection already exists, it is *false*
  let { uiMultiSelection = true } = uiSettings || {};
  return uiMultiSelection;
}
const setMultiSelection = ( value = false ) => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings")) || {};
  uiSettings.uiMultiSelection = value;
  localStorage.setItem('uiSettings', JSON.stringify(uiSettings))
}
const getThemeData = () => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings"));
  return uiSettings ? uiSettings.theme : uiSettings
}
const setThemeData = ( themeData = '' ) => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings")) || {};
  uiSettings.theme = themeData;
  localStorage.setItem('uiSettings', JSON.stringify(uiSettings))
}
const getLayoutData = () => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings"));
  return uiSettings ? uiSettings.layout : uiSettings
}
const setLayoutData = ( layoutData = '' ) => {
  let uiSettings = JSON.parse(localStorage.getItem("uiSettings"))  || {};
  uiSettings.layout = layoutData;
  localStorage.setItem('uiSettings', JSON.stringify(uiSettings));
}
const getUserData = (name) => {
  let data = getAuthData(), nameData
  if (data && typeof data.user_data !== 'undefined')
    nameData = (data && typeof data === 'object' && typeof data.user_data[name] !== 'undefined') ? data.user_data[name] : ''
  else{
    nameData = name === 'name' ? "" : []
  }
  return nameData
}
const setUserData = ( name, new_value ) => {
  let data = getAuthData()
  if (data && typeof data.user_data !== 'undefined')
    if(data && typeof data === 'object'){
      data.user_data[name] = new_value
      setAuthData( data )
    }
  else{
    console.error('setUserData can not find user_data')
  }
}

const getCachedViewsExpirationDatesObject = () => {
  let cachedAtDateTable = localStorage.getItem('cachedAtDateTable')
  if( !cachedAtDateTable ) return {}
  cachedAtDateTable = JSON.parse(cachedAtDateTable)
  if( typeof cachedAtDateTable !== 'object' ) return {}
  return cachedAtDateTable
}

const addToCachedViewsExpirationDatesObject = key => {
  let cachedAtDateTable = getCachedViewsExpirationDatesObject()
  cachedAtDateTable[ key ]  = moment( new Date() ).add(8, 'days' ).format('YYYY-MM-DD')
  cachedAtDateTable         = JSON.stringify( cachedAtDateTable )
  localStorage.setItem('cachedAtDateTable', cachedAtDateTable)
}

const removeExpiredViewsFromStorage = () => {
  let cachedAtDateTable = getCachedViewsExpirationDatesObject()
  let newCachedDateTable = { ...cachedAtDateTable }
  let today = moment( new Date() ).format('YYYY-MM-DD')
  Object.keys( cachedAtDateTable ).forEach( key => {
    let date = cachedAtDateTable[ key ]
    if( date < today ){
      delete newCachedDateTable[ key ]
      localStorage.removeItem( key )
    }
  } )
  newCachedDateTable = JSON.stringify(newCachedDateTable)
  localStorage.setItem('cachedAtDateTable', newCachedDateTable )
}

const createViewKey = resource => {
  let user_id = getUserData('user_id')
  if( !user_id ){
    console.error('No user_id found on the localstorage')
    return false
  }
  let key = `view.${resource}.${user_id}`
  addToCachedViewsExpirationDatesObject( key )
  return key
}

const getCachedViewApiResponseIfExist = resource => {
  let viewKeyOnStorage = createViewKey(resource)
  if( !viewKeyOnStorage ) return false
  let view = localStorage.getItem(viewKeyOnStorage)
  if( !view ) return false
  return JSON.parse(view)
}

const cacheViewApiResponse = (resource, viewApiResponse) => {
  if( !resource || !viewApiResponse ){
    console.error(
      `resource and viewApiResponse params are required for setGridView `+
      `storage helper function, instead received ${resource} and ${viewApiResponse} `+
      `respectively as params`
    )
  }
  if( resource !== viewApiResponse.data[0].type ){
    console.error(
      `resource and viewApiResponses type are not matching. Received `+
      `resource <${resource}> and type <${viewApiResponse.data[0].type}> as params.`
    )
  }
  let view = JSON.stringify( viewApiResponse )
  let viewKeyOnStorage = createViewKey(resource)
  localStorage.setItem( viewKeyOnStorage, view )
}

export {
  getAuthData,
  setAuthData,
  clearAuthData,
  getThemeData,
  setThemeData,
  getLayoutData,
  setLayoutData,
  getMultiSelection,
  setMultiSelection,
  getUserData,
  setUserData,
  getCachedViewApiResponseIfExist,
  cacheViewApiResponse,
  removeExpiredViewsFromStorage
};
