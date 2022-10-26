import React, { useEffect, useState } from "react";
import "./Countdown.scss";

const Countdown = ({ startTime, endTime, winner }) => {
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [customStatus, setCustomStatus] = useState(" ");

  useEffect(() => {
    const updateClock = () => {
      const currentTime = Date.now();

      if (currentTime < startTime) {
        setCustomStatus("Game has not started.");
      } else if (currentTime > endTime) {
        setCustomStatus(`Game over!${winner ? ` ${winner} wins.` : ""}`);
      } else {
        const t = endTime - new Date().getTime();
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);

        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
        setCustomStatus(null);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [winner, startTime, endTime]);

  const getFormattedTime = (time) => {
    if (time < 10) return `0${time}`;
    return time;
  };

  return (
    <div className="countdown section">
      {customStatus ? (
        <h2 className="customStatus">{customStatus}</h2>
      ) : (
        <>
          <div className="timeItem">
            <div className="time">{getFormattedTime(hours)}</div>
            Hours
          </div>
          <div className="timeItem">
            <div className="time">{getFormattedTime(minutes)}</div>
            Minutes
          </div>
          <div className="timeItem">
            <div className="time">{getFormattedTime(seconds)}</div>
            Seconds
          </div>
        </>
      )}
    </div>
  );
};

export default Countdown;
