import React, { useContext, useState, useEffect } from 'react';
import { getDataAsync } from './Network';

import Player from './Player';
import PlayerContext from './PlayerContext';
import TrackList from "./TrackList";

// DEBUG:
import AppContext from './AppContext';

function Album({location, onUpdateStorage, onFavoriteStatusCheck}) {

  const [soundtrack, setSoundtrack] = useState({});
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [startAt, setStartAt] = useState(-1);

  let album_slug = location.pathname;
  album_slug = album_slug.replace('/albums/', '');

  const [favoriteEnabled, setFavoriteEnabled] = useState(false);

  // DEBUG:
  const { debug, assignDebug } = useContext(AppContext);

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

    // DEBUG:
    assignDebug({ ...debug, message: `video play state = ${!playing}`});

    if ( playing ) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  let onMuteButtonClick = (e) => {

    if ( player.isMuted() ) {
      setMuted(false);
      player.unMute();
    } else {
      setMuted(true);
      player.mute();
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

      // DEBUG:
      assignDebug({ ...debug, title: album_slug, message: `Loading album data`});

      getDataAsync(`/api/soundtrack/${album_slug}`)
        .then( (response) => {
          setSoundtrack(response.data);
          assignDebug({ ...debug, message: `Album data loaded`});
        })
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
    <article className="album" role="article">
      <section className="album__player">
        { soundtrack.embed ? <Player embed={soundtrack.embed} dispatchStatePaused={handleStatePaused} dispatchStatePlaying={handleStatePlaying} /> : <></> }
      </section>
      <section className="album__controls">
        
        <span className="a11y-visual-hidden" aria-live="polite">{ playing ? 'Audio is now playing' : 'Audio is now paused' }</span>
        <span className="a11y-visual-hidden" aria-live="polite">{ favoriteEnabled ? 'Favorite added' : 'Favorite removed' }</span>

        <button className="btn btn__control" onClick={onPlaybackButtonClick}>{ playing ? 'Pause' : 'Play' }</button>
        <button className="btn btn__control" onClick={onMuteButtonClick}>{ muted ? 'Unmute' : 'Mute' }</button>

        { favoriteEnabled ? <button className="btn btn__control" onClick={onFavoriteRemoved}>Remove Favorite</button> : <button className="btn btn__control" onClick={onFavoriteAdded}>Add Favorite</button> }
      </section>
      <section className="album__details">
        { <h1 className="title title__album">{ soundtrack.title }</h1> }
        { soundtrack.tracks ? <TrackList data={soundtrack.tracks} /> : <></> }
      </section>
    </article>
    </PlayerContext.Provider>
  )
}

export default Album;