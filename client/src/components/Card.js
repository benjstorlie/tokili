import React, { useState } from 'react';
import { Card as BootstrapCard, Button, Form } from 'react-bootstrap';
import SymbolSelectionModal from './SymbolSelectionModal';

const Card = (props) => {
  const cardId = props.cardId;
  const [title, setTitle] = useState(props.title || '');
  const [imageUrl, setImageUrl] = useState(props.symbol ? props.symbol.image_url : '');
  const [showModal, setShowModal] = useState(false);

  const handleTitleSubmit = (e) => {
    // TODO: fetch PUT title
    // 
  };

  const updateSymbol = (symbol) => {
    setImageUrl(symbol.image_url);
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageUrl('');
    // TODO: fetch PUT symbol_id
  };

  const handleRemoveCard = () => {
    // TODO: fill out hide/remove card function
    return
  }

  return (
    <BootstrapCard>
      <BootstrapCard.Header>
      <Form onSubmit={handleTitleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
            <Button
              variant="outline-secondary"
              onClick={() => {
                const speech = new SpeechSynthesisUtterance(title);
                window.speechSynthesis.speak(speech);
              }}
            >
              Speak
            </Button>
          <Form.Control
            type="text"
            placeholder="Card Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Button
        variant="close"
        aria-label="Close"
        onClick={handleRemoveCard}
      >
        &times;
      </Button>
      </BootstrapCard.Header>
      <div
        className={`card-img-bottom ${
          imageUrl ? 'with-image' : 'no-image'
        }`}
        onClick={() => setShowModal(true)}
        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : null}
      >
        {imageUrl && (
          <Button
            className="close close-image"
            aria-label="Remove Symbol"
            onClick={() => setShowModal(true) }
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        )}
      </div>
      <SymbolSelectionModal
        key={cardId}
        show={showModal}
        onHide={() => setShowModal(false)}
        updateSymbol={updateSymbol} // Pass the callback function
        model='card'
        modelId={cardId}
      />
    </BootstrapCard>
  );
};

export default Card;
