import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Card as BootstrapCard, Button, Form, CardGroup, Col, Row } from 'react-bootstrap';
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

  const updateSymbol = (symbol) => {
    setBoardSymbol(symbol);
  }

  // TODO: format with rows and cols etc.
  // TODO: add nav buttons that save/delete/deploy/ and go back to menu.
  // TODO: format nav buttons nicely.
  // Add board title input form
  // Add small board symbol button.
  return (
    <div className="editor">
      <button onClick={addCard}>Add Card</button>
      <div className='heading-container'>
        <Heading key={heading.id} headingData={heading} />
      </div>
      <CardGroup>
        {cards.map(card => (
          <Card key={card.id} cardData={card} />
        ))}
      </CardGroup>
      <SymbolSelectionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        updateSymbol={updateSymbol} // Pass the callback function
        type='board'
        elementId={boardId}
      />
    </div>
  );
}

export default Editor;
