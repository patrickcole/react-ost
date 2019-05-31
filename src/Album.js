import React, { useState, useEffect } from 'react';
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';
import TrackList from "./TrackList";

function Album({location}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);

  const onPlayerAssignment = (node) => setPlayer(node);

  useEffect(
    () => {
      let album = location.pathname;
      album = album.replace('/albums/','');
      getDataAsync(`http://localhost:3001/api/soundtrack/${album}`)
        .then( response => setSoundtrack(response.data) )
    }, [location] );

  return (
    <main>
      { <h3>{ soundtrack.title }</h3> }

      <PlayerContext.Provider value={{ player: player, assignPlayer: onPlayerAssignment }}>  
        { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <></> }
        { soundtrack.tracks ? <TrackList data={soundtrack.tracks} /> : <></> }
      </PlayerContext.Provider>
    </main>
  )
}

export default Album;