
import './App.scss'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import { Navigate, Route, Routes } from 'react-router'
import Home from './pages/home/Home'
import { AuthContextProvider } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'
import CreateChat from './pages/createChat/CreateChat'
import CreateGroup from './pages/createGroup/CreateGroup'
// import { useContext } from 'react'

function App() {

  const ProtactedRoute = ({ children }) => {
    // const { currentUser } = useContext(AuthContext)
    if (localStorage.getItem('email') === null || localStorage.getItem('acsess') === null) {
      return <Navigate to={'/login'} />
    }
    return children
  }



  return (
    <div>
      <Routes>
        <Route path='/'>
          <Route index path='' element={<AuthContextProvider><ChatContextProvider><ProtactedRoute><Home /></ProtactedRoute></ChatContextProvider></AuthContextProvider>} />
          <Route path="login" element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='createchat' element={<AuthContextProvider><ChatContextProvider><ProtactedRoute><CreateChat /></ProtactedRoute></ChatContextProvider></AuthContextProvider>} />
          <Route path='creategroup' element={<AuthContextProvider><ChatContextProvider><ProtactedRoute><CreateGroup /></ProtactedRoute></ChatContextProvider></AuthContextProvider>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
