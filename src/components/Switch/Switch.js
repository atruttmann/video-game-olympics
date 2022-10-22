import React from "react";
import "./Switch.scss";

const Switch = ({ toggleSwitch = () => {}, children }) => (
  <div className="switchContainer">
    <label className="switch">
      <input type="checkbox" onClick={() => toggleSwitch()} />
      <span className="slider" />
    </label>
    <span>{children}</span>
  </div>
);

export default Switch;
