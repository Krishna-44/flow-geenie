import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="AutoFlow AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutoFlow AI" />
        <meta name="theme-color" content="#4F46E5" />
        <meta
          name="description"
          content="AutoFlow AI is a no-code automation platform that turns natural language into workflows you can visualize, manage, and run."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

