import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app.component'
import { verifyMockApi } from './mocks/verify'
import './shared/styles/main.scss'

async function enableMocking() {
  if (!import.meta.env.DEV) return

  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  })
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

enableMocking()
  .then(() => {
    renderApp()
    if (import.meta.env.DEV) void verifyMockApi()
  })
  .catch((error: unknown) => {
    console.warn('MSW не запустился, приложение продолжит работу без мокирования API.', error)
    renderApp()
  })
