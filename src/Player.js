import React, { useState } from 'react';
import YouTube from 'react-youtube';

function Player( { embed } ) {

  const [player, setPlayer] = useState(null);

  const opts = {
    height: '240',
    width: '480'
  };

  let thisOnReady = (e) => setPlayer(e.target);

  return (
    <div>
      <YouTube videoId={embed} opts={opts} onReady={thisOnReady} />
    </div>
  )
};

export default Player;