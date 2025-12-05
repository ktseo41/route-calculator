import { 
  ArrowsOutLineVertical, 
  MinusCircle, 
  Broom, 
  ShareNetwork, 
  Spinner, 
  Info 
} from "@phosphor-icons/react";
import ToggleSwitch from "./ToggleSwitch";

import logo from "../img/logo.png";

interface AppHeaderProps {
  rLLLength: number;
  isSharing: boolean;
  isCumulative: boolean;
  isReorderMode: boolean;
  deleteMode: boolean;
  onInfoClick: () => void;
  onResetClick: () => void;
  onShareClick: () => void;
  onCumulativeToggle: () => void;
  onReorderToggle: () => void;
  onDeleteToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AppHeader = ({
  rLLLength,
  isSharing,
  isCumulative,
  isReorderMode,
  deleteMode,
  onInfoClick,
  onResetClick,
  onShareClick,
  onCumulativeToggle,
  onReorderToggle,
  onDeleteToggle,
}: AppHeaderProps) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo">
          <div className="logo-icon" style={{ background: 'none', padding: 0 }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="title">루트 계산기</span>
          <span className="version">v2.0.0</span>
        </div>
        <div className="header-actions">
          <button 
            className="icon-btn" 
            aria-label="Info" 
            onClick={onInfoClick}
          >
            <Info />
          </button>
          <button 
            className="icon-btn" 
            aria-label="Reset" 
            onClick={onResetClick}
            style={rLLLength <= 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
          >
            <Broom />
          </button>
          <button className="icon-btn" aria-label="Share" onClick={onShareClick}>
            {isSharing ? <Spinner className="animate-spin" /> : <ShareNetwork />}
          </button>
        </div>
      </div>
      
      <div className="header-bottom mobile-only">
        <div className="header-controls-left">
          <ToggleSwitch 
            checked={isCumulative} 
            onChange={onCumulativeToggle} 
            label="누적 잡포인트 보기" 
          />
        </div>
        <div className="header-controls-right">
          <button 
            className={`icon-btn ${isReorderMode ? 'active' : ''}`} 
            aria-label="Reorder Mode" 
            onClick={onReorderToggle}
            style={isReorderMode ? { backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' } : {}}
          >
            <ArrowsOutLineVertical />
          </button>
          <button 
            className={`icon-btn ${deleteMode ? 'active' : ''}`} 
            aria-label="Delete Mode" 
            onClick={onDeleteToggle}
            style={deleteMode ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' } : {}}
          >
            <MinusCircle />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
