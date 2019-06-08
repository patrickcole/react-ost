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
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('react-ost-favorites')) || []);

  useEffect(
    () => {
      getDataAsync(`/api/albums`)
        .then( response => setData(response.data) );
    }, []
  );

  useEffect(() => {
    localStorage.setItem('react-ost-favorites', JSON.stringify(favorites));
  }, [favorites]);

  let returnFavoriteStatus = ( slug ) => {

    return favorites.some( ( item ) => {
      return item.slug === slug;
    });
  };

  let updateStorage = ( add, obj ) => {
    
    let newFavorites;
    if ( add ) {
      newFavorites = [...favorites, obj];
    } else {
      newFavorites = favorites.filter( (item) => {
        return item.slug !== obj.slug;
      });
    }
    setFavorites(newFavorites);
  };

  return (
    <Router>
      <div className="bookmark">
        <h1 className="branding"><Link to="/">React OST</Link></h1>
        <nav className="menu__primary">
          <ul className="list">
            <li className="list-item"><Link to="/albums">Albums</Link></li>
            <li className="list-item">
              <h3>Favorites</h3>
              { favorites.map( (item) => <p><Link to={`/albums/${item.slug}`}>{ item.title }</Link></p>) }
            </li>
          </ul>
        </nav>
      </div>
      <div className="page">
        <Route path="/" exact render={ props => <MainMenu /> } />
        <Route path="/albums" exact render={ props => <AlbumList {...props} data={data} />  } />
        <Route path="/albums/:id" render={ props => <Album {...props} onUpdateStorage={updateStorage} onFavoriteStatusCheck={returnFavoriteStatus} /> } />
      </div>
      <footer className="footer">react-ost Project &bull; Patrick Cole</footer>
    </Router>
  );
}

export default App;
