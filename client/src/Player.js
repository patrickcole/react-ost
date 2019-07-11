import React, { useContext } from 'react';
import YouTube from 'react-youtube';
import PlayerContext from './PlayerContext';

function Player( { embed, dispatchStatePaused, dispatchStatePlaying } ) {

  const { assignPlayer } = useContext(PlayerContext);

  const opts = {
    host: 'https://www.youtube-nocookie.com',
    playerVars: {
      autoplay: 0,
      fs: 0,
      showinfo: 0,
      ecvar: 2,
      controls: 0,
      modestbranding: 1,
      playsinline: 1,
      disablekb: 1
    }
  };

  let handleStateReady = (e) => assignPlayer(e.target);
  
  return (
    <>
      <YouTube className="player" videoId={embed} opts={opts} 
        onPlay={dispatchStatePlaying} 
        onPause={dispatchStatePaused} 
        onReady={handleStateReady} 
      />
    </>
  )
};

export default Player;