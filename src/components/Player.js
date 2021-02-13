import React, { useRef, useEffect, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  IS_PLAYING,
  NEXT_SONG,
  PREVIOUS_SONG,
  SELECT_SONG,
} from '../contexts/actionTypes';
import { store } from '../contexts/store';
import TrackControls from './TrackControls';
import RoundPlayerControls, { SKIP_FORWARD } from './RoundPlayerControls';

const visualizations = ['BARS', 'BARS_2', 'DOTS'];
export const Player = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minDeviceWidth: 1224,
    minDeviceHeight: 800,
  });

  const analyser = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const context = useRef(null);

  const { state, dispatch } = useContext(store);
  const [frequencyArray, setFrequencyArray] = useState(new Uint8Array(0));
  const [pauseAnimation, setPauseAnimation] = useState(true);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const [selectedVisualization, setVisualization] = useState(0);

  const changeVisualization = () => {
    let index = selectedVisualization + 1;
    if (index >= visualizations.length) index = 0;

    setVisualization(index);
  };

  useEffect(() => {
    if (state.isPlaying && audioRef && audioRef.current)
      audioRef.current.play();
  }, [state.activeSong, state.isPlaying]);

  useEffect(() => {
    if (audioRef && audioRef.current)
      audioRef.current.volume = state.mute ? 0 : 0.5;
  }, [state.mute]);

  useEffect(() => {
    context.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = context.current.createAnalyser();
    const source = context.current.createMediaElementSource(audioRef.current);
    source.connect(analyser.current);
    analyser.current.connect(context.current.destination);
    const frequency_array = new Uint8Array(analyser.current.frequencyBinCount);
    setFrequencyArray(frequency_array);

    return () => {
      analyser.current && analyser.current.disconnect();
      source && source.disconnect();
    };
  }, []);

  useEffect(() => {
    const drawBar = (ctx, x1, y1, x2, y2, width, roundCap, lineDash) => {
      var gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, state.gradients[0]);
      gradient.addColorStop(1, state.gradients[1]);
      ctx.fillStyle = gradient;
      if (lineDash) ctx.setLineDash([5, 5]);
      if (roundCap) ctx.lineCap = 'round';

      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const drawDot = (ctx, x2, y2, width = 2) => {
      var gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, state.gradients[0]);
      gradient.addColorStop(1, state.gradients[1]);
      ctx.fillStyle = gradient;

      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();

      ctx.arc(x2, y2, width, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    };

    const draw = (circleOnly, analyser, frequency_array) => {
      if (!canvasRef.current) return;
      const bars = 100;
      const bar_width = 4;

      const canvasSize = !isDesktopOrLaptop ? 300 : 600;
      const barHeight = canvasSize === 600 ? 0.7 : 0.3;
      const radius = canvasSize === 600 ? 100 : 70;

      let canvas = canvasRef.current;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      let ctx = canvas.getContext('2d');
      let center_x = canvas.width / 2;
      let center_y = canvas.height / 2;

      if (!circleOnly) analyser.getByteFrequencyData(frequency_array);

      for (var i = 0; i < bars; i++) {
        let rads = (Math.PI * 2) / bars;
        let bar_height = !circleOnly ? frequency_array[i] * barHeight : 0;
        let x = center_x + Math.cos(rads * i) * radius;
        let y = center_y + Math.sin(rads * i) * radius;
        let x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
        let y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

        if (selectedVisualization === 0)
          drawBar(ctx, x, y, x_end, y_end, bar_width, true);
        else if (selectedVisualization === 1)
          drawBar(ctx, x, y, x_end, y_end, bar_width, false, true);
        else drawDot(ctx, x_end, y_end);
      }
    };

    const tick = () => {
      analyser.current.getByteTimeDomainData(frequencyArray);
      draw(false, analyser.current, frequencyArray);
      requestAnimationFrame(tick);
    };

    if (!pauseAnimation) tick();
  }, [
    pauseAnimation,
    frequencyArray,
    state.gradients,
    isDesktopOrLaptop,
    selectedVisualization,
  ]);

  const updateTimeHandler = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const animationPercentage = Math.round(
      (Math.round(currentTime) / Math.round(duration)) * 100
    );
    setSongInfo({
      ...songInfo,
      currentTime,
      duration,
      animationPercentage,
    });
  };

  const togglePlayHandler = () => {
    if (audioRef.current.paused) {
      if (context.current && context.current.state !== 'running') {
        context.current.resume();
      }
      setPauseAnimation(false);
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      setPauseAnimation(true);
    }
    dispatch({ type: IS_PLAYING });
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.valueAsNumber;
    setSongInfo({ ...songInfo, currentTime: e.target.valueAsNumber });
  };

  const skipSongHandler = (direction) => {
    audioRef.current.pause();

    if (state.repeat) {
      dispatch({ type: SELECT_SONG, payload: state.activeSong });
    } else {
      if (direction === SKIP_FORWARD) {
        dispatch({ type: NEXT_SONG });
      } else {
        dispatch({ type: PREVIOUS_SONG });
      }
    }

    if (state.isPlaying) {
      audioRef.current.play();
    }
  };

  const songEndHandler = () => {
    skipSongHandler(SKIP_FORWARD);
  };

  return (
    <React.Fragment>
      <div className='player-container'>
        {isDesktopOrLaptop ? (
          <canvas ref={canvasRef} width={600} height={600} />
        ) : (
          <canvas ref={canvasRef} width={300} height={300} />
        )}
        <RoundPlayerControls
          togglePlay={togglePlayHandler}
          dragHandler={dragHandler}
          songInfo={songInfo}
          isPlaying={state.isPlaying}
          skipSongHandler={skipSongHandler}
        />
        <audio
          ref={audioRef}
          src={state.activeSong.audio}
          onTimeUpdate={updateTimeHandler}
          onLoadedMetadata={updateTimeHandler}
          onEnded={songEndHandler}
        />
      </div>
      <TrackControls
        dragHandler={dragHandler}
        songInfo={songInfo}
        changeVisualization={changeVisualization}
      />
    </React.Fragment>
  );
};

export default Player;
