//import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import  Menu  from './pages/Menu'
import  Editor  from './pages/Editor'
import  Deploy  from './pages/Deploy'
import  Login  from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Menu />} />
      <Route path='/editor' element={ <Editor />} />
      <Route path='/deploy' element={ <Deploy />} />
      <Route path='/login' element={ <Login />} />
    </Routes>
  );
}

export default App;
