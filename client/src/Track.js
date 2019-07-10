import React, { useContext } from 'react';
import PlayerContext from './PlayerContext';

function Track( { data, track_index } ) {

  const { player } = useContext(PlayerContext);

  let onTrackSelected = (e) => {
    seekPlayerTo(e.target.dataset.seconds);
    window.scrollTo(0,0);
  }
  
  let seekPlayerTo = (seconds) => {
    player.seekTo(seconds);
    player.playVideo();
  }

  let formatDuration = (duration) => new Date(1000 * duration).toISOString().substr(11,8);

  let formatDurationInA11y = (duration) => {
    let formatted_string = formatDuration(duration);
    let split_arr = formatted_string.split(":");
    let a11yFriendly = '';
    a11yFriendly += `${parseInt(split_arr[0])}h `;
    a11yFriendly += `${parseInt(split_arr[1])}m `;
    a11yFriendly += `${parseInt(split_arr[2])}s`;

    return a11yFriendly;
  }

  return (
    <li className="list-item__track">
      <button className="track" onClick={onTrackSelected} data-seconds={data.playAt} data-index={track_index}>
        <span className="track__index">
          <span className="a11y-visual-hidden">Track</span> {(track_index+1)}
        </span>
        <span className="track__title">{data.title}</span>
        <span className="a11y-visual-hidden">{formatDurationInA11y(data.duration)}</span>
        <time className="track__duration" dateTime={formatDurationInA11y(data.duration)}>{formatDuration(data.duration)}</time>
      </button>
    </li>
  )
};

export default Track;