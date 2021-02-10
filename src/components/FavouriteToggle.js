import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import heartFill from '@iconify-icons/eva/heart-fill';

import { store } from '../contexts/store';
import { SET_FAVOURITE } from '../contexts/actionTypes';

export const FavouriteToggle = ({ id }) => {
  const { state, dispatch } = useContext(store);
  const song = state.songs.find((item) => item.id === id);

  return (
    <React.Fragment>
      <input
        className='fav-checkbox'
        id='favourite'
        type='checkbox'
        checked={song.isFavourite}
        onChange={() => {
          dispatch({ type: SET_FAVOURITE, payload: id });
        }}
      />
      <label htmlFor='favourite' className='fav-checkbox-label'>
        <Icon icon={heartFill} />
      </label>
    </React.Fragment>
  );
};
