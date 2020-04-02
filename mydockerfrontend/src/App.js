import React from 'react';
import ppJedi from './ppJedi.gif'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={ppJedi} className="App-logo" alt="logo" />
        <p>
          Witaj w mojej aplikacji. Reagujemy na każdy problem.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
