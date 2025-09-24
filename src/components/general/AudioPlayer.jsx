"use client";
import { useState, useRef, useEffect } from "react";
import classes from "./AudioPlayer.module.css";

const AudioPlayer = ({ src, question }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setMeta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
    };
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  return (
    <div className={classes.container}>
      {question && <div className={classes.question}>{question}</div>}

      <div className={classes.player}>
        {/* الـ waveform */}
        <div className={classes.waveform} onClick={handleSeek}>
          {[...Array(40)].map((_, i) => {
            const barHeight = Math.random() * 25 + 10;
            const percent = i / 40; // الطبيعي
            const played = currentTime / duration + 0.099; // يبدأ أسرع شوية

            return (
              <span
                key={i}
                style={{
                  height: `${barHeight}px`,
                  background:
                    1 - percent < played ? "var(--color-back-blue)" : "#ccc",
                }}
              />
            );
          })}
        </div>

        {/* الوقت */}
        <span className={classes.timeRow}>
          {formatTime(currentTime)}/{formatTime(duration)}
        </span>

        {/* زرار التشغيل */}
        <button onClick={togglePlay} className={classes.playButton}>
          {isPlaying ? "⏸" : "▶︎"}
        </button>
      </div>

      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default AudioPlayer;
