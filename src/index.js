import { createRoot } from 'react-dom/client'
import App from '../components/App'
import React from 'react'

if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    const root = createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}