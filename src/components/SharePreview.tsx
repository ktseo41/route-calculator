import { forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RouteLinkedList from '../lib/routeLinkedList';
import { getCustomQueryFromRLL } from '../lib/routeUtils';
import logo from '../img/logo.png';

interface SharePreviewProps {
  rLL: RouteLinkedList;
  customText: string;
}

const SharePreview = forwardRef<HTMLDivElement, SharePreviewProps>(({ rLL, customText }, ref) => {
  if (!rLL) return null;
  const queryToSave = getCustomQueryFromRLL(rLL);

  return (
    <div 
      ref={ref}
      className="share-preview-container"
    >
      {/* Table Header */}
      <div className="share-preview-header">
        <span className="share-preview-header__job">직업</span>
        <div className="share-preview-header__stats">
          <span className="share-preview-header__stat">STR</span>
          <span className="share-preview-header__stat">INT</span>
          <span className="share-preview-header__stat">AGI</span>
          <span className="share-preview-header__stat">VIT</span>
        </div>
        <span className="share-preview-header__po">PO</span>
      </div>

      {/* Table Body */}
      <div className="route-body">
        {rLL.getAllNodes().map((node) => {
          if (!node) return null;
          return (
            <div 
              key={uuidv4()} 
              className="share-preview-row"
            >
              <span className="share-preview-row__job">{node.job}</span>
              <div className="share-preview-row__stats">
                <span className="share-preview-row__stat">{node.stats.STR}</span>
                <span className="share-preview-row__stat">{node.stats.INT}</span>
                <span className="share-preview-row__stat">{node.stats.AGI}</span>
                <span className="share-preview-row__stat">{node.stats.VIT}</span>
              </div>
              <div className="share-preview-row__po-wrapper">
                <span className="share-preview-row__po-badge">
                  {node.jobPo}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="share-preview-footer">
        {/* URL */}
        <div className="share-preview-footer__url">
          {queryToSave}
        </div>

        {/* Signature */}
        <div className="share-preview-footer__signature">
          <img 
            src={logo} 
            alt="Logo" 
            className="share-preview-footer__logo"
          />
          <span className="share-preview-footer__text">
            {customText ? `${customText} · 루트 계산기` : "루트 계산기"}
          </span>
        </div>
      </div>
    </div>
  );
});

SharePreview.displayName = 'SharePreview';

export default SharePreview;
