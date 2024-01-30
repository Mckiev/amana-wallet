import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.body;

if (rootElement === null) {
  throw new Error('Unexpected null root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render((
  <h1>AMANA Wallet</h1>
));
