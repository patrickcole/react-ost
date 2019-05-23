import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Albums({ match, list }) {

  return (
    <div>

      <h2>Albums</h2>
      <Route exact path={match.path} render={() => <p>Please select an album.</p>} />
      
      <ul>
      {
        list.map(item => {
          return (
            <li key={`album-${item.slug}`}>
              <Link 
                to={{
                  pathname: `${match.url}/${item.slug}`,
                  state: { album: item, slug: item.slug }
                }}>{item.title}</Link>
            </li>
          )
        })
      }
      </ul>

      <Route path={`${match.path}/:id`} component={Album} />
    </div>
  );
}

function App() {

  let ostData = [
    { slug: 'simcity-2000', title: 'SimCity 2000', guid: 'DDQY3zGEbQU' },
    { slug: 'simcity-3000', title: 'SimCity 3000', guid: 'qkXOxLpdMds'},
    { slug: 'simcity4', title: 'SimCity 4', guid: 'PSv37HwwojU' },
    { slug: 'simcity', title: 'SimCity', guid: '5GCoc893Vt8' }
  ];

  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/albums" render={ props => <Albums {...props} list={ostData} />  } />
      </div>
    </Router>
  );
}

function Album({location}) {

  const [soundtrack, setSoundtrack] = useState({});

  // helper function to async/await fetch request:
  async function getDataAsync(url) {
    console.log("started getData");
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

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
    <div>
      { soundtrack.title ? <h3>{ soundtrack.title }</h3> : <h3>Title Not Loaded</h3> }
      { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <p>Player Not Loaded</p> }
      { soundtrack.tracks ? <p>Tracks Loaded</p> : <p>Tracks Not Loaded</p> }
    </div>
  )
}

function Player({embed}) {
  return (
    <iframe width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${embed}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  )
}

function Home() { return <h2>Home</h2> }
function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/albums">Albums</Link>
      </li>
    </ul>
  );
}

export default App;