import type { PropsWithChildren } from 'react';
import './Switch.scss';

type SwitchProps = PropsWithChildren<{
  toggleSwitch?: () => void;
}>;

const Switch = ({ toggleSwitch = () => {}, children }: SwitchProps) => (
  <div className="switchContainer">
    <label className="switch">
      <input type="checkbox" onChange={toggleSwitch} />
      <span className="slider" />
    </label>
    <span>{children}</span>
  </div>
);

export default Switch;
