import React, { useState, useEffect } from 'react';
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';
import TrackList from "./TrackList";

function Album({location, onUpdateStorage, onFavoriteStatusCheck}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [startAt, setStartAt] = useState(-1);

  let album_slug = location.pathname;
  album_slug = album_slug.replace('/albums/', '');

  const [favoriteEnabled, setFavoriteEnabled] = useState(false);

  let onPlayerAssignment = (node) => setPlayer(node);
  let onFavoriteAdded = (e) => {
    onUpdateStorage(true, { title: soundtrack.title, slug: soundtrack.slug });
    setFavoriteEnabled(true);
  }
  let onFavoriteRemoved = (e) => {
    onUpdateStorage(false, { title: soundtrack.title, slug: soundtrack.slug });
    setFavoriteEnabled(false);
  }
  let handleStatePlaying = (e) => setPlaying(true);
  let handleStatePaused = (e) => setPlaying(false);
  let onPlaybackButtonClick = (e) => {
    if ( playing ) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }
  let getHighlightedTrackIndex = (query) => {

    let index = -1;
    const term = "?track=";
    let query_index = query.indexOf(term);

    if ( query_index > -1 ) {

      let track_index = parseInt(query.substring(query_index + term.length));
      if ( !isNaN(track_index) ) {
        index = (track_index - 1);
      }
    }
    return index;
  }

  useEffect(() => {
    
    if ( player ) {
      if ( startAt > -1 ) {

        player.seekTo(startAt);
        player.playVideo();
      }
    }
  }, [player, startAt]);

  useEffect(
    () => {
      getDataAsync(`/api/soundtrack/${album_slug}`)
        .then( (response) => setSoundtrack(response.data) )
    }, [album_slug]
  );

  useEffect(
    () => {
      let favoriteAdded = onFavoriteStatusCheck(album_slug);
      setFavoriteEnabled(favoriteAdded);
    }, [album_slug, onFavoriteStatusCheck]
  )

  useEffect(
    () => {

      // check for active soundtrack data
      // before even going through this:
      if ( Object.keys(soundtrack).length > 0 && soundtrack.constructor === Object ) {
        let index = getHighlightedTrackIndex(location.search);
        if ( index > -1 && index <= soundtrack.tracks.length ) {

          // todo ensure there's a playAt property:
          setStartAt(soundtrack.tracks[index].playAt);
        }
      }
    }, [location, soundtrack]
  )

  return (
    <PlayerContext.Provider value={{ player: player, assignPlayer: onPlayerAssignment }}>
    <main className="album">
      <div className="album__player">
        { soundtrack.embed ? <Player embed={soundtrack.embed} dispatchStatePaused={handleStatePaused} dispatchStatePlaying={handleStatePlaying} /> : <></> }
      </div>
      <div className="album__controls">
        <button className="btn btn__control" onClick={onPlaybackButtonClick}>{ playing ? 'Pause' : 'Play' }</button>
        { favoriteEnabled ? <button className="btn btn__control" onClick={onFavoriteRemoved}>Remove Favorite</button> : <button className="btn btn__control" onClick={onFavoriteAdded}>Add Favorite</button> }
      </div>
      <div className="album__details">
        { <h3 className="title title__album">{ soundtrack.title }</h3> }
        { soundtrack.tracks ? <TrackList data={soundtrack.tracks} /> : <></> }
      </div>
    </main>
    </PlayerContext.Provider>
  )
}

export default Album;