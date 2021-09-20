import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.scss";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const leaderboardLink =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYTR3sU0_2y3FMU6EtmcJFUk5f-7iC8wmMxcYBSeylok9VWVW5fYVlHOnOVucCo0zgvHoaRC-uaqpQ/pub?gid=0&single=true&output=csv";
  const challengesLink =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYTR3sU0_2y3FMU6EtmcJFUk5f-7iC8wmMxcYBSeylok9VWVW5fYVlHOnOVucCo0zgvHoaRC-uaqpQ/pub?gid=1688795872&single=true&output=csv";

  // TODO bug sometimes papaparse shows old data after updating to correct data
  useEffect(() => {
    const fetchData = () => {
      Papa.parse(leaderboardLink, {
        download: true,
        header: true,
        complete: (results) => {
          setLeaderboard(results.data);
        },
      });
      Papa.parse(challengesLink, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setChallenges(results.data);
        },
      });
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // pull data every 30 seconds
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
              {player.Name}
            </td>
            <td>{player.Points}</td>
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
            <td>{challenge["Challenge Name"]}</td>
            <td>{challenge["Gold Point Value"]}</td>
            <td>{challenge["Gold Winner Name"]}</td>
            <td>{challenge["Silver Point Value"]}</td>
            <td>{challenge["Silver Winner Name"]}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
