/* eslint-disable react/jsx-key */
import React from 'react'
import ContentLoader from 'react-content-loader'

// TODO: Properly format component
export default function Loading({ amount }: { amount: number }) {
  return (
    <>
      {[...Array(amount)].map((_, i) => (
        <div className="my-2">
          <ContentLoader
            speed={0.5}
            width={800}
            height={90}
            viewBox="0 0 800 90"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="24" y="17" rx="3" ry="3" width="560" height="28" />
            <rect x="23" y="66" rx="3" ry="3" width="71" height="25" />
            <rect x="112" y="66" rx="3" ry="3" width="71" height="25" />
            <rect x="205" y="66" rx="3" ry="3" width="71" height="25" />
            <rect x="296" y="67" rx="3" ry="3" width="71" height="25" />
          </ContentLoader>
        </div>
      ))}
    </>
  )
}
