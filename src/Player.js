import React, { useContext} from 'react';
import YouTube from 'react-youtube';
import PlayerContext from './PlayerContext';

function Player( { embed } ) {

  const { assignPlayer } = useContext(PlayerContext);

  const opts = {
    playerVars: {
      autoplay: 0
    }
  };

  let thisOnReady = (e) => assignPlayer(e.target);

  return (
    <>
      <YouTube className="player" videoId={embed} opts={opts} onReady={thisOnReady} />
    </>
  )
};

export default Player;