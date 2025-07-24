import { Header } from "./pages/header"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"

function App() {
  

  return (
    <div className="dark:bg-black min-h-screen">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* <Route path="/" index element={<Header />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
