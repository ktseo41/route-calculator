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
          <div className="logo-icon logo-icon--image">
            <img src={logo} alt="Logo" />
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
            className={`icon-btn ${rLLLength <= 1 ? 'icon-btn--disabled' : ''}`}
            aria-label="Reset" 
            onClick={onResetClick}
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
            className={`icon-btn ${isReorderMode ? 'icon-btn--reorder-active' : ''}`}
            aria-label="Reorder Mode" 
            onClick={onReorderToggle}
          >
            <ArrowsOutLineVertical />
          </button>
          <button 
            className={`icon-btn ${deleteMode ? 'icon-btn--delete-active' : ''}`}
            aria-label="Delete Mode" 
            onClick={onDeleteToggle}
          >
            <MinusCircle />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
