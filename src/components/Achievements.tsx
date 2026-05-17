import type { Achievement, Player } from '../types';
import './TableStyles.scss';

type AchievementsProps = {
  achievements: Achievement[];
  leaderboard: Player[];
};

const Achievements = ({ achievements, leaderboard }: AchievementsProps) => {
  const getPlayerAvatar = (playerName: string) => {
    const player = leaderboard.find((leader) => leader.name === playerName);
    return player?.avatar || undefined;
  };

  const getHolderNames = (currentHolder: string) =>
    currentHolder
      .split(',')
      .map((holder) => holder.trim())
      .filter(Boolean);

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
            {achievements.map((achievement) => {
              const holderNames = getHolderNames(achievement.currentHolder);

              return (
                <tr key={achievement.description}>
                  <td>
                    <div className="flex">
                      <img className="icon" src={achievement.icon} alt="" />
                      {achievement.description}
                    </div>
                  </td>
                  <td className="alignCenter points">{achievement.points}</td>
                  <td>
                    {holderNames.length > 0 && (
                      <div className="flex achievementHolders">
                        {holderNames.map((holderName, index) => {
                          const holderAvatar = getPlayerAvatar(holderName);
                          const separator =
                            index < holderNames.length - 1 ? ', ' : '';

                          return (
                            <span className="flex" key={holderName}>
                              {holderAvatar && (
                                <img
                                  className="avatar"
                                  src={holderAvatar}
                                  alt=""
                                />
                              )}
                              {holderName}
                              {separator}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Achievements;
