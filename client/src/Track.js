import React, { useContext } from 'react';
import PlayerContext from './PlayerContext';

function Track( { data } ) {

  const { player } = useContext(PlayerContext);

  let onTrackSelected = (e) => {
    seekPlayerTo(e.target.dataset.seconds);
    window.scrollTo(0,0);
  }
  let seekPlayerTo = (seconds) => player.seekTo(seconds);
  let formatDuration = (duration) => new Date(1000 * duration).toISOString().substr(11,8);

  return (
    <li className="list-item__track">
      <button className="track" onClick={onTrackSelected} data-seconds={data.playAt}>
        <span className="track__title">{data.title}</span>
        <span className="track__duration">{formatDuration(data.duration)}</span>
      </button>
    </li>
  )
};

export default Track;