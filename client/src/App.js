//import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'
import { Button, Container, Row, Col} from 'react-bootstrap';
import  Menu  from './pages/Menu'
import  Editor  from './pages/Editor'
import  Deploy  from './pages/Deploy'
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col sm={12}>
          <Link to='/login'><Button variant='primary'>Login</Button></Link>
        </Col>
        <Col>
          <Routes>
            <Route path='/' element={ <Menu />} />
            <Route path='/editor/:boardId' element={ <Editor />} />
            <Route path='/deploy' element={ <Deploy />} />
            <Route path='/login' element={ <AuthPage />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
