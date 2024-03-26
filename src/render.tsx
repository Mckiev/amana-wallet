import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const rootElement = document.body;
const root = ReactDOM.createRoot(rootElement);

export default (): void => {
  root.render((
    <App />
  ));
};
