import React from 'react';
import { Link } from "react-router-dom";


function AlbumList({ match, data }) {

  let handleAlbumLogic = () => {

    if ( data.length < 1 ){
      return <p>No Albums Available</p>
    } else {
      return (
        <>
          <ul className="list list__albums">
            {
              data.map(item => {
                return (
                  <li className="list-item__album" key={`album-${item.slug}`}>
                    <Link className="link link__album" to={`${match.url}/${item.slug}`}>{item.title}</Link>
                  </li>
                )
              })
            }
          </ul>
        </>
      )
    }
  }

  return (
    <article className="album" role="article">
      <h1>Soundtracks</h1>
      { handleAlbumLogic() }
    </article>
  );
}

export default AlbumList;