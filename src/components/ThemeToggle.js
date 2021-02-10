import React, { useContext } from 'react';
import { SET_THEME } from '../contexts/actionTypes';
import { store } from '../contexts/store';
export const ThemeToggle = () => {
  const { state, dispatch } = useContext(store);

  return (
    <label className='theme-toggle'>
      <input
        type='checkbox'
        checked={state.themeLight}
        onChange={() => {
          dispatch({ type: SET_THEME });
        }}
      />
      <div></div>
    </label>
  );
};
export default ThemeToggle;
