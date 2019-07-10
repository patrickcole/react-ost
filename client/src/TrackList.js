import React from 'react';
import Track from './Track';

function TrackList( {data} ) {

  if ( data.length < 1 ) {
    return <p>No tracks available</p>
  } else {
    return (
      <nav role="navigation" aria-label="Soundtrack Track List">
        <ul className="list list__tracks">
          { data.map( (track, index) => <Track key={`track${index}`} track_index={index} data={track} />) }
        </ul>
      </nav>
    )
  }
}

export default TrackList;