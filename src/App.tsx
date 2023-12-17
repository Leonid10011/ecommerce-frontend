import './App.css'
import Navbar from './components/Navbar/Navbar'
import SignIn from './components/SignIn/SignIn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Main from './components/Main/Main'
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
