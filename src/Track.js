import React, { useContext } from 'react';
import PlayerContext from './PlayerContext';

function Track( { data } ) {

  const { player } = useContext(PlayerContext);

  let seekPlayerTo = (e) => player.seekTo(e.target.dataset.seconds);

  return (
    <li>
      <button onClick={seekPlayerTo} data-seconds={data.playAt}>{data.title}</button>
    </li>
  )
};

export default Track;