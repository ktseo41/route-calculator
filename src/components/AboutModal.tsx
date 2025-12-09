import {
  X,
  Image,
  Bug,
  Link as LinkIcon,
  YoutubeLogo,
  Heart,
  Sparkle,
  ArrowsDownUp,
  ChartLineUp,
  Files,
  MagicWand
} from "@phosphor-icons/react";

interface AboutModalProps {
  isOpen: boolean; onClose: () => void;
} const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">루트 계산기 v2.0.0</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body about-content">
          <section className="about-section intro-section">
            <p>
              UI를 개선하고, 기능을 추가했습니다.<br />
            </p>
          </section>

          <section className="about-section">
            <h4><Sparkle size={20} weight="fill" /> 2.0에서 추가된 기능</h4>
            <ul className="feature-list">
              <li>
                <div className="icon-box"><ArrowsDownUp size={20} /></div>
                <span>드래그로 순서 변경</span>
              </li>
              <li>
                <div className="icon-box"><ChartLineUp size={20} /></div>
                <span>누적 보기 모드</span>
              </li>
              <li>
                <div className="icon-box"><Image size={20} /></div>
                <span>이미지로 저장</span>
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h4><LinkIcon size={18} weight="bold" /> 바로가기</h4>
            <div className="link-grid">
              <a href="https://tally.so/r/KYpZWX" target="_blank" rel="noreferrer" className="link-item">
                <Bug size={18} />
                <span>버그 제보 / 문의</span>
              </a>
              <a href="https://ktseo41.github.io/route-calculator/" target="_blank" rel="noreferrer" className="link-item">
                <Files size={18} />
                <span>구 버전 계산기</span>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="link-item disabled">
                <YoutubeLogo size={18} />
                <span>사용법 영상 (준비중)</span>
              </a>
            </div>
          </section>

          <section className="about-section donation-section">
            <h4><Heart size={18} weight="fill" className="heart-icon" /> 후원하기</h4>
            <div className="donation-content">
              <p className="donation-placeholder">후원 링크 오픈 예정</p>
              <div className="work-history">
                <div className="history-item">
                  <span className="label">Initial Dev</span>
                  <span className="date">2020.04 ~ 2020.06</span>
                </div>
                <div className="history-item">
                  <span className="label">Renewal</span>
                  <span className="date">2025.09 ~ Present</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
