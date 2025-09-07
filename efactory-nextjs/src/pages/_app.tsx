import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import "../../styles/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '@/lib/auth/storage';
import { AppProps } from 'next/app';
import type { UserApp } from '@/types/api';

export default function App({ Component, pageProps }: AppProps) {
  const { isAuthRoute = false } = pageProps;
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
          const auth = getAuthToken();
          const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
          const isAdmin = roles.includes('ADM');
          
          if (auth && auth.user_data) {
            const apps = auth.user_data.apps || [];
            const userApps = apps.map((appId) => ({
              id: appId.toString(),
              name: `App ${appId}`
            }));
            setUserApps(userApps);
          } else {
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