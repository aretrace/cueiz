import Link from 'next/link'
import styles from '../styles/home-page.module.css'

export default function HomePage() {
  return (
    <>
      <main className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Cueiz</h1>
            <p className="py-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis accusantium aut error voluptatum
              porro!
            </p>
            <Link href="/game">
              <a className="btn-primary no-animation btn">🚀 Start!</a>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
