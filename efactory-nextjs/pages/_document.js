// _document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html data-theme="light" dir="ltr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mali:wght@400;500&family=Mulish:wght@400;500&family=Quicksand:wght@400;500&display=swap"
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
