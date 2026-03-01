import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <--- ΑΥΤΗ Η ΓΡΑΜΜΗ ΕΙΝΑΙ ΑΠΑΡΑΙΤΗΤΗ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)