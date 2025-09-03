import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import "../styles/globals.css";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {

  const { isAuthRoute } = pageProps;

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
        }
      } catch {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthRoute, router]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>:: Luno Next Tailwind ::</title>
      </Head>
      {
        isAuthRoute ? (
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )
      }
    </>
  );
}
