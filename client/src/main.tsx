import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './routes/AppRouter'

import './styles/variables.css'

const el = document.getElementById('root')

if (!el) throw new Error('Root element #root not found')

createRoot(el).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>
)
