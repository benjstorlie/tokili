import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Button, Form, Col, Row } from 'react-bootstrap';
import Card from '../components/Card';
import Heading from '../components/Heading'; 
import axios from 'axios';

function Editor(  ) {
  const {boardId} = useParams();
  const [boardIsLoading, setBoardIsLoading] = useState(false);
  const [getBoardError, setGetBoardError] = useState(null);
  const [cards, setCards] = useState([]);
  const [heading, setHeading] = useState({});
  const [boardTitle, setBoardTitle] = useState('');
  const [boardSymbol, setBoardSymbol] = useState({});
  const [showModal, setShowModal] = useState('false');

  useEffect( async () => {
    setBoardIsLoading(true);
    // Fetch initial data from the server
    try {
      const response = await axios.get(`api/boards/${boardId}`);
      const boardData = response.data;

      setBoardTitle(boardData.title);
      setBoardSymbol(boardData.symbol);
      setHeading(boardData.heading);
      setCards(boardData.cards);

      setBoardIsLoading(false)
    } catch (error) {
      setGetBoardError(error);
      setBoardIsLoading(false);
      console.error('Error loading board:', error);
    }
  }, []);

  const addCard = async () => {
    // Add a new card in the database and update state
    // Send request to add card
    // TODO: Decide about showing/hiding cards vs fully deleting them.
    // TODO: also look at soft delete
    try {
      const response = await axios.post(`api/cards/`, {
        board_id: boardId
      })
      const newCard = response.data;
      setCards([...cards, newCard]);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const toggleHeading = () => {
    // Does not update database.
    setHeading({show: (!heading.show), ...heading});
  }

  const updateSymbol = (symbol) => {
    setBoardSymbol(symbol);
  }

  // TODO: format with rows and cols etc.
  // TODO: add nav buttons that save/delete/deploy/ and go back to menu.
  // TODO: format nav buttons nicely.
  // Add board title input form
  // Add small board symbol button.
  return (
    <>
      <Row>
        <Col sm={12} md={2}>
          <button onClick={addCard}>Add Card</button>
          <button onClick={toggleHeading}>{heading.show ? "Hide Heading" : "Show Heading"}</button>
        </Col>
        <Col>
      <div className='heading-container'>
        <Heading key={heading.id} headingData={heading} />
      </div>
      <Row>
        {cards.map(card => (
          <Col><Card key={card.id} cardData={card} /></Col>
        ))}
        </Row>
        </Col>
      <SymbolSelectionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        updateSymbol={updateSymbol} // Pass the callback function
        model='board'
        modelId={boardId}
      />
      </Row>
    </>
  );
}

export default Editor;
