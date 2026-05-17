import type { Player } from '../types';
import './TableStyles.scss';

type LeaderboardProps = {
  leaderboard: Player[];
};

const getMedal = (index: number) => {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return '';
  }
};

const Leaderboard = ({ leaderboard }: LeaderboardProps) => (
  <div className="leaderboard section">
    <h2>Leaderboard</h2>
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th className="medal" />
            <th className="points">Points</th>
            <th>Player</th>
            <th>🔒 Locked Games</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.name}>
              <td className="medal">{player.points > 0 && getMedal(index)}</td>
              <td className="alignCenter points">{player.points}</td>
              <td>
                <div className="flex">
                  <img className="avatar" src={player.avatar} alt="" />
                  {player.name}
                </div>
              </td>
              <td className="small">
                <i>{player.lockedGames}</i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Leaderboard;
