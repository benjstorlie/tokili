import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component

function Card({ cardData, updateCard }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cardTitle, setCardTitle] = useState(cardData.title);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const handleCardTitleChange = (event) => {
    setCardTitle(event.target.value);
    updateCard(cardData.id, { title: event.target.value });
  };

  const handleImageClick = () => {
    setModalVisible(true);
  };

  return (
    <div className="card">
      <input type="text" value={cardTitle} onChange={handleCardTitleChange} />
      <img src={cardData.imageUrl} alt="Card" onClick={handleImageClick} />
      {modalVisible && (
        <Modal
          cardId={cardData.id}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
}

export default Card;
