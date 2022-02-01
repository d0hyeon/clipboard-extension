import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const contentWrapper = document.createElement('div')
contentWrapper.id = 'web-clipboard-app'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  contentWrapper
);

document.body.appendChild(contentWrapper)