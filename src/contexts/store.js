import React, { createContext, useReducer } from 'react';
import {
  IS_PLAYING,
  MUTE_SOUND,
  NEXT_SONG,
  PREVIOUS_SONG,
  REPEAT_TRACK,
  SELECT_SONG,
  SET_FAVOURITE,
  SET_LIBRARY_STATUS,
  SET_THEME,
} from './actionTypes';
import { library } from '../data';
import { getRandomColor } from '../styles/colors';

const initialState = {
  isPlaying: false,
  activeSong: library[0],
  songs: library,
  gradients: ['#c398ea', '#e1858c'],
  isLibraryOpen: false,
  themeLight: false,
  mute: false,
  repeat: false,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case IS_PLAYING:
        let newState = { ...state, isPlaying: !state.isPlaying };
        return newState;
      case NEXT_SONG:
        return {
          ...state,
          activeSong:
            state.songs[getSongIndex(state.songs, state.activeSong, true)],
          gradients: [getRandomColor(), getRandomColor()],
        };
      case PREVIOUS_SONG:
        return {
          ...state,
          activeSong:
            state.songs[getSongIndex(state.songs, state.activeSong, false)],
          gradients: [getRandomColor(), getRandomColor()],
        };
      case SELECT_SONG:
        return {
          ...state,
          activeSong: action.payload,
          gradients: [getRandomColor(), getRandomColor()],
        };
      case SET_LIBRARY_STATUS:
        return {
          ...state,
          isLibraryOpen: !state.isLibraryOpen,
        };
      case SET_THEME:
        return {
          ...state,
          themeLight: !state.themeLight,
        };
      case MUTE_SOUND:
        return {
          ...state,
          mute: !state.mute,
        };
      case REPEAT_TRACK:
        return {
          ...state,
          repeat: !state.repeat,
        };
      case SET_FAVOURITE:
        return {
          ...state,
          activeSong: {
            ...state.activeSong,
            isFavourite: !state.activeSong.isFavourite,
          },
          songs: state.songs.map((item) =>
            item.id !== action.payload
              ? item
              : { ...item, isFavourite: !item.isFavourite }
          ),
        };
      default:
        return state;
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

const getSongIndex = (songs, activeSong, next) => {
  let currentIndex = songs.findIndex((song) => song.id === activeSong.id);
  if (next) {
    return currentIndex + 1 >= songs.length ? 0 : currentIndex + 1;
  } else {
    return currentIndex - 1 < 0 ? songs.length - 1 : currentIndex - 1;
  }
};

export { store, StateProvider };
