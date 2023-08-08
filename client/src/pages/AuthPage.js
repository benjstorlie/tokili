import React, { useState } from 'react';
import { redirect } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';

// TODO fix duplicate ids

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        // Send a POST request to the API endpoint using Axios
        const response = await axios.post('/api/users/login', {
          username,
          password
        });

        if (response.status === 200) {
          // If successful, redirect to the homepage
          redirect('/');
        } else {
          const data = response.data;
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Log In
      </Button>
    </Form>
  );
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username && email && password) {
      try {
        // POST new user
        const response = await axios.post('/api/users', {
          username,
          email,
          password
        });
    
        if (response.status === 200) {
          // If successful, redirect to the homepage
          redirect('/');
        } else {
          const data = response.data;
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
};

const AuthPage = () => {
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Login</Card.Title>
        </Card.Header>
        <Card.Body>
          <Login />
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Signup</Card.Title>
        </Card.Header>
        <Card.Body>
          <Signup />
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthPage;
