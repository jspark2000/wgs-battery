import { Toaster } from '@/components/ui/sonner.tsx'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'
import store from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
    <Toaster
      richColors={true}
      position="top-center"
      closeButton={true}
      duration={2000}
    />
  </Provider>
  // </StrictMode>
)
