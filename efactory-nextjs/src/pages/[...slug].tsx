import { useRouter } from 'next/router';
import { useNavigation } from '@/contexts/NavigationContext';
import { getActiveTopMenu, getVisibleSidebarMenus, sidebarConfigs, topMenuConfig } from '@/config/navigation';

export default function DynamicPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { userApps, activeTopMenu } = useNavigation();

  // Function to find the app ID for the current route
  const getAppIdForRoute = () => {
    if (!activeTopMenu || userApps.length === 0) return null;
    
    const currentPath = `/${Array.isArray(slug) ? slug.join('/') : ''}`;
    const visibleMenus = getVisibleSidebarMenus(activeTopMenu, userApps);
    
    // Search through all visible menus to find matching route
    for (const menu of visibleMenus) {
      // Check direct route match
      if (menu.route === currentPath) {
        // Prioritize single appId over appIds array
        if (menu.appId) {
          return menu.appId;
        }
        if (menu.appIds && menu.appIds.length > 0) {
          return menu.appIds[0]; // Return first app ID
        }
      }
      
      // Check dropdown menus
      if (menu.dropdownMenus) {
        for (const dropdown of menu.dropdownMenus) {
          if (dropdown.route === currentPath && dropdown.appId) {
            return dropdown.appId;
          }
        }
      }
    }
    
    return null;
  };

  const appId = getAppIdForRoute();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dynamic Route</h1>
      <p>Path: /{Array.isArray(slug) ? slug.join('/') : 'loading...'}</p>
      {appId && (
        <p className="mt-2 text-sm text-gray-600">
          App ID: {appId}
        </p>
      )}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: false
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}