import React, { useContext } from 'react';
import PlayerContext from './PlayerContext';

function Track( { data } ) {

  const { player } = useContext(PlayerContext);

  let seekPlayerTo = (e) => player.seekTo(e.target.dataset.seconds);

  return (
    <li className="list-item__track">
      <button className="track" onClick={seekPlayerTo} data-seconds={data.playAt}>
        <span className="track__title">{data.title}</span>
        <span className="track__duration">{data.playAt}</span>
      </button>
    </li>
  )
};

export default Track;