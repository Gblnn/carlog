import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import '../WEB/css/clash-grotesk.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import '../app/globals.css'
import './styles/style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    
    <ThemeProvider defaultTheme='dark'>
    <App />
    </ThemeProvider>
    </BrowserRouter>
)
