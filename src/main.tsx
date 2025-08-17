import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@/themes/styles/theme.css'

createRoot(document.getElementById("root")!).render(<App />);
