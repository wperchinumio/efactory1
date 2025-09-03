import createRouteAppIdsConfig from '../components/_Shared/Layout/Config/routeAppIdsTable'
import notImplementedAppIds from '../components/_Shared/Layout/Config/notImplementedAppIds'
import orderOfAppIds from '../components/_Shared/Layout/Config/orderOfAppIds'
import { getUserData }   from './storageHelperFuncs'

export const isPathnameAllowed = pathname => {
  pathname = pathname ? pathname.replace(/\?.+/, '') : ''

  const allowedRoutes = [ 
    '/', 
    '/admin/login-user',
    '/admin/announcement',
    '/admin/online-customers',
    '/admin/license-summary',
    '/admin/users',
    '/login', 
    '/no-apps', 
    '/team-members',
    '/announcements'
  ] // @@todo temp....


  if( allowedRoutes.includes( pathname ) ) return true

  if( pathname.endsWith('/manage-filters') ) return true

  if( pathname.includes('/view/') ) return true

  // if(  /* check if ends with '/view/:id' */  ) 
  let routeAppIdsTable = createRouteAppIdsConfig()
  let appId = routeAppIdsTable[ pathname ]

  if( !appId ){
    console.warn(`no appId matched pathname: '${pathname}' on routeAppIdsTable.js config file.`)
    return false
  } 

  if( notImplementedAppIds.includes(appId) ) return false

  // temp
  let visibleAppIdsArray = getUserData('apps') || []

  visibleAppIdsArray = [ ...visibleAppIdsArray ]

  return visibleAppIdsArray.includes( appId )
  
}

export const findDefaultRoute = () => {
  
  let visibleAppIdsArray = getUserData('apps') || []

  visibleAppIdsArray = [ ...visibleAppIdsArray ]

  visibleAppIdsArray = visibleAppIdsArray.filter( v => !notImplementedAppIds.includes( v ) )

  let visibleAppsInOrder = orderOfAppIds.filter( app_id => visibleAppIdsArray.includes(app_id) )
  
  let routeAppIdsTable = createRouteAppIdsConfig()
  return Object.keys( routeAppIdsTable ).filter( 
    route => routeAppIdsTable[ route ] ===  visibleAppsInOrder[ 0 ]
  )[ 0 ] || '/no-apps'
}

export const checkIfAuthTokenExists = () => {
  let authToken = localStorage.getItem("authToken")
  authToken = authToken ? JSON.parse( authToken ) : {}
  return authToken.user_data
}

export const isUserAdmin = () => {
  let authToken = localStorage.getItem("authToken")
  authToken = authToken ? JSON.parse( authToken ) : {}
  return authToken.user_data.roles.includes('ADM')
}

