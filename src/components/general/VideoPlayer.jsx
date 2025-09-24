"use client";

// import { useRef } from "react";
import classes from "./VideoPlayer.module.css";

// import useFullscreenVideo from "./useFullscreenVideo";

// function isWebView() {
//   const userAgent = navigator.userAgent || navigator.vendor || window.opera;

//   const isIOSWebView =
//     /iPhone|iPod|iPad/.test(userAgent) && !/Safari/.test(userAgent);

//   const isAndroidWebView =
//     /Android/.test(userAgent) &&
//     /Version\/[\d.]+/.test(userAgent) &&
//     !/Chrome\/[\d.]+/.test(userAgent);

//   return isIOSWebView || isAndroidWebView;
// }

const AudioPlayer = ({ src, onEnded = () => {} }) => {
  // const videoRef = useRef(null);
  // useFullscreenVideo(videoRef);

  return (
    <div className={classes.main}>
      <video
        // ref={videoRef}
        className={classes.video}
        playsinline
        autoplay
        controls
        onEnded={onEnded}
        // controlsList={isWebView() ? "nofullscreen" : "fullscreen"}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AudioPlayer;
