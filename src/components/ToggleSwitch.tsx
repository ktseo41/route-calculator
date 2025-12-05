interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch = ({ checked, onChange, label }: ToggleSwitchProps) => (
  <div className="toggle-container" onClick={onChange}>
    <div className="toggle-switch">
      <input type="checkbox" checked={checked} readOnly />
      <span className="toggle-slider"></span>
    </div>
    <span className="toggle-label-text">{label}</span>
  </div>
);

export default ToggleSwitch;
