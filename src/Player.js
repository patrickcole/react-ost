import React, { useContext} from 'react';
import YouTube from 'react-youtube';
import PlayerContext from './PlayerContext';

function Player( { embed } ) {

  const { assignPlayer } = useContext(PlayerContext);

  const opts = {
    height: '100',
    playerVars: {
      autoplay: 0
    }
  };

  let thisOnReady = (e) => assignPlayer(e.target);

  return (
    <div>
      <YouTube videoId={embed} opts={opts} onReady={thisOnReady} />
    </div>
  )
};

export default Player;