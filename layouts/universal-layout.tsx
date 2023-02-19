import Head from 'next/head'

export default function UniversalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Cueiz</title>
        <meta name="description" content="Trivia game" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}
