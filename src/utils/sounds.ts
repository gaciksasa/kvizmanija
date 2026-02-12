import correctSfx from '../assets/sounds/correct.mp3';
import wrongSfx from '../assets/sounds/wrong.mp3';
import startSfx from '../assets/sounds/start.mp3';
import finishSfx from '../assets/sounds/finish.mp3';
import selectedSfx from '../assets/sounds/selected.mp3';
import clockSfx from '../assets/sounds/clock.mp3';

let muted = false;
let startAudio: HTMLAudioElement | null = null;
let startShouldPlay = false;
let clockAudio: HTMLAudioElement | null = null;
let clockShouldPlay = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  if (startAudio && startShouldPlay) {
    if (muted) {
      startAudio.pause();
    } else {
      startAudio.play().catch(() => {});
    }
  }
  if (clockAudio && clockShouldPlay) {
    if (muted) {
      clockAudio.pause();
    } else {
      clockAudio.play().catch(() => {});
    }
  }
  return muted;
}

function play(src: string) {
  if (muted) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // Audio not supported
  }
}

export function playStart() {
  startShouldPlay = true;
  if (muted) return;
  try {
    if (startAudio) {
      startAudio.currentTime = 0;
    } else {
      startAudio = new Audio(startSfx);
      startAudio.volume = 0.3;
      startAudio.loop = true;
    }
    startAudio.play().catch(() => {});
  } catch {
    // Audio not supported
  }
}

export function stopStart() {
  startShouldPlay = false;
  if (startAudio) {
    startAudio.pause();
    startAudio.currentTime = 0;
  }
}

export function playClock() {
  clockShouldPlay = true;
  if (muted) return;
  try {
    if (clockAudio) {
      clockAudio.currentTime = 0;
    } else {
      clockAudio = new Audio(clockSfx);
      clockAudio.volume = 0.3;
      clockAudio.loop = true;
    }
    clockAudio.play().catch(() => {});
  } catch {
    // Audio not supported
  }
}

export function stopClock() {
  clockShouldPlay = false;
  if (clockAudio) {
    clockAudio.pause();
    clockAudio.currentTime = 0;
  }
}

export function playCorrect() { play(correctSfx); }
export function playWrong() { play(wrongSfx); }
export function playFinish() { play(finishSfx); }
export function playSelected() { play(selectedSfx); }
export function playClick() { play(correctSfx); }
