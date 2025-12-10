import React, { useState, useEffect } from "react";
import { josa } from "es-hangul";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  jobName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  jobName,
  onClose,
  onConfirm,
}) => {
  // 모달이 열릴 때 직업명을 저장하여, 삭제 중에도 텍스트가 유지되도록 함
  const [displayJobName, setDisplayJobName] = useState(jobName);

  useEffect(() => {
    // 모달이 열릴 때만 직업명을 업데이트
    if (isOpen && jobName) {
      setDisplayJobName(jobName);
    }
  }, [isOpen, jobName]);

  return (
    <div
      className={`confirm-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">
          {josa(displayJobName, "을/를")} 삭제하시겠습니까?
        </h3>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="confirm-modal-btn confirm delete"
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
