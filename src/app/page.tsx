import Link from 'next/link'

export default function Home() {
  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Cueiz™®©</h1>
          <p className="py-6">
            A Online Interactive Global Digital Venture Solutions LLC S.A. GmbH Inc experience.
          </p>
          <Link href="/quiz" className="btn btn-primary no-animation">
            🚀 Start!
          </Link>
        </div>
      </div>
    </main>
  )
}
