import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function AlbumList({ match, data }) {

  let handleAlbumLogic = () => {

    if ( data.length < 1 ){
      return <p>No Albums Available</p>
    } else {
      return (
        <div className="well">
          <ul className="list">
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
        </div>
      )
    }
  }

  return (
    <div className="album">
      <aside className="album-drawer">{ handleAlbumLogic() }</aside>
    </div>
  );
}

export default AlbumList;