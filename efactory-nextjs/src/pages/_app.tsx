import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import "../../styles/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '@/lib/auth/storage';
import { AppProps } from 'next/app';

interface UserApp {
  id: string;
  name: string;
  // Add other properties as needed
}

export default function App({ Component, pageProps }: AppProps) {

  const { isAuthRoute } = pageProps;
  const [userApps, setUserApps] = useState<UserApp[]>([]);

  const router = useRouter();
  const pageUrl = router.pathname;

  useEffect(() => {
    const pageClass = pageUrl.substring(1).replace(/\//g, '-');
    document.body.classList.add(pageClass ? pageClass : 'dashboard');
    return () => {
      document.body.classList.remove(pageClass ? pageClass : 'dashboard');
    };
  }, [pageUrl]);

  useEffect(() => {
    if (!isAuthRoute) {
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
        const hasToken = raw ? Boolean(JSON.parse(raw)?.api_token) : false;
        if (!hasToken) {
          router.replace('/auth/sign-in');
        } else {
          // Get user apps from auth token and handle both admin and customer users
          const auth = getAuthToken();
          const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
          const isAdmin = roles.includes('ADM');
          
          if (auth && auth.user_data) {
            const apps = auth.user_data.apps || [];
            
            // Transform number array to UserApp array
            const userApps: UserApp[] = apps.map((appId: number) => ({
              id: appId.toString(),
              name: `App ${appId}` // You may want to map this to actual app names
            }));
            
            if (!isAdmin) {
              // Regular customer users: always show their apps
              setUserApps(userApps);
            } else {
              // Admin users: 
              // - On initial login: apps = [] → show admin sidebar (userApps = [])
              // - After selecting customer: apps = [...] → show customer sidebar + "Back to DCL Menu"
              setUserApps(userApps);
            }
          } else {
            // No user_data or no auth - clear userApps
            setUserApps([]);
          }
        }
      } catch {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthRoute, router.pathname]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>eFactory</title>
      </Head>
      {
        isAuthRoute ? (
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        ) : (
          <Layout userApps={userApps}>
            <Component {...pageProps} />
          </Layout>
        )
      }
    </>
  );
}
