import { useState } from 'react';
import type { Challenge, Player } from '../types';
import Switch from './Switch/Switch';
import './TableStyles.scss';

type ChallengesProps = {
  challenges: Challenge[];
  players: Player[];
};

const challengeHasWinner = (challenge: Challenge, playerName: string) =>
  challenge.goldWinner === playerName ||
  challenge.silverWinner === playerName ||
  challenge.bronzeWinner === playerName;

const Challenges = ({ challenges, players }: ChallengesProps) => {
  const [hideCompletedChallenges, setHideCompletedChallenges] = useState(false);
  const [hideCompletedGolds, setHideCompletedGolds] = useState(false);
  const [hiddenPlayerName, setHiddenPlayerName] = useState('');

  return (
    <div className="challenges section">
      <h2>Challenges</h2>
      <div className="flex challengeFilters">
        <Switch
          toggleSwitch={() =>
            setHideCompletedChallenges(!hideCompletedChallenges)
          }
        >
          Hide completed challenges
        </Switch>
        <Switch toggleSwitch={() => setHideCompletedGolds(!hideCompletedGolds)}>
          Hide completed golds
        </Switch>
        <label className="playerFilter">
          Hide player
          <select
            onChange={(event) => setHiddenPlayerName(event.target.value)}
            value={hiddenPlayerName}
          >
            <option value="">None</option>
            {players.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      </div>
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
            {challenges.map((challenge) => {
              const completed = challenge.bronzeWinner !== '';
              const completedGold = challenge.goldWinner !== '';
              if (
                (completed && hideCompletedChallenges) ||
                (completedGold && hideCompletedGolds) ||
                (hiddenPlayerName !== '' &&
                  challengeHasWinner(challenge, hiddenPlayerName))
              ) {
                return null;
              }

              return (
                <tr
                  key={challenge.name}
                  className={completed ? 'completed' : ''}
                >
                  <td>
                    <div className="flex">
                      <img className="icon" src={challenge.icon} alt="" />
                      {challenge.name}
                    </div>
                  </td>
                  <td className="alignCenter">{challenge.goldVal}</td>
                  <td>{challenge.goldWinner}</td>
                  <td className="alignCenter">{challenge.silverVal}</td>
                  <td>{challenge.silverWinner}</td>
                  <td className="alignCenter">{challenge.bronzeVal}</td>
                  <td>{challenge.bronzeWinner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Challenges;
