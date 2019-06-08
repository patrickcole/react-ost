import React, { useState, useEffect } from 'react';
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';
import TrackList from "./TrackList";

function Album({location, onUpdateStorage}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);

  const onPlayerAssignment = (node) => setPlayer(node);

  let onFavoriteAdded = (e) => onUpdateStorage(soundtrack.slug);

  useEffect(
    () => {
      let album = location.pathname;
      album = album.replace('/albums/','');
      getDataAsync(`/api/soundtrack/${album}`)
        .then( response => setSoundtrack(response.data) )
    }, [location] );

  return (
    <PlayerContext.Provider value={{ player: player, assignPlayer: onPlayerAssignment }}>
    <main className="album">
      <div className="album__player">
        { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <></> }
      </div>
      <div className="album__details">
        { <h3 className="title title__album">{ soundtrack.title }</h3> }
        { <button onClick={onFavoriteAdded}>Add to Favorites</button> }
        { soundtrack.tracks ? <TrackList data={soundtrack.tracks} /> : <></> }
      </div>
    </main>
    </PlayerContext.Provider>
  )
}

export default Album;