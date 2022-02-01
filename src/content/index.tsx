import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './App';

const contentWrapper = document.createElement('div')
contentWrapper.id = 'web-clipboard-app'
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  contentWrapper
);

document.body.appendChild(contentWrapper)