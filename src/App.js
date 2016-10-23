import React from 'react';
import { Finder } from './components/Finder';
import { Footer } from './components/Footer';
import { Location } from './components/Location';
import logo from './logo.svg';
import './App.css';

// similar API endpoints
// fp38-wiyy - trees
// h4ih-tzqs - drinking fountains

const App = () => (
      <div className="App">
        <Finder API_ENDPOINT='https://data.melbourne.vic.gov.au/resource/6fzs-45an.json' />
        <Footer />
      </div>
  )

export default App;
