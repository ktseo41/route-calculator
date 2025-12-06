import React from 'react';
import { X, DownloadSimple, Image, Check, Copy, Spinner } from "@phosphor-icons/react";

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
            <X weight="bold" />
          </button>
        </div>
        
        <div className="share-input-container">
          <label className="share-input-label">
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
              <DownloadSimple />
            </div>
            <span className="share-label">이미지로 저장</span>
          </button>
          
          <button 
            className="share-option-btn" 
            onClick={onShareImage}
            disabled={isSharing}
          >
            <div className="share-icon-wrapper">
              <Image />
            </div>
            <span className="share-label">이미지로 공유</span>
          </button>
          
          <button 
            className="share-option-btn" 
            onClick={onShareUrl}
            disabled={isSharing}
          >
            <div className={`share-icon-wrapper ${isUrlCopied ? 'share-icon-wrapper--copied' : ''}`}>
              {isUrlCopied ? <Check /> : <Copy />}
            </div>
            <span className="share-label">{isUrlCopied ? '복사됨' : 'URL 복사'}</span>
          </button>
        </div>
        
        {isSharing && (
          <div className="share-loading-overlay">
            <Spinner className="animate-spin" />
            <span>처리 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
