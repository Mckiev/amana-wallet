import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const rootElement = document.body;
const root = ReactDOM.createRoot(rootElement);

export default () => {
  root.render((
    <App />
  ));
};
