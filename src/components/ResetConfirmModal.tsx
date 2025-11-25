import React from 'react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`confirm-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">초기화 하시겠습니까?</h3>
        <p className="confirm-modal-description">
          모든 데이터가 삭제되며<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn cancel" onClick={onClose}>
            취소
          </button>
          <button className="confirm-modal-btn confirm" onClick={onConfirm}>
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
