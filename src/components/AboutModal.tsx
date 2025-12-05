import { X } from "@phosphor-icons/react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>about</h3>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-body">
          <p>루트 계산기를 이용해 주셔서 감사합니다.</p>
          <p>이 앱은 여러분의 캐릭터 육성 시뮬레이션을 돕기 위해 제작되었습니다.</p>
          <br />
          <p>문의사항이나 건의사항이 있으시면 언제든 연락주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
