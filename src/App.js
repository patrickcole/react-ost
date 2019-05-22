import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Albums({ match }) {

  let album_list = [
    { id: 'simcity-2000', title: 'SimCity 2000' },
    { id: 'simcity-3000', title: 'SimCity 3000' },
    { id: 'simcity4', title: 'SimCity 4' },
    { id: 'simcity', title: 'SimCity' }
  ];

  return (
    <div>

      <h2>Albums</h2>
      <Route exact path={match.path} render={() => <p>Please select an album.</p>} />
      
      <ul>
      {
        album_list.map((item, index) => {
          return (
            <li>
              <Link to={`${match.url}/${item.id}`}>{item.title}</Link>
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
  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/albums" component={Albums} />
      </div>
    </Router>
  );
}

function Topic({ match }) {

  return <h3>Album: {match.params.id}</h3>;
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