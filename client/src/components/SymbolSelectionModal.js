import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SymbolSelectionModal = ({ 
  show, 
  onHide, 
  updateSymbol,
  model,
  modelId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [symbols, setSymbols] = useState([]);  // Array of symbol objects retrieved from search
  const [selectedSymbol, setSelectedSymbol] = useState(null); // hold current selected symbol object
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [postSymbolIsLoading, setPostSymbolIsLoading] = useState(false);
  const [postSymbolError, setPostSymbolError] = useState(null);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/symbols?q=${searchTerm}`);
      const data = await response.json();
      setSymbols(data);
    } catch (error) {
      console.error('Error fetching symbols:', error);
    }
  };

  // Pass props 'type' and 'elementId' to match what is recieved by the assign symbol route.
  // Submits `selectedSymbol`
  const postSymbol = async (symbol) => {
    try {
      const response = await fetch(`/api/symbols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, model_id: modelId, ...symbol}),
      });

      if (response.ok) {
        updateSymbol(symbol);  // This is the callback function, defined in the parent component as `updateSymbol(symbol) { setImageUrl(symbol.image_url); }
        onHide();
      } else {
        console.error(`Error updating ${type} symbol`)
      }
    } catch (error) {
      console.error(`Error updating ${type} symbol:`, error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} >
    <Modal.Header closeButton>
      <Modal.Title>Select Symbol</Modal.Title>
      <Form onSubmit={handleSearchSubmit}>
        <Form.Group>
          <Form.Label>Search Term</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>
    </Modal.Header>
    <Modal.Body>
      <div className="symbol-selection">
        {symbols.map((symbol) => (
          <div
            key={symbol.id}
            className={`symbol ${
              selectedSymbol.id === symbol.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedSymbol(symbol)}
            onDoubleClick={() => handleSymbolDoubleClick(symbol)}
          >
            <img src={symbol.image_url} alt={`Symbol ${symbol.id}`} />
          </div>
        ))}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          if (selectedSymbol) {
            postSymbol(selectedSymbol);
          } else {
            onHide();
          }
        }}
      >
        Save
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default SymbolSelectionModal;
