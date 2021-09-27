import { useEffect, useState } from "react";

const Countdown = ({ winner }) => {
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [customStatus, setCustomStatus] = useState(null);

  useEffect(() => {
    // Note that when it's regular (non-daylight savings) time it should be GMT-0800
    // Make sure to use military time
    const startTime = Date.parse("Sept 26, 2021 17:40:00 GMT-0700");
    const endTime = Date.parse("Sept 26, 2021 19:40:00 GMT-0700");

    const updateClock = () => {
      const currentTime = Date.now();

      if (currentTime < startTime) {
        setCustomStatus("Game has not started.");
      } else if (currentTime > endTime) {
        setCustomStatus(`Game over! ${winner ?? ""} wins.`);
      } else {
        const t = endTime - new Date().getTime();
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));

        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getFormattedTime = (time) => {
    if (time < 10) return `0${time}`;
    return time;
  };

  if (customStatus) {
    return (
      <div className="countdown">
        <h2 className="customStatus">{customStatus}</h2>
      </div>
    );
  }
  return (
    <div className="countdown">
      {days > 0 && (
        <div className="timeItem">
          <div className="time">{days}</div>
          Days
        </div>
      )}
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
    </div>
  );
};

export default Countdown;
