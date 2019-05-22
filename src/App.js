import React, { useState } from "react";
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
            <li key={`album-${item.id}`}>
              <Link 
                to={{
                  pathname: `${match.url}/${item.id}`,
                  state: { album: item }
                }}>{item.title}</Link>
            </li>
          )
        })
      }
      </ul>

      <Route path={`${match.path}/:id`} component={Topic} />
    </div>
  );
}

function App() {

  let ostData = [
    { id: 'simcity-2000', title: 'SimCity 2000', guid: 'DDQY3zGEbQU' },
    { id: 'simcity-3000', title: 'SimCity 3000', guid: 'qkXOxLpdMds'},
    { id: 'simcity4', title: 'SimCity 4', guid: 'PSv37HwwojU' },
    { id: 'simcity', title: 'SimCity', guid: '5GCoc893Vt8' }
  ];

  const [soundtracks] = useState(ostData);

  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/albums" render={ props => <Albums {...props} list={soundtracks} />  } />
      </div>
    </Router>
  );
}

function Topic({location }) {
  return (
    <>
      <h3>{location.state.album.title}</h3>;
      <Player guid={location.state.album.guid} />
    </>
  )
}

function Player({guid}) {
  return (
    <iframe width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${guid}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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