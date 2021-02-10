import React, { useContext } from 'react';
import { Library } from './components/Library';
import { Navigation } from './components/Navigation';
import Player from './components/Player';
import { store } from './contexts/store';

const App = () => {
  const { state } = useContext(store);
  return (
    <div className={`App ${state.themeLight ? 'light-theme' : 'dark-theme'}`}>
      <Navigation />
      <Player />
      <Library />
    </div>
  );
};

export default App;
