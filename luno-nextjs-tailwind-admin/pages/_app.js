import Head from 'next/head';
import Layout from "@/components/layout/Layout";
import AuthLayout from "@/components/layout/AuthLayout";
import "../styles/globals.css";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {

  const { isAuthRoute } = pageProps;

  const pageUrl = useRouter().pathname;
  useEffect(() => {
    const pageClass = pageUrl.substring(1).replace(/\//g, '-');
    document.body.classList.add(pageClass ? pageClass : 'dashboard');
    return () => {
      document.body.classList.remove(pageClass ? pageClass : 'dashboard');
    };
  }, [pageUrl]);

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
