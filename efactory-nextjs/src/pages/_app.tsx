import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import AuthErrorBoundary from "@/components/auth/AuthErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import "../../styles/globals.css";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/styles/ag-grid-theme.css';
import '@/styles/modern-grid.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthState } from '@/lib/auth/guards';
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

  // Update user apps when auth state changes
  useEffect(() => {
    if (!isAuthRoute) {
      try {
        const authState = getAuthState();
        if (authState.isAuthenticated && authState.userApps) {
          const apps = authState.userApps.map((appId) => ({
            id: appId.toString(),
            name: `App ${appId}`
          }));
          setUserApps(apps);
        } else {
          setUserApps([]);
        }
      } catch (error) {
        console.error('Error updating user apps:', error);
        setUserApps([]);
      }
    }
  }, [isAuthRoute, router.pathname]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>eFactory</title>
      </Head>
      <AuthErrorBoundary>
        <AuthGuard isAuthRoute={isAuthRoute}>
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
        </AuthGuard>
        <ToastContainer />
      </AuthErrorBoundary>
    </>
  );
}