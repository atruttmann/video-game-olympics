import React, { useEffect, useState } from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Countdown from './components/Countdown/Countdown';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Challenges from './components/Challenges';
import Logo from './assets/logo.png';
import './App.scss';

const password = 'theobaby';

// Note that when it's regular (non-daylight savings) time it should be GMT-0800. Otherwise GMT-0700.
// Make sure to use military time
const startTime = Date.parse('August 10, 2025 17:30:00 GMT-0700');
const endTime = Date.parse('August 10, 2025 20:00:00 GMT-0700');

const App = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [passwordInput, setPasswordInput] = useState('');
  const [locked, setLocked] = useState(Date.now() < startTime);

  useEffect(() => {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(
      '1Ro0dAbWXEqr9V_EcxXC72oW9jA4RQC1aBK6mM5sqw5k'
    );
    const creds = require('./config/creds.json'); // file with api key

    const fetchData = async () => {
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo(); // loads document properties and worksheets

      const leaderboardSheet = doc.sheetsByIndex[0];
      const playerRows = await leaderboardSheet.getRows();
      setLeaderboard(
        playerRows
          .map((row) => ({
            name: row.Name,
            points: row.Points,
            avatar: row.Avatar,
            lockedGames: row['Locked Games'],
          }))
          .sort((a, b) => b.points - a.points)
      );

      const achievementsSheet = doc.sheetsByIndex[2];
      const achievementsRows = await achievementsSheet.getRows();
      setAchievements(
        achievementsRows.map((row) => ({
          description: row.Description,
          icon: row.Icon,
          points: row.Points,
          currentHolder: row['Current holder'],
        }))
      );

      const challengesSheet = doc.sheetsByIndex[1];
      const challengeRows = await challengesSheet.getRows();
      setChallenges(
        challengeRows.map((row) => ({
          name: row['Challenge Name'],
          type: row['Challenge Type'],
          icon: row['Challenge Icon'],
          goldVal: row['Gold Point Value'],
          goldWinner: row['Gold Winner Name'] ?? '',
          silverVal: row['Silver Point Value'],
          silverWinner: row['Silver Winner Name'] ?? '',
          bronzeVal: row['Bronze Point Value'],
          bronzeWinner: row['Bronze Winner Name'] ?? '',
        }))
      );
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // pull data every 10 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app">
      <div className="header">
        <img src={Logo} className="logo" alt="Olympic rings logo" />
        <h1>Video Game Olympics</h1>
      </div>

      {locked ? (
        <div className="password">
          <input
            type="password"
            onChange={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
          />
          <button onClick={() => setLocked(!(passwordInput === password))}>
            Submit
          </button>
        </div>
      ) : leaderboard.length > 0 && challenges.length > 0 ? (
        <>
          <Countdown
            startTime={startTime}
            endTime={endTime}
            winner={leaderboard[0]?.name}
          />
          <Leaderboard leaderboard={leaderboard} />
          <Achievements achievements={achievements} leaderboard={leaderboard} />
          <Challenges challenges={challenges} />
        </>
      ) : (
        <h2 className="loading">Loading...</h2>
      )}
    </div>
  );
};

export default App;
