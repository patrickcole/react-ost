import React, { useState, useEffect } from 'react';
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';
import TrackList from "./TrackList";

function Album({location, onUpdateStorage, onFavoriteStatusCheck}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);

  let album_slug = location.pathname;
  album_slug = album_slug.replace('/albums/', '');

  const [favoriteEnabled, setFavoriteEnabled] = useState( onFavoriteStatusCheck(album_slug) );

  const onPlayerAssignment = (node) => setPlayer(node);

  let onFavoriteAdded = (e) => {
    onUpdateStorage(true, { title: soundtrack.title, slug: soundtrack.slug });
    setFavoriteEnabled(true);
  }

  let onFavoriteRemoved = (e) => {
    onUpdateStorage(false, { title: soundtrack.title, slug: soundtrack.slug });
    setFavoriteEnabled(false);
  }

  useEffect(
    () => {
      getDataAsync(`/api/soundtrack/${album_slug}`)
        .then( response => setSoundtrack(response.data) )
        setFavoriteEnabled( onFavoriteStatusCheck(album_slug) );
    }, [location] );

  return (
    <PlayerContext.Provider value={{ player: player, assignPlayer: onPlayerAssignment }}>
    <main className="album">
      <div className="album__player">
        { soundtrack.embed ? <Player embed={soundtrack.embed} /> : <></> }
      </div>
      <div className="album__details">
        { <h3 className="title title__album">{ soundtrack.title }</h3> }
        {  }
        { favoriteEnabled ? <button onClick={onFavoriteRemoved}>Remove Favorite</button> : <button onClick={onFavoriteAdded}>Add to Favorites</button> }
        { soundtrack.tracks ? <TrackList data={soundtrack.tracks} /> : <></> }
      </div>
    </main>
    </PlayerContext.Provider>
  )
}

export default Album;