import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import arrowIosBackFill from '@iconify-icons/eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify-icons/eva/arrow-ios-forward-fill';
import playSolid from '@iconify-icons/clarity/play-solid';
import pauseSolid from '@iconify-icons/clarity/pause-solid';
import { store } from '../contexts/store';
export const SKIP_FORWARD = 'SKIP_FORWARD';
export const SKIP_BACK = 'SKIP_BACK';
export const REPEAT = 'REPEAT';

export const RoundPlayerControls = ({ togglePlay, skipSongHandler }) => {
  const { state } = useContext(store);

  return (
    <div className='round-player-controls-container'>
      <div className='round-player-controls'>
        <Icon
          icon={arrowIosBackFill}
          className='action-icon'
          height={'70px'}
          onClick={() => skipSongHandler(SKIP_BACK)}
        />
        <div className='play-icon-wrapper action-icon'>
          <Icon
            icon={state.isPlaying ? pauseSolid : playSolid}
            onClick={togglePlay}
            height={'60px'}
          />
        </div>
        <Icon
          icon={arrowIosForwardFill}
          className='action-icon'
          height={'70px'}
          onClick={() => skipSongHandler(SKIP_FORWARD)}
        />
      </div>
    </div>
  );
};
export default RoundPlayerControls;
