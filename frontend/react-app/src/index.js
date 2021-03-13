import React from 'react';
import ReactDOM from 'react-dom';
import { Dijkstra } from './dijkstra/Dijkstra';

// todo: ルーティング対応
ReactDOM.render(
  <React.StrictMode>
    <Dijkstra />
  </React.StrictMode>,
  document.getElementById('root')
);