import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route , Routes} from "react-router-dom"
import { PreRegistrationForm } from './pages/PreRegistrationForm.jsx'
import VisitorForm from './pages/VisitorForm.jsx'
import LoginForm  from './pages/Login.jsx'
import VisitorTable from './pages/VisitorTable.jsx'
// import Navbar from './components/Navbar.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/preRegistrationForm' element={<PreRegistrationForm/>}></Route>
        <Route path='/visitorForm' element={<VisitorForm/>}></Route>
        <Route path='/' element={<LoginForm/>}></Route>
        <Route path='/visitorTable' element={<VisitorTable/>}></Route>
        {/* <Route path='/navbar' element={<Navbar/>}></Route> */}
      </Routes>
     
    </>
  )
}

export default App
