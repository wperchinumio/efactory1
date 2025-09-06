import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import "../styles/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '@/lib/auth/storage';

export default function App({ Component, pageProps }) {

  const { isAuthRoute } = pageProps;
  const [userApps, setUserApps] = useState([]);

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
          // Get user apps from auth token
          const auth = getAuthToken();
          const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
          const isAdmin = roles.includes('ADM');
          
          // Only set userApps for non-admin users (regular customers)
          // Admin users get userApps only when they select a customer
          if (!isAdmin) {
            // Apps are in user_data like legacy system
            const apps = auth?.user_data?.apps || [];
            setUserApps(apps);
          }
        }
      } catch {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthRoute, router]);

  // For all non-auth routes, provide the real user apps from auth token
  // BUT only for non-admin users (admin users get userApps only when they select a customer)
  useEffect(() => {
    if (!isAuthRoute) {
      const auth = getAuthToken();
      const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
      const isAdmin = roles.includes('ADM');
      
      // Only set userApps for non-admin users (regular customers)
      // Admin users get userApps only when they select a customer
      if (!isAdmin && auth && auth.user_data && auth.user_data.apps) {
        setUserApps(auth.user_data.apps);
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
