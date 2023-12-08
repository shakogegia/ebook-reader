import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return <>
    <Head>
      <title>E-Book Reader</title>
      <link rel="icon" href="/favicon.ico" />
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>
    <Component {...pageProps} />
  </>
}
