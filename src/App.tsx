import { FormEvent, useEffect, useRef, useState } from 'react';
import Countdown from './components/Countdown/Countdown';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Challenges from './components/Challenges';
import { fetchOlympicData } from './services/sheets';
import type { Achievement, Challenge, EventTimes, Player } from './types';
import Logo from './assets/logo.png';
import './App.scss';

const eventPassword = import.meta.env.VITE_EVENT_PASSWORD ?? '';

const App = () => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [eventTimes, setEventTimes] = useState<EventTimes | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [locked, setLocked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const gateInitialized = useRef(false);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const data = await fetchOlympicData();

        if (!active) return;

        setLeaderboard(data.leaderboard);
        setAchievements(data.achievements);
        setChallenges(data.challenges);
        setEventTimes(data.times);
        if (!gateInitialized.current) {
          setLocked(eventPassword !== '' && Date.now() < data.times.startTime);
          gateInitialized.current = true;
        }
        setLoadError(null);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : 'Unable to load spreadsheet'
        );
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocked(passwordInput !== eventPassword);
  };

  const hasLoadedData =
    leaderboard.length > 0 && challenges.length > 0 && eventTimes !== null;

  return (
    <div className="app">
      <div className="header">
        <img src={Logo} className="logo" alt="Olympic rings logo" />
        <h1>Video Game Olympics</h1>
      </div>

      {locked ? (
        <form className="password" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            aria-label="Event password"
            onChange={(event) => setPasswordInput(event.target.value)}
            value={passwordInput}
          />
          <button type="submit">Submit</button>
        </form>
      ) : loadError ? (
        <h2 className="loading">Could not load spreadsheet: {loadError}</h2>
      ) : hasLoadedData ? (
        <>
          <Countdown
            startTime={eventTimes.startTime}
            endTime={eventTimes.endTime}
            winner={leaderboard[0]?.name}
          />
          <Leaderboard leaderboard={leaderboard} />
          <Achievements achievements={achievements} leaderboard={leaderboard} />
          <Challenges challenges={challenges} players={leaderboard} />
        </>
      ) : (
        <h2 className="loading">Loading...</h2>
      )}
    </div>
  );
};

export default App;
