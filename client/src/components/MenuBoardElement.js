import React, { useState } from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
// Remember, this "Card" is not the same as the Card element used elsewhere.

const MenuBoardElement = ( {board} ) => {
  return (
    <Card>
      <Card.Img variant="top" src={board.symbol?.image_url || './images/img_sample.png'} />
      <Card.Footer>
        <Card.Title>
          {board.title}
        </Card.Title>
        <Card.Subtitle>
          {board.user?.username || ''}
        </Card.Subtitle>
        <ButtonGroup aria-label="Board Options">
          <Button 
            variant="secondary"
            // onClick={() => {
              
            // }}
          >
            Edit
          </Button>
          <Button 
            variant="secondary"
            // onClick={() => {
              
            // }}
          >
            Deploy
          </Button>
          <Button 
            variant="secondary"
            // onClick={() => {
              
            // }}
          >
            Copy
          </Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  )
}

export default MenuBoardElement;