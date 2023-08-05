import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component
import axios from 'axios';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch initial data (list of cards) from the server
    axios.get('/api/cards')
      .then(response => {
        setCards(response.data);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  }, []);

  const updateCard = (cardId, newData) => {
    // Update card data in the state and send changes to the server
    const updatedCards = cards.map(card =>
      card.id === cardId ? { ...card, ...newData } : card
    );

    // Update state
    setCards(updatedCards);

    // Send changes to the server (you would need to implement this)
    axios.put(`/api/cards/${cardId}`, newData)
      .catch(error => {
        console.error('Error updating card:', error);
      });
  };

  const addCard = () => {
    // Add a new card in the database and update state
    // Send request to add card
    // TODO: add logic to POST new card to database
    axios.post('/api/cards')
      .then(response => {
        const newCard = response.data;
        setCards([...cards, newCard]);
      })
      .catch(error => {
        console.error('Error adding card:', error);
      });
  };

  return (
    <div className="app">
      <button onClick={addCard}>Add Card</button>
      <div className="card-container">
        {cards.map(card => (
          <Card key={card.id} cardData={card} updateCard={updateCard} />
        ))}
      </div>
    </div>
  );
}

export default App;
