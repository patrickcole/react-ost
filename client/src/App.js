import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { getDataAsync } from './Network';

import AlbumList from './AlbumList';
import Album from './Album';

import AppContext from './AppContext';

import './App.css';

const MainMenu = React.memo( (props) => {
  return (
    <>
    <h1>React <abbr title="Official Soundtrack">OST</abbr></h1>
    <h2>An official source for soundtracks to listen to while you work.</h2>
    <p>The intent for this application is to provide a catalog of soundtracks from video games to listen to. This idea started out as a way to keep all my favorite soundtracks saved without dealing with playlists on YouTube.</p>
    </>
  );
})

function App() {

  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('react-ost-favorites')) || []);

  const [debug, setDebug] = useState({ title: "react-ost", message: "This is a debug test", version: "0.4-alpha" });

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

  let renderDebugValues = () => {

    let render = [];
    for ( let prop in debug ) {
      render.push(<li><code>{prop}: {debug[prop]}</code></li>);
    }

    return render;
  }

  return (
    <AppContext.Provider value={{ debug: debug, assignDebug: setDebug }}>
      <Router>
        <header className="bookmark" role="banner">
          <span className="branding"><Link to="/">React <abbr title="Official Soundtrack">OST</abbr></Link></span>
          <nav className="menu__primary" role="navigation" aria-label="Main Navigation">
            <ul className="list">
              <li className="list-item"><Link to="/albums">Soundtracks</Link></li>
              <li className="list-item">
                <dl>
                  <dt>Favorites</dt>
                { favorites.map( (item, index) => <dd className="favorite" key={`favorite${index}`}><Link to={`/albums/${item.slug}`}>{ item.title }</Link></dd>)  }
                </dl>
              </li>
            </ul>
          </nav>
        </header>
        <main className="page" role="main">
          <Route path="/" exact render={ props => <MainMenu /> } />
          <Route path="/albums" exact render={ props => <AlbumList {...props} data={data} />  } />
          <Route path="/albums/:id" exact render={ props => <Album {...props} onUpdateStorage={updateStorage} onFavoriteStatusCheck={returnFavoriteStatus} /> } />
        </main>
        <footer className="footer" role="contentinfo">react-ost Project &bull; Patrick Cole</footer>
      </Router>
      {
        /*
        <div className="popover">
        { renderDebugValues() }
        </div>
        */
      }
    </AppContext.Provider>
  );
}

export default App;
