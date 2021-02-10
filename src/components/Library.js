import React, { useContext } from 'react';
import musicOutline from '@iconify-icons/eva/music-outline';
import { Icon } from '@iconify/react';
import closeOutline from '@iconify-icons/eva/close-outline';

import LibraryItem from './LibraryItem';
import { store } from '../contexts/store';
import { SET_LIBRARY_STATUS } from '../contexts/actionTypes';
import ThemeToggle from './ThemeToggle';
export const Library = () => {
  const { state, dispatch } = useContext(store);
  return (
    <div className={`library ${state.isLibraryOpen ? 'active-library' : ''}`}>
      <div className='library-header'>
        <h2>
          <Icon icon={musicOutline} width={30} /> Library
        </h2>
        <h2>
          <Icon
            icon={closeOutline}
            width={30}
            onClick={() => {
              dispatch({ type: SET_LIBRARY_STATUS });
            }}
            className='action-icon'
          />
        </h2>
      </div>
      <div className='library-items'>
        {state.songs.map((song) => (
          <LibraryItem
            key={song.id}
            song={song}
            selected={song.id === state.activeSong.id}
          />
        ))}
      </div>
      <div className='theme-toggle-wrapper'>
        Dark <ThemeToggle /> Light
      </div>
    </div>
  );
};
