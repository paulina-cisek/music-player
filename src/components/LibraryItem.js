import React, { useContext } from 'react';
import { SELECT_SONG } from '../contexts/actionTypes';
import { store } from '../contexts/store';
import { FavouriteToggle } from './FavouriteToggle';
export const LibraryItem = ({ song, selected }) => {
  const { state, dispatch } = useContext(store);

  const songSelectHandler = async () => {
    dispatch({ type: SELECT_SONG, payload: song });
  };

  const gradient = {
    background: `linear-gradient(
  to right,
  ${state.gradients[0]},
  ${state.gradients[1]}
)`,
  };
  return (
    <div
      className={`library-item ${selected ? 'selected' : ''}`}
      onClick={songSelectHandler}
    >
      <div className='item-decoration' style={gradient}></div>
      <div className='item-description'>
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
      <div className='item-actions'>
        <FavouriteToggle id={song.id} />
      </div>
    </div>
  );
};
export default LibraryItem;
