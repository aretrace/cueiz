import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Cueiz</title>
        <meta name="description" content="Triva game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="hero">
        <h1>H1</h1>
        <p>p</p>
        <span>span</span>
      </main>
      <main className="hero">
        <div className="hero-content">
          <h1>H1</h1>
          <p>p</p>
          <span>span</span>
        </div>
      </main>
      <main className="hero">
        <div className="hero-content">
          <div className="max-w-md">
            <h1>H1</h1>
            <p>p</p>
            <span>span</span>
          </div>
        </div>
      </main>
      <main className="hero min-h-screen bg-orange-400">
        <div className="hero-content">
          <div className="max-w-md">
            <h1>H1</h1>
            <p>p</p>
            <span>span</span>
          </div>
        </div>
      </main>
    </>
  )
}
