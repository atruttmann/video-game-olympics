import { useEffect, useState } from 'react';
import './Countdown.scss';

type CountdownProps = {
  startTime: number;
  endTime: number;
  winner?: string;
};

const getFormattedTime = (time: number) => {
  if (time < 10) return `0${time}`;
  return time.toString();
};

const Countdown = ({ startTime, endTime, winner }: CountdownProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [customStatus, setCustomStatus] = useState<string | null>(' ');

  useEffect(() => {
    const updateClock = () => {
      const currentTime = Date.now();

      if (currentTime < startTime) {
        setCustomStatus('Game has not started.');
      } else if (currentTime > endTime) {
        setCustomStatus(`Game over!${winner ? ` ${winner} wins.` : ''}`);
      } else {
        const remainingTime = endTime - currentTime;

        setHours(Math.floor((remainingTime / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((remainingTime / 1000 / 60) % 60));
        setSeconds(Math.floor((remainingTime / 1000) % 60));
        setCustomStatus(null);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [winner, startTime, endTime]);

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
