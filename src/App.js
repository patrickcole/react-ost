import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { getDataAsync } from './Network';

import AlbumList from './AlbumList';

import './App.css';

const Header = React.memo( (props) => {
  return (
    <header>
      <h1>React OST</h1>
      <p>An official source for soundtracks to listen to while you work.</p>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/albums">Albums</Link></li>
        </ul>
      </nav>
    </header>
  )
});

const MainMenu = React.memo( (props) => {
  return <p>There's still much more work to be done here, but we've got the first couple soundtracks added and more will be coming soon.</p>
})

function App() {

  const [data, setData] = useState([]);

  useEffect(
    () => {
      getDataAsync(`http://localhost:3001/api/albums`)
        .then( response => setData(response.data) );
    }, []
  );

  return (
    <Router>
        <Header />
        <Route path="/" exact render={ props => <MainMenu /> } />
        <Route path="/albums" render={ props => <AlbumList {...props} data={data} />  } />
    </Router>
  );
}

export default App;
