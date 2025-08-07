import React, { useState } from 'react';
import Switch from './Switch/Switch';
import './TableStyles.scss';

const Challenges = ({ challenges }) => {
  const [hideCompletedChallenges, setHideCompletedChallenges] = useState(false);
  const [hideCompletedGolds, setHideCompletedGolds] = useState(false);

  return (
    <div className="challenges section">
      <h2>Challenges</h2>
      <div className="flex">
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
                (completedGold && hideCompletedGolds)
              )
                return null;

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
