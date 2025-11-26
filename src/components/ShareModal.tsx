import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadImage: () => void;
  onShareImage: () => void;
  onShareUrl: () => void;
  isSharing: boolean;
  isUrlCopied: boolean;
  customText: string;
  onCustomTextChange: (text: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  onDownloadImage, 
  onShareImage, 
  onShareUrl,
  isSharing,
  isUrlCopied,
  customText,
  onCustomTextChange
}) => {
  return (
    <div className={`confirm-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="confirm-modal share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3 className="confirm-modal-title">공유하기</h3>
          <button className="share-modal-close" onClick={onClose}>
            <i className="ph-bold ph-x"></i>
          </button>
        </div>
        
        <div className="share-input-container" style={{ marginBottom: '16px', padding: '0 4px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            이미지에 포함할 텍스트 (선택)
          </label>
          <input
            type="text"
            className="share-custom-input"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="예: 내 루트 1, 엘서버 XXX"
          />
        </div>

        <div className="share-options">
          <button 
            className="share-option-btn" 
            onClick={onDownloadImage}
            disabled={isSharing}
          >
            <div className="share-icon-wrapper">
              <i className="ph ph-download-simple"></i>
            </div>
            <span className="share-label">이미지로 저장</span>
          </button>
          
          <button 
            className="share-option-btn" 
            onClick={onShareImage}
            disabled={isSharing}
          >
            <div className="share-icon-wrapper">
              <i className="ph ph-image"></i>
            </div>
            <span className="share-label">이미지로 공유</span>
          </button>
          
          <button 
            className="share-option-btn" 
            onClick={onShareUrl}
            disabled={isSharing}
          >
            <div className="share-icon-wrapper" style={isUrlCopied ? { color: 'var(--success)', backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}}>
              <i className={`ph ${isUrlCopied ? 'ph-check' : 'ph-copy'}`}></i>
            </div>
            <span className="share-label">{isUrlCopied ? '복사됨' : 'URL 복사'}</span>
          </button>
        </div>
        
        {isSharing && (
          <div className="share-loading-overlay">
            <i className="ph ph-spinner animate-spin"></i>
            <span>처리 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
