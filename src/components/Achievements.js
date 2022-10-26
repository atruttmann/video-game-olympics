import React from "react";
import "./TableStyles.scss";

const Achievements = ({ achievements, leaderboard }) => {
  const getPlayerAvatar = (playerName) => {
    const player = leaderboard.find((player) => player.name === playerName);
    if (player) return player.avatar;
    return "";
  };

  return (
    <div className="section">
      <h2>Achievements</h2>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="points">Points</th>
              <th>Current holder</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement) => (
              <tr key={achievement.description}>
                <td>
                  <div className="flex">
                    <img className="icon" src={achievement.icon} alt="" />
                    {achievement.description}
                  </div>
                </td>
                <td className="alignCenter points">{achievement.points}</td>
                <td>
                  {achievement.currentHolder && (
                    <div className="flex">
                      <img
                        className="avatar"
                        src={getPlayerAvatar(achievement.currentHolder)}
                        alt=""
                      />
                      {achievement.currentHolder}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Achievements;
