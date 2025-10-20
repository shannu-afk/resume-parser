// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import UploadPage from './pages/UploadPage'
import JobInputPage from './pages/JobInputPage'
import ResultPage from './pages/ResultPage'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <UploadPage /> },
      { path: 'job', element: <JobInputPage /> },
      { path: 'result', element: <ResultPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
