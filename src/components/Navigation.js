import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import gridOutline from '@iconify-icons/eva/grid-outline';
import musicOutline from '@iconify-icons/eva/music-outline';
import { SET_LIBRARY_STATUS } from '../contexts/actionTypes';
import { store } from '../contexts/store';
export const Navigation = () => {
  const { dispatch } = useContext(store);
  return (
    <nav className='nav'>
      <h1>
        <Icon icon={musicOutline} width={30} /> Player
      </h1>
      <Icon
        icon={gridOutline}
        width={30}
        className='action-icon'
        onClick={() => {
          dispatch({ type: SET_LIBRARY_STATUS });
        }}
      />
    </nav>
  );
};
