import { useState, useEffect, useRef } from "react";
import classes from "./Counter.module.css";
import Image from "next/image";

function Counter() {
  const INITIAL = 100;
  const [time, setTime] = useState(INITIAL);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTime(INITIAL);
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const handleResume = () => {
    if (time <= 0) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // محيط الدايرة (r=90 أكبر من قبل كده)
  const RADIUS = 120;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = (time / INITIAL) * CIRCUMFERENCE;

  return (
    <div className={classes.wrapper}>
      {/* الأيقونات فوق الدايرة */}
      <div className={classes.actions}>
        <Image
          src="/icons/recount.svg"
          alt="reset"
          width={40}
          height={40}
          className={classes.btn}
          onClick={startTimer}
        />
        {/* {isRunning ? (
          <Image
            src="/icons/pause.svg"
            alt="pause"
            width={36}
            height={40}
            className={classes.btn}
            onClick={handlePause}
          />
        ) : (
          <Image
            src="/icons/resume.svg"
            alt="resume"
            width={36}
            height={40}
            className={classes.btn}
            onClick={handleResume}
          />
        )} */}
      </div>

      {/* الدايرة + الرقم */}
      <svg className={classes.circle} width="260" height="260">
  <circle
    cx="130"
    cy="130"
    r={120}
    stroke="#ddd"
    strokeWidth="8"
    fill="none"
  />
  <circle
    cx="130"
    cy="130"
    r={120}
    stroke="var(--color-back-blue)"
    strokeWidth="8"
    fill="none"
    strokeDasharray={CIRCUMFERENCE}
    strokeDashoffset={CIRCUMFERENCE - progress}
    style={{
      transition: "stroke-dashoffset 1s linear", 
      transformOrigin: "50% 50%" // يضمن إن الدوران مظبوط
    }}
  />
</svg>


      <div className={classes.number}>{time}</div>
    </div>
  );
}

export default Counter;
