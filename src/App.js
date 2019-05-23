import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

// helper function to async/await fetch request:
async function getDataAsync(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

// memoized components:
const Home = React.memo((props) => <h2>Home</h2>);
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
      { soundtrack.title ? <h3>{ soundtrack.title }</h3> : <h3>Title Not Loaded</h3> }
      { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <p>Player Not Loaded</p> }
      { soundtrack.tracks ? <Tracks list={soundtrack.tracks} /> : <p>Tracks Not Loaded</p> }
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
          return <li key={`track${index}`}>{ track.title } - { track.playAt }</li>
        })
      }
      </ul>
    )
  }

  return tracksDisplay;
}

const Player = ({embed}) => <iframe id="reactOSTPlayer" title="OST Player" width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${embed}?autoplay=0&enablejsapi=1&modestbranding=1&fs=0&disablekb=1&controls=0`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;

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
