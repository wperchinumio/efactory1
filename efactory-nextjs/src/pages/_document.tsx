// _document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html data-theme="light" dir="ltr" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/images/logo_square.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo_square.svg" />
        <meta name="description" content="eFactory - Enterprise Factory Management System" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mali:wght@400;500&family=Mulish:wght@400;500&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Using Tabler Icons (React components) - same as Luno theme */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
