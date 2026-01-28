import '@/styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary SVG favicon (modern browsers - scalable and crisp) */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />

        {/* Fallback ICO for older browsers (optional but recommended) */}
        <link rel="alternate icon" href="/favicon.ico" />

        {/* Apple touch icon for iOS homescreen */}
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Optional: Site title (shows in browser tab) */}
        <title>MA Estate Builder Ltd</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
