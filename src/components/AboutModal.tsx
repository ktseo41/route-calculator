import {
  X,
  Image,
  Bug,
  Link as LinkIcon,
  YoutubeLogo,
  Heart,
  Sparkle,
  ArrowsOutLineVertical,
  ChartLineUp,
  Files,
} from "@phosphor-icons/react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content about-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">루트 계산기 v2.0.0</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body about-content">
          <section className="about-section">
            <p>
              UI를 개선하고, 기능을 추가했습니다.
              <br />
            </p>
          </section>

          <section className="about-section">
            <h4>
              <Sparkle size={20} weight="fill" /> 2.0에서 추가된 기능
            </h4>
            <ul className="feature-list">
              <li>
                <div className="icon-box">
                  <ArrowsOutLineVertical size={20} />
                </div>
                <span>드래그로 순서 변경</span>
              </li>
              <li>
                <div className="icon-box">
                  <ChartLineUp size={20} />
                </div>
                <span>누적 보기 모드</span>
              </li>
              <li>
                <div className="icon-box">
                  <Image size={20} />
                </div>
                <span>이미지로 저장</span>
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h4>
              <LinkIcon size={18} weight="bold" /> 바로가기
            </h4>
            <div className="link-grid">
              <a
                href="https://tally.so/r/0QdJB9"
                target="_blank"
                rel="noreferrer"
                className="link-item"
              >
                <Bug size={18} />
                <span>버그 제보 / 문의</span>
              </a>
              <a
                href="https://ktseo41.github.io/route-calculator/"
                target="_blank"
                rel="noreferrer"
                className="link-item"
              >
                <Files size={18} />
                <span>구 버전 계산기</span>
              </a>
              <a
                href="https://youtube.com/shorts/7roI_TdYsEM?feature=share"
                target="_blank"
                rel="noreferrer"
                className="link-item"
              >
                <YoutubeLogo size={18} />
                <span>소개 영상</span>
              </a>
            </div>
          </section>

          <section className="about-section donation-section">
            <h4>
              <Heart size={18} weight="fill" className="heart-icon" /> 후원하기
            </h4>
            <div className="donation-content">
              <a
                href="https://ko-fi.com/elanroutecalc"
                target="_blank"
                rel="noreferrer"
                className="donation-link"
              >
                Ko-fi에서 후원하기
              </a>
              <a
                href="https://ko-fi.com/post/%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94-%ED%9B%84%EC%9B%90-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%A5%BC-%EC%97%B4%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4-N4N01PZ6G0"
                target="_blank"
                rel="noreferrer"
                className="donation-link donation-link--secondary"
              >
                후원 소개글
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
