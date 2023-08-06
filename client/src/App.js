//import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import  Menu  from './pages/Menu'
import  Editor  from './pages/Editor'
import  Deploy  from './pages/Deploy'
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <div className='container'>
      <Link to='/login'><Button variant='primary'>Login</Button></Link>
      <Routes>
        <Route path='/' element={ <Menu />} />
        <Route path='/editor' element={ <Editor />} />
        <Route path='/deploy' element={ <Deploy />} />
        <Route path='/login' element={ <AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
