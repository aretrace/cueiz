import { useState } from 'react'
import '../styles/globals.css'
import Layout from '../components/layout'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// TODO: change to tilwnd scale, for firefox's sake!
// import '../libs/css-zoom'

// https://github.com/jakeclifford/quiz-smash/blob/master/src/Question.js

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  )
}
