import { useEffect, useState } from "react";

const Countdown = ({ winner }) => {
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Note that when it's regular (non-daylight savings) time it should be GMT-0800
    // Make sure to use military time
    const startTime = Date.parse("Oct 2, 2021 12:00:00 GMT-0700");
    const endTime = Date.parse("Oct 2, 2021 16:00:00 GMT-0700");

    const updateClock = () => {
      const currentTime = Date.now();

      if (currentTime > endTime) {
        setGameOver(true);
      } else {
        let deadline;
        if (currentTime < startTime) {
          deadline = startTime;
        } else {
          deadline = endTime;
        }

        const t = deadline - new Date().getTime();
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

  if (gameOver) {
    return (
      <div className="countdown">
        <h2 className="gameOver">{`Game over! ${
          winner ?? ""
        } claims victory 👑`}</h2>
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
