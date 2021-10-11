import { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Countdown from "./Countdown";
import Logo from "./logo.jpg";
import "./App.scss";

const App = () => {
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
            lockedGames: row["Locked Games"],
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
          goldWinner: row["Gold Winner Name"] ?? "",
          silverVal: row["Silver Point Value"],
          silverWinner: row["Silver Winner Name"] ?? "",
          bronzeVal: row["Bronze Point Value"],
          bronzeWinner: row["Bronze Winner Name"] ?? "",
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

  const checkIfCompleted = (challenge) => {
    if (challenge.bronzeWinner !== "") return "completed";
    return "";
  };

  return (
    <div className="app">
      <div className="header">
        <img src={Logo} className="logo" alt="Olympic rings logo" />
        <h1>Video Game Olympics</h1>
      </div>

      <Countdown winner={leaderboard[0]?.name} />

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th className="medal" />
                <th className="points">Points</th>
                <th>Player</th>
                <th>Locked Games</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={player.name}>
                  <td className="medal">
                    {player.points > 0 && getMedal(index)}
                  </td>
                  <td className="alignCenter points">{player.points}</td>
                  <td>
                    <div className="playerName">
                      <img
                        className="avatar"
                        src={player.avatar}
                        alt="Player avatar"
                      />
                      {player.name}
                    </div>
                  </td>
                  <td>{player.lockedGames}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="challenges">
        <h2>All challenges</h2>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Challenge Name</th>
                <th className="alignCenter">🥇</th>
                <th>Winner</th>
                <th className="alignCenter">🥈</th>
                <th>Winner</th>
                <th className="alignCenter">🥉</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr
                  key={challenge.name}
                  className={checkIfCompleted(challenge)}
                >
                  <td>{challenge.name}</td>
                  <td className="alignCenter">{challenge.goldVal}</td>
                  <td>{challenge.goldWinner}</td>
                  <td className="alignCenter">{challenge.silverVal}</td>
                  <td>{challenge.silverWinner}</td>
                  <td className="alignCenter">{challenge.bronzeVal}</td>
                  <td>{challenge.bronzeWinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
