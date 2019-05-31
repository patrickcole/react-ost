import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Album from './Album';

function AlbumList({ match, data }) {

  let handleAlbumLogic = () => {

    if ( data.length < 1 ){
      return <p>No Albums Available</p>
    } else {
      return (
        <ul>
          {
            data.map(item => {
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
  }

  return (
    <>
    <aside>{ handleAlbumLogic() }</aside>
    <Route path={`${match.path}/:id`} component={Album} />
    </>
  );
}

export default AlbumList;