import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WordleHelper from './WordleHelper';
import {WordleProvider} from './WordleContext';

ReactDOM.render(
  <React.StrictMode>
    <WordleProvider>
      <WordleHelper />
    </WordleProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
