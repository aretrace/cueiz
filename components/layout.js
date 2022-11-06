import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Cueiz</title>
        <meta name="description" content="Trivia game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}
