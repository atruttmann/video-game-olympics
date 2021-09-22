import { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Logo from "./logo.png";
import "./App.scss";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(
      "1OuBG8d4xZtw8utOVonv4O3bXJtxcoLnGv-o2TOplDCY"
    );
    const creds = require("./config/video-game-olympics-a99675815598.json"); // file with api key

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
          }))
          .sort((a, b) => b.points - a.points)
      );

      const challengesSheet = doc.sheetsByIndex[1];
      const challengeRows = await challengesSheet.getRows();
      setChallenges(
        challengeRows.map((row) => ({
          name: row["Challenge Name"],
          type: row["Challenge Type"],
          goldVal: row["Gold Point Value"],
          goldWinner: row["Gold Winner Name"],
          silverVal: row["Silver Point Value"],
          silverWinner: row["Silver Winner Name"],
        }))
      );
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // pull data every 5 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <div className="app">
      <div className="header">
        <img src={Logo} className="logo" alt="Olympic rings logo" />
        <h1>Video Game Olympics</h1>
      </div>

      <table className="leaderboard">
        <th>Player</th>
        <th>Points</th>
        <th />
        {leaderboard.map((player, index) => (
          <tr>
            <td className="playerName">
              <img className="avatar" src={player.avatar} alt="Player avatar" />
              {player.name}
            </td>
            <td className="alignCenter">{player.points}</td>
            <td className="lessPadding">{getMedal(index)}</td>
          </tr>
        ))}
      </table>

      <table className="topChallenges">
        <th>Challenge Name</th>
        <th>🥇 Points</th>
        <th>🥇 Winner</th>
        <th>🥈 Points</th>
        <th>🥈 Winner</th>
        {challenges.map((challenge) => (
          <tr>
            <td>{challenge.name}</td>
            <td className="alignCenter">{challenge.goldVal}</td>
            <td className="alignCenter">{challenge.goldWinner}</td>
            <td className="alignCenter">{challenge.silverVal}</td>
            <td className="alignCenter">{challenge.silverWinner}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
