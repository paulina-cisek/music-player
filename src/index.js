import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StateProvider } from './contexts/store';
import './styles/index.scss';

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
