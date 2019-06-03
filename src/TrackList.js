import React from 'react';
import Track from './Track';

function TrackList( {data} ) {

  if ( data.length < 1 ) {
    return <p>No tracks available</p>
  } else {

    // TODO: Add player controls:
    return (
      <ul className="list list__tracks">
      { data.map( (track, index) => <Track key={`track${index}`} data={track} />) }
      </ul>
    )
  }
}

export default TrackList;