import { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
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
        playerRows.map((row) => ({
          name: row.Name,
          points: row.Points,
        }))
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

  return (
    <div className="app">
      <h1>Video Game Olympics</h1>
      <table className="leaderboard" cellSpacing="10px">
        <th>Player</th>
        <th>Points</th>
        {leaderboard.map((player) => (
          <tr>
            <td className="playerName">
              <img
                className="avatar"
                src="https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png"
                alt="Player avatar"
              />
              {player.name}
            </td>
            <td>{player.points}</td>
          </tr>
        ))}
      </table>

      <table className="topChallenges" cellSpacing="10px">
        <th>Name</th>
        <th>Gold Point Value</th>
        <th>Gold Winner Name</th>
        <th>Silver Point Value</th>
        <th>Silver Winner Name</th>
        {challenges.map((challenge) => (
          <tr>
            <td>{challenge.name}</td>
            <td>{challenge.goldVal}</td>
            <td>{challenge.goldWinner}</td>
            <td>{challenge.silverVal}</td>
            <td>{challenge.silverWinner}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
