import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';

import './App.css';

// memoized components:
const Header = React.memo((props) => {
  return (
    <header>
      <Route exact path="/" component={Home} />
      <Route path="/albums" render={ () => <h2>Albums</h2> } />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/albums">Albums</Link></li>
        </ul>
      </nav>
    </header>
  )
});
const Home = React.memo((props) => <h2>Home</h2>);
const Track = React.memo((props) => {

  const { player } = useContext(PlayerContext);

  let seekPlayerTo = (e) => player.seekTo(e.target.dataset.seconds);

  return (
    <li>
      <button onClick={seekPlayerTo} data-seconds={props.data.playAt}>{props.data.title}</button>
    </li>
  )
});

// dynamic components:
function Albums({ match, list }) {

  // Establish logic for album display:
  let albumDisplay;
  if ( list.length < 1 ){
    albumDisplay = <p>No Albums Available</p>
  } else {
    albumDisplay = (
      <ul>
        {
          list.map(item => {
            return (
              <li key={`album-${item.slug}`}>
                <Link to={`${match.url}/${item.slug}`}>{item.title}</Link>
              </li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <>
    <aside>{ albumDisplay }</aside>
    <Route path={`${match.path}/:id`} component={Album} />
    </>
  );
}

function Album({location}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);

  const onPlayerAssignment = (node) => setPlayer(node);

  useEffect(
    () => {
      let album = location.pathname;
      album = album.replace('/albums/','');
      getDataAsync(`http://localhost:3001/api/soundtrack/${album}`)
        .then( response => {
          setSoundtrack(response.data)
        })
    }, [location] );

  return (
    <main>
      <PlayerContext.Provider value={{ player: player, assignPlayer: onPlayerAssignment }}>
        { soundtrack.title ? <h3>{ soundtrack.title }</h3> : <h3>Title Not Loaded</h3> }
        { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <p>Player Not Loaded</p> }
        { soundtrack.tracks ? <Tracks list={soundtrack.tracks} /> : <p>Tracks Not Loaded</p> }
      </PlayerContext.Provider>
    </main>
  )
}


function Tracks({list}) {

  let tracksDisplay;
  if ( list.length < 1 ) {
    tracksDisplay = <p>No tracks available</p>
  } else {
    tracksDisplay = (
      <ul>
      {
        list.map( (track, index) => {
          return <Track key={`track${index}`} data={track} />
        })
      }
      </ul>
    )
  }

  return tracksDisplay;
}

function App() {

  const [albumsData, setAlbumsData] = useState([]);

  useEffect(
    () => {
      getDataAsync(`http://localhost:3001/api/albums`)
        .then( response => {
          setAlbumsData(response.data)
        });
    }, []
  );

  return (
    <Router>
        <Header />
        <Route path="/" exact render={ props => <p>Welcome to React OST</p> } />
        <Route path="/albums" render={ props => <Albums {...props} list={albumsData} />  } />
    </Router>
  );
}

export default App;
