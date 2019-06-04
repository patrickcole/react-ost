import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { getDataAsync } from './Network';

import AlbumList from './AlbumList';
import Album from './Album';

import './App.css';

const MainMenu = React.memo( (props) => {
  return (
    <>
    <p>An official source for soundtracks to listen to while you work.</p>
    <p>There's still much more work to be done here, but we've got the first couple soundtracks added and more will be coming soon.</p>
    </>
  );
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
      <div className="bookmark">
        <h1 className="branding"><Link to="/">React OST</Link></h1>
        <nav className="menu__primary">
          <ul className="list">
            <li className="list-item"><Link to="/albums">Albums</Link></li>
            <li className="list-item"><Link to="/favorites">Favorites</Link></li>
          </ul>
        </nav>
      </div>
      <div className="page">
        <Route path="/" exact render={ props => <MainMenu /> } />
        <Route path="/albums" exact render={ props => <AlbumList {...props} data={data} />  } />
        <Route path="/albums/:id" render={ props => <Album {...props} /> } />
        <Route path="/favorites" exact render={ props => <p>Coming soon</p> } />
      </div>
      <footer className="footer">react-ost Project &bull; Patrick Cole</footer>
    </Router>
  );
}

export default App;