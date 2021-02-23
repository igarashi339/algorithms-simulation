import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [state, setState] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(API_URL, { params: { name: 'jima' } })
      setState(response.data.message)
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {state}
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
