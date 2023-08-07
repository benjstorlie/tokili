import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, Row, Col} from 'react-bootstrap';
import MenuBoardElement from '../components/MenuBoardElement'

const Menu = () => {
  const [menuIsLoading, setMenuIsLoading] = useState(false);
  const [getMenuError, setGetMenuError] = useState(null);
  const [boards, setBoards] = useState([]);

  useEffect( async () => {
    setMenuIsLoading(true);
    // Fetch initial data from the server
    try {
      const response = await axios.get(`api/boards/`);
      const boardData = response.data;

      // TODO solve problem!
      // boardData can be console.logged correctly.
      // but boards won't console.log, but it still tries to render the menuBoardElement incorrectly
      setBoards(boardData);

      setMenuIsLoading(false)
    } catch (error) {
      setGetMenuError(error);
      setMenuIsLoading(false);
      console.error('Error loading board:', error);
    }
  }, []);

  return (
    <>
    <Row>
      <Col sm={12} md={2}>
        <div>nav element</div>
      </Col>
      <Col> 
        <Row>
          {boards.map(board => (
            <Col>
              <MenuBoardElement key={board.id} boardData={board} />
            </Col>
          ))}
          {menuIsLoading ? (<Col sm={12}><span>Menu Loading...</span></Col>): (<></>)}
          {getMenuError ? (<Col sm={12}><span>Menu Loading Error</span></Col>): (<></>)}
        </Row>
      </Col>
   
    </Row>
    </>
  )
}

export default Menu