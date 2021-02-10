import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import volumeUpOutline from '@iconify-icons/eva/volume-up-outline';
import volumeOffOutline from '@iconify-icons/eva/volume-off-outline';
import { MUTE_SOUND, REPEAT_TRACK } from '../contexts/actionTypes';
import repeatFill from '@iconify-icons/eva/repeat-fill';
import { FavouriteToggle } from './FavouriteToggle';
import { store } from '../contexts/store';
import activityFill from '@iconify-icons/eva/activity-fill';
export const TrackControls = ({
  songInfo,
  dragHandler,
  changeVisualization,
}) => {
  const { state, dispatch } = useContext(store);

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
    );
  };

  //Styles
  const trackAnimation = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  const gradient = {
    background: `linear-gradient(
  to right,
  ${state.gradients[0]},
  ${state.gradients[1]}
)`,
  };

  return (
    <div className='track-controls-container'>
      <div className='track-info'>
        <p>{getTime(songInfo.currentTime)}</p>
        <div className='track' style={gradient}>
          <input
            type='range'
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
          <div className='animate-track' style={trackAnimation}></div>
        </div>
        <p>{getTime(songInfo.duration)}</p>
      </div>
      <div className='song-info'>
        <h3>
          {state.activeSong.name} - {state.activeSong.artist}
        </h3>
      </div>
      <div className='action-icons-wrapper'>
        <div
          onClick={() => {
            dispatch({ type: REPEAT_TRACK });
          }}
        >
          <Icon
            icon={repeatFill}
            height={20}
            className='action-icon'
            style={{
              opacity: `${state.repeat ? '1' : '0.3'}`,
            }}
          />
        </div>
        <FavouriteToggle id={state.activeSong.id} />
        <div
          onClick={() => {
            dispatch({ type: MUTE_SOUND });
          }}
        >
          <Icon
            icon={state.mute ? volumeOffOutline : volumeUpOutline}
            height={20}
            className='action-icon'
            style={{
              opacity: `${!state.mute ? '1' : '0.3'}`,
            }}
          />
        </div>
        <div
          onClick={() => {
            changeVisualization();
          }}
        >
          <Icon icon={activityFill} height={20} className='action-icon' />
        </div>
      </div>
    </div>
  );
};
export default TrackControls;
